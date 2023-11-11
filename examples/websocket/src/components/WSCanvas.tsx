import { isServer } from "solid-js/web";
import { For, createSignal, onCleanup, onMount } from "solid-js";
import { createServerAction$ } from "solid-start/server";

let c = 0;

export default function WebSocketButton() {
  let ws: WebSocket;
  let board: HTMLCanvasElement | undefined;
  let context: CanvasRenderingContext2D | null;
  
  const [connected, setConnected] = createSignal(false);

  const colors = ["red", "blue", "green"];
  const [color, setColor] = createSignal(colors[Math.floor(Math.random() * 3)]);
  const [counter, setCounter] = createSignal(c);

  onMount(() => {
    if (!board) return;
    context = board.getContext("2d");
    ws = new WebSocket(`${import.meta.env.DEV ? 'ws' : 'wss'}://${window.location.host}/ws`);
    ws.addEventListener("open", () => {
      setConnected(true);
      console.log('ws/open:', "connected 🎉");
    });
    ws.addEventListener("close", (e) => {
      console.log("ws/close:", e);
      console.log("ws/close:", "disconnected 👋");
      setConnected(false);
    });
    ws.addEventListener("error", (e) => { 
      console.log("ws/error:", e);
      ws.close();
    });
    ws.addEventListener("message", (e) => {
      console.log("ws/message:", e.data);
      const data = JSON.parse(e.data);
      data.type === "counter"
        ? setCounter(data.value)
        : draw(data);
    });
  });

  if (!isServer) {
    onCleanup(() => ws.close());
  }

  function draw(instruction: any) {
    if (!context) return;
    context.beginPath();
    context.moveTo(instruction.moveTo.x, instruction.moveTo.y);
    context.lineTo(instruction.lineTo.x, instruction.lineTo.y);
    context.strokeStyle = instruction.strokeStyle;
    context.lineWidth = instruction.lineWidth;
    context.lineCap = instruction.lineCap;
    context.stroke();
  }

  function onMouseMove(e: MouseEvent) {
    if (!context) return;
    if (e.buttons) {
      const instruction = {
        moveTo: { x: e.offsetX, y: e.offsetY },
        lineTo: { x: e.offsetX, y: e.offsetY },
        strokeStyle: color(),
        lineWidth: 5,
        lineCap: "round",
      };
      draw(instruction);
      ws.send(JSON.stringify(instruction));
    }
  }

  const [_, increment] = createServerAction$(async (_, event) => {
    c++;
    event.locals.ws.clients.forEach(client => client.send(JSON.stringify({ type: "counter", value: c })));
  });

  return (
    <div style={"margin-left: auto; margin-right: auto; max-width: 400px;"}>
      <div>
        <b>ws + WebSocket</b>
        {
          connected()
            ? "💚 Connected"
            : "💔 Disconnected"
        }
      </div>
      <button onclick={() => increment()}>Increment: { counter() }</button>
      <div>
        <select onchange={(e) => setColor(e.currentTarget.value)} value={color()}>
          <For each={colors}>
            {(color) => <option value={color}>{color}</option>}
          </For>
        </select>
      </div>
      <canvas style={{ "border": "1px solid black" }} ref={board} onMouseMove={onMouseMove} />
    </div>
  );
}
