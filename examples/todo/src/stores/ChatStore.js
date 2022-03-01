import {
  createStore,
  createSyncAction,
  createCallbackAction,
} from "version-one-dev-utils/state";
import PropTypes from "prop-types";

import { AuthStore } from "./AuthStore";

let ws;

const watch = createCallbackAction(
  () => (resolve) => {
    ws = new WebSocket("/chat");
    ws.onmessage = (event) => resolve(event.data);
    return () => ws?.close();
  },
  { cache: true }
);

watch.success = (state, action) => action.payload || ChatStore.initialState;

const add = createSyncAction(
  (props) => ws?.send({ ...props, type: "add", from: AuthStore.getState().id }),
  {
    propTypes: {
      message: PropTypes.string.isRequired,
    },
  }
);

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
