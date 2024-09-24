import { createReducer } from "@reduxjs/toolkit";
import { createStoreAction, statuses } from "./createStoreAction";

import { Store } from "../Store";
import { createCache } from "./createCache";

export const createStore = ({
  name = "",
  initialState = {},
  actions = {},
  select = {},
  mapProps = (props, type, key) => props,
}) => {
  /* Caching */
  const cache = createCache(name);

  /* Default actions */

  // Reset the store to it's initial state.
  const reset = () => {};
  reset.success = () => initialState;

  /* Compose all actions. */
  const defaultActions = { reset };
  const parsedActions = {};
  const reducerMethods = {};

  const allActions = { ...defaultActions, ...actions };

  Object.keys(allActions).forEach((type) => {
    const def = allActions[type];
    // Apply caching options
    let cached;

    if (def.type === "cached") {
      cached = cache.add(type, def, def.lifespan);
    } else if (def.type === "callback") {
      cached = cache.add(type, def, 1000);
    }

    const action = createStoreAction(name, type, cached || def);

    if (def.type === "cached") {
      action.cache = {
        set: (props, payload, options) =>
          cache.set(type, props, payload, options),
        empty: (props) => cache.remove(type, props),
      };
    }

    const dispatchedAction = (props, key) => {
      const value = action(mapProps(props, type, key), key);
      return Store.dispatch(value);
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

  const reducer = createReducer(initialState, (builder) => {
    Object.keys(reducerMethods).forEach((key) =>
      builder.addCase(key, reducerMethods[key])
    );
  });

  Store.add(name, reducer);

  return {
    name,
    initialState,
    reducer,
    cache,
    select,
    byKey: (key) => `${name}/*/${key}`,
    toString: () => name,
    getState: () => Store.getState()[name] || initialState,
    actions: parsedActions,
  };
};
