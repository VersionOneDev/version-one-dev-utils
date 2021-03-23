import { createContext } from "react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ReduxThunk from "redux-thunk";

import { PendingStore } from "../PendingStore";
import { ErrorsStore } from "../ErrorsStore";

export const StoreContext = createContext();
export const StoreProvider = StoreContext.Provider;

const map = {
  errors: ErrorsStore.reducer,
  pending: PendingStore.reducer,
};

// APPLY STATE WHEN REDUCER IS ADDED!!!

const reducers = {
  map,
  combined: combineReducers(map),
  update: () => {
    reducers.combined = combineReducers(map);
    // Dispatch an update action so state is updated immediately
    Store.dispatch({ type: "Store.updateReducers" });
  },
  deleted: [],
  reduce: (state, action) => {
    console.log(state, action);
    // If any reducers have been removed, clean up their state first
    if (reducers.deleted.length) {
      state = { ...state };
      for (let key of reducers.deleted) {
        delete state[key];
      }
      reducers.deleted = [];
    }

    // Delegate to the combined reducer
    return reducers.combined(state, action);
  },
};

export const Store = configureStore({
  middleware: [ReduxThunk],
  reducer: reducers.reduce,
});

Store.add = (name, value) => {
  // Don't override exsiting reducer with matching key
  if (!name || reducers.map[name]) {
    throw new Error(`Reducer ${name} already exists!`);
  } else {
    // Add to the reducer map
    reducers.map[name] = value;
    // Generate a new combined reducer
    reducers.update();
  }
};

Store.remove = (name = "") => {
  if (reducers.map[name]) {
    // Remove it from the reducer map
    delete reducers.map[name];
    // Add the key to the list of keys to clean up
    reducers.deleted.push(name);
    // Generate a new combined reducer
    reducers.update();
  }
};
