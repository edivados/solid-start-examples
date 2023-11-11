import {
  createHandler,
  renderAsync,
  StartServer,
} from "solid-start/entry-server";
import { ws } from "./middlewares/ws";
import { socketio } from "./middlewares/socketio";

export default createHandler(
  ws,
  socketio,
  renderAsync((event) => <StartServer event={event} />)
);
