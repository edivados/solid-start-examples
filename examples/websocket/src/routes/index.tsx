import { Title } from "solid-start";
import SocketIOCanvas from "~/components/SocketIOCanvas";
import WSCanvas from "~/components/WSCanvas";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <WSCanvas />
      <SocketIOCanvas />
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
