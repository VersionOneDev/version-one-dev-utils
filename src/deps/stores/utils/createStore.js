import { createReducer } from "@reduxjs/toolkit";

import { createAction } from "./createAction";

export const createStore = (name, initialState, actionDefs) => {
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
  const defaultActionDefs = { reset, replace, merge };
  const actions = {};
  const reducerMethods = {};

  const allDefs = { ...defaultActionDefs, ...actionDefs };

  Object.keys(allDefs).forEach((type) => {
    const def = allDefs[type];
    actions[type] = createAction(name, type, def);
    // Set reducer methods
    if (def.success) reducerMethods[`${name}/${type}`] = def.success;
  });

  const reducer = createReducer(initialState, reducerMethods);

  return {
    name,
    initialState,
    reducer,
    byKey: (key) => `${name}/*/${key}`,
    toString: () => name,
    ...actions,
  };
};
