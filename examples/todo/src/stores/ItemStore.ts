import {
  createAction,
  createCallbackAction,
  createStore,
} from "version-one-dev-utils/state";

import { AuthStore } from "./AuthStore";

/**
 * State
 */

type ItemStoreState = Record<
  string,
  {
    id: string;
    title: string;
    createdBy: string;
    completedBy: string;
    completed: boolean;
  }
>;

const initialState: ItemStoreState = {};

/**
 * Actions
 */

const watch = createCallbackAction<never, ItemStoreState, ItemStoreState>(
  () => (resolve, reject) => {
    const ws = new WebSocket("/items");
    ws.onmessage = (event) => resolve(event.data);
    ws.onerror = () => reject("Web socket error");
    return ws.close;
  }
);

watch.success = (state, action) => action.payload;

const add = createAction<{ title: string }, Response>((props) => {
  return fetch(`/items`, {
    method: "POST",
    headers: {
      Authorization: AuthStore.getState().id,
    },
    body: JSON.stringify(props),
  });
});

const edit = createAction<{ id: string; title: string }, Response>((props) => {
  return fetch(`/items/${props.id}`, {
    method: "PUT",
    headers: {
      Authorization: AuthStore.getState().id,
    },
    body: JSON.stringify({ title: props.title }),
  });
});

const complete = createAction<{ id: string }, Response>((props) => {
  return fetch(`/items/${props.id}/complete`, {
    method: "PUT",
    headers: {
      Authorization: AuthStore.getState().id,
    },
  });
});

const incomplete = createAction<{ id: string }, Response>((props) => {
  return fetch(`/items/${props.id}/incomplete`, {
    method: "PUT",
    headers: {
      Authorization: AuthStore.getState().id,
    },
  });
});

/**
 * Store
 */
export const ItemStore = createStore({
  name: "ItemStore",
  initialState,
  actions: { watch, add, edit, complete, incomplete },
  select: {
    /** Return a user object by their id. */
    byId: (id: string) => ItemStore.getState()[id] || {},
    /** Return an array of users by an array of user ids. */
    byIds: (ids: string[]) => ids.map(ItemStore.select.byId),
  },
});
