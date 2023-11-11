import { For, createSignal, onCleanup, onMount } from "solid-js";
import { count, increment } from "~/server-functions/ws";
import createCanvas from "./Canvas";
import type { DrawMessage, Messages } from "../middlewares/types";

export default function () {
  const [webSocket, setWebSocket] = createSignal<WebSocket>();
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

    function onMessage(message: MessageEvent<string>) {
      const payload = JSON.parse(message.data) as Messages;
      switch (payload.type) {
        case "count":
          setCounter(payload.value);
          break;
        case "draw":
          draw(payload.instruction);
          break;
      }
    }

    const socket = setWebSocket(new WebSocket(`ws://${window.location.host}/ws`));
    socket.addEventListener("open", onConnected);
    socket.addEventListener("close", onDisconnected);
    socket.addEventListener("message", onMessage);

    onCleanup(() => { socket.close(); })
  });

  return (
    <div style={{"margin-left": "auto", "margin-right": "auto", "max-width": "400px"}}>
      <div>
        <b>WS</b>
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
