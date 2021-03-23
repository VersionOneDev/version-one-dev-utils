import { createStore } from "version-one-dev-utils";

import PropTypes from "prop-types";

const get = (props) =>
  fetch(
    `https://jsonplaceholder.typicode.com/todos/${props.id}`
  ).then((response) => response.json());

get.propTypes = {
  id: PropTypes.number.isRequired,
};

get.success = (state, action) => ({
  ...state,
  [action.payload.id]: action.payload,
});

export const ItemStore = createStore({
  name: "ItemStore",
  initialState: {},
  actions: { get },
  propTypes: PropTypes.objectOf(
    PropTypes.shape({ id: PropTypes.string.isRequired })
  ),
});
