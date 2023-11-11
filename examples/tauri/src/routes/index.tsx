import { invoke } from "@tauri-apps/api";
import { createSignal } from "solid-js";
import { Title } from "solid-start";
import Counter from "~/components/Counter";

export default function Home() {
  const [msg, setMsg] = createSignal<string>();
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <Counter />
      <button class="increment" onclick={() => invoke("greet", { name: "Windows" }).then((msg: any) => setMsg(msg))}>Greet</button>
      <div>{msg()}</div>
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
