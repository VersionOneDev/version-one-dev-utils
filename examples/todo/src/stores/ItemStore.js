import { createStore, createCache } from "version-one-dev-utils/state";
import PropTypes from "prop-types";

import { AuthStore } from "./AuthStore";

const cache = createCache();

const watch = cache.add("watch", () => (resolve) => {
  const ws = new WebSocket("/items");
  ws.onmessage = (event) => resolve(event.data);
  return () => ws?.close();
});

watch.success = (state, action) => action.payload;

const add = (props) =>
  fetch(`/items`, {
    method: "POST",
    headers: {
      Authorization: AuthStore.getState().id,
    },
    body: JSON.stringify(props),
  });

add.propTypes = {
  title: PropTypes.string.isRequired,
};

const edit = (props) =>
  fetch(`/items/${props.id}`, {
    method: "PUT",
    headers: {
      Authorization: AuthStore.getState().id,
    },
    body: JSON.stringify({ title: props.title }),
  });

edit.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const complete = (props) =>
  fetch(`/items/${props.id}/complete`, {
    method: "PUT",
    headers: {
      Authorization: AuthStore.getState().id,
    },
  });

complete.propTypes = {
  id: PropTypes.string.isRequired,
};

const incomplete = (props) =>
  fetch(`/items/${props.id}/incomplete`, {
    method: "PUT",
    headers: {
      Authorization: AuthStore.getState().id,
    },
  });

incomplete.propTypes = {
  id: PropTypes.string.isRequired,
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
});
