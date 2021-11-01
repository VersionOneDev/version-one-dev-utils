import { createStore } from "version-one-dev-utils/state";
import PropTypes from "prop-types";

import { AuthStore } from "./AuthStore";

let ws;

const watch = () =>
  ChatStore.cache.watch("/chat", (resolve) => {
    ws = new WebSocket("/chat");
    ws.onmessage = (event) => resolve(event.data);
  });

watch.success = (state, action) => action.payload || ChatStore.initialState;

const unwatch = () => ChatStore.cache.unwatch("/chat", () => ws?.close());

const add = (props) =>
  ws?.send({ ...props, type: "add", from: AuthStore.getState().id });

add.propTypes = {
  message: PropTypes.string.isRequired,
};

export const ChatStore = createStore({
  name: "ChatStore",
  initialState: [],
  actions: { watch, unwatch, add },
  propTypes: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      ts: PropTypes.number.isRequired,
    })
  ),
});
