import { EventHandler, eventHandler } from "vinxi/http";
import type { Peer } from "crossws";

function lazyEventHandler(fn: () => EventHandler) {
  return fn();
}

export default lazyEventHandler(() => {
  const peers = new Set<Peer>();
  let counter = 0;
  return eventHandler({
    handler: () => {},
    websocket: {
      upgrade(req) {
        // noop
      },
      open(peer) {
        peers.add(peer);
        peer.send(counter);
      },
      message(peer, message) {
        ++counter;
        // not using pub/sub because it is only available for bun and node.
        // https://crossws.unjs.io/guide/pubsub
        for (const peer of peers) {
          peer.send(counter);
        }
      },
      close(peer) {
        peers.delete(peer);
      }
    }
  });
});
