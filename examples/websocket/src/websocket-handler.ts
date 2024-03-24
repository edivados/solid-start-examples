import { EventHandler, eventHandler } from "vinxi/http";

function lazyEventHandler(fn: () => EventHandler) {
  return fn();
}

export default lazyEventHandler(() => {
  let counter = 0;
  return eventHandler({
    handler: () => {},
    websocket: {
      upgrade(req) {
        // noop
      },
      open(peer) {
        peer.subscribe("counter");
        peer.send(counter);
      },
      message(peer, message) {
        ++counter;
        // Publish does not include the current peer.
        peer.send(counter);
        peer.publish("counter", counter);
      },
      close(peer) {
        peer.unsubscribe("counter");
      }
    }
  });
});
