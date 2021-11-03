import { createStore } from "version-one-dev-utils/state";

import PropTypes from "prop-types";

const login = () => fetch("/login").then((response) => response.json());
login.success = (state, action) => ({
  ...state,
  ...action.payload,
  ready: true,
});

const logout = () => fetch("/login");
logout.success = (state, action) => AuthStore.initialState;

const signup = (props) =>
  fetch("/signup", {
    method: "POST",
    body: JSON.stringify(props),
  }).then((res) => res.json());
signup.success = (state, action) => ({
  ...state,
  ...action.payload,
});

export const AuthStore = createStore({
  name: "AuthStore",
  initialState: {
    ready: false,
    id: null,
    name: null,
  },
  actions: { login, logout, signup },
  propTypes: PropTypes.shape({
    ready: PropTypes.boolean,
    id: PropTypes.string,
    name: PropTypes.string,
  }),
});
