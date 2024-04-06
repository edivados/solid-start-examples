// @refresh reload
import { createSignal, onMount } from "solid-js";
import { join } from "vinxi/lib/path";
import "./app.css";

export default function App() {
  let socket: WebSocket | undefined;

  const [connected, setConnected] = createSignal(false);
  const [counter, setCounter] = createSignal(0);

  onMount(() => {
    const protocol = window.location.protocol.endsWith("s:") ? "wss:" : "ws:";
    const url = `${protocol}//${join(window.location.host, import.meta.env.SERVER_BASE_URL || "/", "/_ws")}`;
    socket = new WebSocket(url);
    socket.addEventListener("open", () => setConnected(true));
    socket.addEventListener("message", ({ data }) => setCounter(data));
    socket.addEventListener("close", () => setConnected(false));
  });

  return (
    <main>
      <h1>Hello world!</h1>
      <h2 classList={{ connected: connected(), disconnected: !connected() }}>
        { connected() ? "Connected" : "Disconnected" }
      </h2>
      <p>Open the site in a second window side by side to see websocket in action.</p>
      <button class="increment" onClick={() => socket?.send("")}>
        Clicks: {counter()}
      </button>
      <p>
        Visit{" "}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{" "}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
