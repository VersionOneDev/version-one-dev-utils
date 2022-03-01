import { createStore, createAsyncAction } from "version-one-dev-utils/state";

import PropTypes from "prop-types";

const get = createAsyncAction(
  (props) => fetch(`/user/${props.id}`).then((response) => response.json()),
  {
    propTypes: { id: PropTypes.string.isRequired },
    cache: true,
  }
);

get.success = (state, action) => ({
  ...state,
  [action.payload.id]: action.payload,
});

export const UserStore = createStore({
  name: "UserStore",
  initialState: {},
  actions: { get },
  propTypes: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    })
  ),
});
