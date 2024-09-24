import {
  createStore,
  createCallbackAction,
  createAction,
} from "version-one-dev-utils/state";

import { AuthStore } from "./AuthStore";

/**
 * State
 */

type ChatStoreState = {
  message: string;
  from: string;
  ts: number;
}[];

const initialState: ChatStoreState = [];

/**
 * Actions
 */

let ws: any;

const watch = createCallbackAction<never, ChatStoreState, ChatStoreState>(
  () => (resolve) => {
    ws = new WebSocket("/chat");
    ws.onmessage = (event: any) => resolve(event.data);
    return ws.close;
  }
);

watch.success = (state, action) => action.payload || state;

const add = createAction<{ message: string }>((props) =>
  ws?.send({ ...props, type: "add", from: AuthStore.getState().id })
);

/**
 * Store
 */

export const ChatStore = createStore({
  name: "ChatStore",
  initialState,
  actions: { watch, add },
});
