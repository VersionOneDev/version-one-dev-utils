import { createReducer } from "@reduxjs/toolkit";
import { createAction } from "./createAction";

import { Store } from "../Store";

export const createStore = ({
  name = "",
  initialState = {},
  actions = {},
  ...other
}) => {
  /* Default actions */

  // Reset the store to it's initial state.
  const reset = () => {};
  reset.success = () => initialState;

  // Replace the current state with the payload.
  const replace = (payload) => payload;
  replace.success = (state, action) => action.payload;

  // Merge the payload into the current state.
  const merge = (payload) => payload;
  merge.success = (state, action) => ({ ...state, ...action.payload });

  /* Compose all actions. */
  const defaultActions = { reset, replace, merge };
  const parsedActions = {};
  const reducerMethods = {};

  const allActions = { ...defaultActions, ...actions };

  Object.keys(allActions).forEach((type) => {
    const def = allActions[type];
    const action = createAction(name, type, def);
    const dispatchedAction = (payload, key) =>
      Store.dispatch(action(payload, key));
    // Copy action extras
    for (var key in action) dispatchedAction[key] = action[key];
    parsedActions[type] = dispatchedAction;

    // Set reducer methods
    if (def.success) reducerMethods[`${name}/${type}`] = def.success;
  });

  const reducer = createReducer(initialState, reducerMethods);

  Store.add(name, reducer);

  return {
    name,
    initialState,
    reducer,
    byKey: (key) => `${name}/*/${key}`,
    toString: () => name,
    actions: parsedActions,
    getState: () => Store.getState()[name] || initialState,
    ...other,
  };
};
