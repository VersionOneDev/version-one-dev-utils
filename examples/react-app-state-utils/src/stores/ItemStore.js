import { createStore } from "version-one-dev-utils";

const get = ({ id = "" }) =>
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`).then((response) =>
    response.json()
  );

get.success = (state, action) => ({
  ...state,
  [action.payload.id]: state[action.payload.id] || action.payload,
});

export const ItemStore = createStore({
  name: "ItemStore",
  initialState: {},
  actions: { get },
  select: {
    toArray: () => Object.values(ItemStore.state.get()),
    byId: (id) => ItemStore.state.get()[id],
  },
});

export const ItemStore2 = createStore({
  name: "ItemStore2",
  initialState: {},
  actions: { get },
  select: {
    toArray: () => Object.values(ItemStore2.state.get()),
    byId: (id) => ItemStore2.state.get()[id],
  },
});
