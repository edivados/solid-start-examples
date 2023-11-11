import { For, createSignal, onCleanup, onMount } from "solid-js";
import { count, increment } from "~/server-functions/socketio";
import createCanvas from "./Canvas";
import io, { Socket } from 'socket.io-client';
import type { DrawMessage, Messages } from "../middlewares/types";

export default function () {
  const [webSocket, setWebSocket] = createSignal<Socket>();
  const [connected, setConnected] = createSignal(false);
  const [counter, setCounter] = createSignal(0);
  const [Canvas, { colors, randomColor, draw }] = createCanvas({
    onDraw: (instruction) => {
      webSocket()?.send(JSON.stringify({ type: "draw", instruction } satisfies DrawMessage));
    }
  });
  const [color, setColor] = createSignal<string>(randomColor());

  onMount(() => {
    count().then(value => setCounter(value));

    const onConnected = () => setConnected(true)
    const onDisconnected = () => setConnected(false);

    function onMessage(message: string) {
      const payload = JSON.parse(message) as Messages;
      switch (payload.type) {
        case "count":
          setCounter(payload.value);
          break;
        case "draw":
          draw(payload.instruction);
          break;
      }
    }

    const socket = setWebSocket(io(`ws://${window.location.host}`, { path: "/socketio/", transports: ["websocket"] }));
    socket.on("connect", onConnected);
    socket.on("disconnect", onDisconnected);
    socket.on("message", onMessage);

    onCleanup(() => { socket.close(); })
  });

  return (
    <div style={{"margin-left": "auto", "margin-right": "auto", "max-width": "400px"}}>
      <div>
        <b>Socket.IO</b>
        { connected() ? "💚 Connected" : "💔 Disconnected" }
      </div>
      <button onClick={() => increment()}>Increment: { counter() }</button>
      <div>
        <select onChange={(e) => setColor(e.currentTarget.value)} value={color()}>
          <For each={colors}>
            {color => <option value={color}>{color}</option> }
          </For>
        </select>
      </div>
      <Canvas style={{ border: "1px solid black" }} />
    </div>
  )
}
