import server$ from 'solid-start/server'
import type { CountMessage } from '../middlewares/types';

let value = 0;

export const increment = server$(async () => {
  value++;
  server$.locals.ws?.clients.forEach(
    client => client.send(JSON.stringify({ type: "count", value } satisfies CountMessage))
  );
});

export const count = server$(() => value);
