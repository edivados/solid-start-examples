import { createResource, createSignal, Suspense } from "solid-js";
import { createRouteAction, createRouteData } from "solid-start";
import { client } from "~/lib/trpc/client";
import "./Counter.css";

export default function Counter() {
  const count = createRouteData(() => client.counter.count.query(), { key: "count" });
  const [_, increment] = createRouteAction(() => client.counter.increment.mutate(), { invalidate: "count" });
  return (
    <button class="increment" onClick={() => increment()}>
      Clicks: {count()}
    </button>
  );
}
