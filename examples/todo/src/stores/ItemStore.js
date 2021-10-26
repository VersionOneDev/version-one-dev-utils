import { createStore } from "version-one-dev-utils/state";

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
    items,
  };
};

get.error = (state, action) => {
  console.log("=== error", action);
  return state;
};

const getItem = (props) => {
  return fetch("https://jsonplaceholder.typicode.com/posts/" + props.id).then(
    (response) => {
      return response.json();
    }
  );
};

getItem.cache = 10000;

getItem.propTypes = {
  id: PropTypes.number.isRequired,
};

getItem.success = (state, action) => ({ ...state, item: action.payload });

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
  items: {
    ...state.items,
    [action.payload.id]: {
      ...state.items[action.payload.id],
      ...action.payload,
    },
  },
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
  items: {
    ...state.items,
    [action.payload.id]: {
      ...state.items[action.payload.id],
      ...action.payload,
    },
  },
});

const add = (props) => props;

add.propTypes = {
  title: PropTypes.string.isRequired,
};

add.success = (state, action) => {
  const id = Object.keys(state.items).length + 1;
  return {
    ...state,
    items: {
      [id]: {
        id,
        userId: 1,
        completed: false,
        ...action.payload,
      },
      ...state.items,
    },
  };
};

export const ItemStore = createStore({
  name: "ItemStore",
  initialState: {
    items: {},
    item: null,
  },
  actions: { get, getItem, complete, incomplete, add },
  propTypes: PropTypes.shape({
    items: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        userId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
      })
    ),
    item: PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }),
  }),
});
