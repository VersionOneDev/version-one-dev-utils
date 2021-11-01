import { createStore } from "version-one-dev-utils/state";

import PropTypes from "prop-types";

const get = (props) =>
  UserStore.cache.get(`${props.id}`, () =>
    fetch(`/user/${props.id}`).then((response) => response.json())
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
