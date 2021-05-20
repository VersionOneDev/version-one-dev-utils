import { createStore } from "version-one-dev-utils";

import PropTypes from "prop-types";

const get = () => {
  return fetch("https://jsonplaceholder.typicode.com/todos/").then((response) =>
    response.json()
  );
};

get.propTypes = {};

get.success = (state, action) => {
  const items = {};
  let count = 0;
  action.payload.forEach((item) => {
    if (count < 10) {
      items[item.id] = item;
      count++;
    }
  });

  return {
    ...state,
    ...items,
  };
};

get.error = (state, action) => {
  console.log("=== error", action);
  return state;
};

const complete = (props) =>
  fetch("https://jsonplaceholder.typicode.com/posts/" + props.id, {
    method: "PUT",
    body: JSON.stringify({
      id: props.id,
      completed: true,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());

complete.propTypes = {
  id: PropTypes.number.isRequired,
};

complete.success = (state, action) => ({
  ...state,
  [action.payload.id]: { ...state[action.payload.id], ...action.payload },
});

const incomplete = (props) =>
  fetch("https://jsonplaceholder.typicode.com/posts/" + props.id, {
    method: "PUT",
    body: JSON.stringify({
      id: props.id,
      completed: false,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  }).then((response) => response.json());

incomplete.propTypes = {
  id: PropTypes.number.isRequired,
};

incomplete.success = (state, action) => ({
  ...state,
  [action.payload.id]: { ...state[action.payload.id], ...action.payload },
});

export const ItemStore = createStore({
  name: "ItemStore",
  initialState: {},
  actions: { get, complete, incomplete },
  propTypes: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    })
  ),
});
