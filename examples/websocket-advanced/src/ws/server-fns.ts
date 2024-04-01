import { join } from "vinxi/lib/path";

export async function increment() {
  "use server";
  await $fetch(join(app.getRouter("ws").base, "/increment"), { method: "POST" });
}
