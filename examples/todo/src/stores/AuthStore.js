import { createStore, createAsyncAction } from "version-one-dev-utils/state";

import PropTypes from "prop-types";

const login = createAsyncAction(() =>
  fetch("/login").then((response) => response.json())
);
login.success = (state, action) => ({
  ...state,
  ...action.payload,
  ready: true,
});

const logout = createAsyncAction(() => fetch("/login"));
logout.success = (state, action) => AuthStore.initialState;

export const AuthStore = createStore({
  name: "AuthStore",
  initialState: {
    ready: false,
    id: null,
    name: null,
  },
  actions: { login, logout },
  propTypes: PropTypes.shape({
    ready: PropTypes.boolean,
    id: PropTypes.string,
    name: PropTypes.string,
  }),
});
