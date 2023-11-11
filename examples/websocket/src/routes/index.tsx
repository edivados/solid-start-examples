import { Title } from "solid-start";
import CanvasSocketIO from "~/components/CanvasSocketIO";
import CanvasWS from "~/components/CanvasWS";

export default function Home() {
  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <CanvasWS />
      <CanvasSocketIO />
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
