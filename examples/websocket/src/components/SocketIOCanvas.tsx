import { For, createSignal, onCleanup, onMount } from "solid-js";
import io, { Socket } from 'socket.io-client';
import { isServer } from "solid-js/web";
import { createServerAction$ } from "solid-start/server";

let c = 0;

export default function SocketIOButton() {
  let socket: Socket;
  let board: HTMLCanvasElement | undefined;
  let context: CanvasRenderingContext2D | null;

  const [connected, setConnected] = createSignal(false);
  const colors = ["red", "blue", "green"];
  const [color, setColor] = createSignal(colors[Math.floor(Math.random() * 3)]);
  const [counter, setCounter] = createSignal(c);

  onMount(() => {
    socket = io(`${import.meta.env.DEV ? 'ws' : 'wss'}://${window.location.host}`, { path: "/socketio/", autoConnect: false, transports: ["websocket"] });

    if (!board) return;
    context = board.getContext("2d");

    console.log("socket.io:", "connecting...");
    socket.connect();
    socket.io.on("open", () => console.log("socket.io/open"));
    socket.io.on("error", (e) => console.log("socket.io/error", e));
    socket.io.on("close", () => console.log("socket.io/close"));
    socket.on("connect", () => {
      console.log("socket.io/connect", "connected 🎉");
      setConnected(true);
    });
    socket.on("message", (data) => {
      console.log("socket.io/message:", data);
      draw(JSON.parse(data));
    });
    socket.on("counter", (value) => {
      setCounter(value);
    });
    socket.on("connect_error", (e) => console.log("socket.io/connect_error:", e));
    socket.on("disconnect", () => {
      console.log("socket.io/disconnect:", "disconnected 👋");
      setConnected(false);
    });
  });

  if (!isServer) {
    onCleanup(() => {
      console.log("socket.io:", "disconnecting...");
      socket.io.off();
      socket.off();
      socket.disconnect();
    });
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
      socket.send(JSON.stringify(instruction));
    }
  }

  const [_, increment] = createServerAction$(async (_, event) => {
    c++;
    event.locals.io?.emit("counter", c);
  });

  return (
    <div style={"margin-left: auto; margin-right: auto; max-width: 400px;"}>
      <div>
        <b>Socket.IO</b>
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
