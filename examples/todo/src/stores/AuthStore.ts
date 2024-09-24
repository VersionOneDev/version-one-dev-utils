import { createStore, createAction } from "version-one-dev-utils/state";

/**
 * State
 */

type AuthStoreState = {
  ready: boolean;
  id: string;
  name: string;
};

const initialState: AuthStoreState = {
  ready: false,
  id: "",
  name: "",
};

const login = createAction<never, { id: string; name: string }, AuthStoreState>(
  () => fetch("/login").then((response) => response.json())
);

login.success = (state, action) => ({
  ...state,
  ...action.payload,
  ready: true,
});

const logout = createAction<never, Response, AuthStoreState>(() =>
  fetch("/logout")
);

logout.success = () => AuthStore.initialState;

export const AuthStore = createStore({
  name: "AuthStore",
  initialState,
  actions: { login, logout },
});
