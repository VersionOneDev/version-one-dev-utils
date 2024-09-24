import { createCachedAction, createStore } from "version-one-dev-utils/state";

/**
 * State
 */

type User = {
  id: string;
  name: string;
  avatar?: string;
};

type UserStoreState = Record<string, User>;

const initialState: UserStoreState = {};

/**
 * Actions
 */

const get = createCachedAction<{ id: string }, User, UserStoreState>((props) =>
  fetch(`/user/${props.id}`).then((response) => response.json())
);

get.success = (state, action) => ({
  ...state,
  [action.payload.id]: action.payload,
});

/**
 * Store
 */

export const UserStore = createStore({
  name: "UserStore",
  initialState,
  actions: { get },
  select: {
    byId: (id: string) => UserStore.getState()[id],
  },
});
