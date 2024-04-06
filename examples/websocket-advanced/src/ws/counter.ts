import type { Peer } from "crossws";

export default {
  _value: 0,
  _peers: new Set<Peer>(),
  _broadcast() {
    for(const peer of this._peers) {
      peer.send(this.value)
    }
  },
  get value() {
    return this._value;
  },
  set value(val) {
    if (this._value !== val) {
      this._value = val;
      this._broadcast();
    }
  },
  subscribe(peer: Peer) {
    this._peers.add(peer);
    peer.send(this.value);
  },
  unsubscribe(peer: Peer) {
    this._peers.delete(peer);
  }
}