import { EventHandler, eventHandler } from "vinxi/http";
import counter from "~/ws/counter";
import fileRoutes from "vinxi/routes";
import { createRouter } from "radix3"

function lazyEventHandler(fn: () => EventHandler) {
  return fn();
}

export default lazyEventHandler(() => {
  const router = createRouter();

  fileRoutes.forEach(route => {
    router.insert(route.path, route);
  });

  return eventHandler({
    handler: async (event) => {
      const route = router.lookup(event.path);
      if (!route) {
        return new Response(null, { status: event.path === "/" ? 426 : 404 });
      }

      const handler = route[`$${event.method}`];
      if (!handler) {
        return new Response(null, { status: 405 });
      }

      const module = await handler.import();
      const response = await module[event.method](event);
      return response || new Response(null, { status: 200 });
    },
    websocket: {
      upgrade(_req) {
        // noop
      },
      open(peer) {
        counter.subscribe(peer);
      },
      message(_peer, _message) {
        counter.value++;
      },
      close(peer) {
        counter.unsubscribe(peer);
      }
    }
  });
});
