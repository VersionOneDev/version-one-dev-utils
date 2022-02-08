import { createStore, createCache } from "version-one-dev-utils/state";
import PropTypes from "prop-types";

import { AuthStore } from "./AuthStore";

const cache = createCache();

let ws;

const watch = cache.add("chat", () => (resolve) => {
  ws = new WebSocket("/chat");
  ws.onmessage = (event) => resolve(event.data);
  return () => ws?.close();
});

watch.success = (state, action) => action.payload || ChatStore.initialState;

const add = (props) =>
  ws?.send({ ...props, type: "add", from: AuthStore.getState().id });

add.propTypes = {
  message: PropTypes.string.isRequired,
};

export const ChatStore = createStore({
  name: "ChatStore",
  initialState: [],
  actions: { watch, add },
  propTypes: PropTypes.arrayOf(
    PropTypes.shape({
      message: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      ts: PropTypes.number.isRequired,
    })
  ),
});
