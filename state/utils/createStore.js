import { createReducer } from "@reduxjs/toolkit";
import { createAction, statuses } from "./createAction";
import PropTypes from "prop-types";

import { Store } from "../Store";
import { createCache } from "./createCache";

export const createStore = ({
  name = "",
  initialState = {},
  actions = {},
  cache: cacheOptions = {},
  propTypes,
  mapProps = (props, type, key) => props,
}) => {
  /* Caching */
  const cache = createCache({ ...cacheOptions, name });

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
    // Apply caching options
    const cached = def.cache
      ? cache.add(type, def, typeof def.cache === "object" && def.cache)
      : null;

    const action = createAction(name, type, cached || def);

    const dispatchedAction = (props, key) => {
      return Store.dispatch(action(mapProps(props, type, key), key));
    };
    // Copy action properties
    for (let key in action) dispatchedAction[key] = action[key];
    parsedActions[type] = dispatchedAction;

    // Set reducer methods
    if (def.success) {
      reducerMethods[`${name}/${type}`] = def.success;
    }

    if (def.pending) {
      reducerMethods[`${name}/${type}${statuses.PENDING}`] = def.pending;
    }

    if (def.error) {
      reducerMethods[`${name}/${type}${statuses.ERROR}`] = def.error;
    }
  });

  const mergedReducerMethods = createReducer(initialState, reducerMethods);
  let reducer;

  // Apply propTypes check to state
  if (propTypes) {
    reducer = (state, action) => {
      const result = mergedReducerMethods(state, action);

      // Only check prop types if action belongs to the current store
      if (propTypes && action.type.split('/')[0] === name) {
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
    cache,
    byKey: (key) => `${name}/*/${key}`,
    toString: () => name,
    actions: parsedActions,
    getState: () => Store.getState()[name] || initialState,
  };
};
