import {
  createStore,
  createAsyncAction,
  createCallbackAction,
} from "version-one-dev-utils/state";
import PropTypes from "prop-types";

import { AuthStore } from "./AuthStore";

const watch = createCallbackAction(
  () => (resolve) => {
    const ws = new WebSocket("/items");
    ws.onmessage = (event) => resolve(event.data);
    return () => ws?.close();
  },
  { cache: true }
);

watch.success = (state, action) => action.payload;

const add = createAsyncAction(
  (props) =>
    fetch(`/items`, {
      method: "POST",
      headers: {
        Authorization: AuthStore.getState().id,
      },
      body: JSON.stringify(props),
    }),
  {
    propTypes: {
      title: PropTypes.string.isRequired,
    },
    cache: true,
  }
);

const edit = createAsyncAction(
  (props) =>
    fetch(`/items/${props.id}`, {
      method: "PUT",
      headers: {
        Authorization: AuthStore.getState().id,
      },
      body: JSON.stringify({ title: props.title }),
    }),
  {
    propTypes: {
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    },
  }
);

const complete = createAsyncAction(
  (props) =>
    fetch(`/items/${props.id}/complete`, {
      method: "PUT",
      headers: {
        Authorization: AuthStore.getState().id,
      },
    }),
  {
    propTypes: {
      id: PropTypes.string.isRequired,
    },
  }
);

const incomplete = createAsyncAction(
  (props) =>
    fetch(`/items/${props.id}/incomplete`, {
      method: "PUT",
      headers: {
        Authorization: AuthStore.getState().id,
      },
    }),
  {
    propTypes: {
      id: PropTypes.string.isRequired,
    },
  }
);

const exclamationStrings = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => exclamationStrings(item));
  } else if (
    typeof value === "object" &&
    value !== null &&
    value !== undefined
  ) {
    const res = {};
    for (const [key, val] of Object.entries(value)) {
      res[key] = exclamationStrings(val);
    }
    return res;
  } else if (typeof value === "string") return value + "!";
  // All other values
  else return value;
};

export const ItemStore = createStore({
  name: "ItemStore",
  initialState: {},
  actions: { watch, add, edit, complete, incomplete },
  propTypes: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      createdBy: PropTypes.string.isRequired,
      completedBy: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ),
  middleware: exclamationStrings,
});
