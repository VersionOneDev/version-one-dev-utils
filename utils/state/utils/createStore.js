import { createReducer } from "@reduxjs/toolkit";
import { createAction } from "./createAction";
import PropTypes from "prop-types";

import { Store } from "../Store";

export const createStore = ({
  name = "",
  initialState = {},
  actions = {},
  propTypes,
}) => {
  /* Default actions */

  // TODO -Fix default actions

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
    const dispatchedAction = (props, key) => Store.dispatch(action(props, key));
    // Copy action properties
    for (let key in action) dispatchedAction[key] = action[key];
    parsedActions[type] = dispatchedAction;

    // Set reducer methods
    if (def.success) reducerMethods[`${name}/${type}`] = def.success;
  });

  const mergedReducerMethods = createReducer(initialState, reducerMethods);
  let reducer;

  // Apply propTypes check to state
  if (propTypes) {
    reducer = (state, action) => {
      const result = mergedReducerMethods(state, action);

      if (propTypes) {
        PropTypes.checkPropTypes(
          { result: propTypes },
          { result },
          "state",
          action.type
        );
        PropTypes.resetWarningCache();
      }

      return result;
    };
  } else {
    reducer = mergedReducerMethods;
  }

  Store.add(name, reducer);

  return {
    name,
    initialState,
    propTypes,
    reducer,
    byKey: (key) => `${name}/*/${key}`,
    toString: () => name,
    actions: parsedActions,
    getState: () => Store.getState()[name] || initialState,
  };
};
