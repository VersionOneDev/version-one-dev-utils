import { configureStore, combineReducers } from "@reduxjs/toolkit";
import ReduxThunk from "redux-thunk";

import { PendingStore } from "../PendingStore";
import { ErrorsStore } from "../ErrorsStore";

const map = {
  errors: ErrorsStore.reducer,
  pending: PendingStore.reducer,
};

const reducers = {
  map,
  combined: combineReducers(map),
  update: () => (reducers.combined = combineReducers(map)),
  deleted: [],
  reduce: (state, action) => {
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
    return;
  }
  // Add to the reducer map
  reducers.map[name] = value;
  // Generate a new combined reducer
  reducers.update();
};

Store.remove = (name = "") => {
  if (reducers.map[name]) {
    // Remove it from the reducer map
    delete reducers.map[key];
    // Add the key to the list of keys to clean up
    reducers.deleted.push(name);
    // Generate a new combined reducer
    reducers.update();
  }
};

export class Stores {
  constructor() {
    this.map = {
      errors: ErrorsStore.reducer,
      pending: PendingStore.reducer,
    };

    this.combined = combineReducers(map);
    this.deleted = [];

    this.store = configureStore({
      middleware: [ReduxThunk],
      reducer: (state, action) => this.reduce(state, action),
    });
  }

  update() {
    this.combined = combineReducers(this.map);
  }

  reduce(state, action) {
    // If any reducers have been removed, clean up their state first
    if (this.deleted.length) {
      state = { ...state };
      for (let key of this.deleted) {
        delete state[key];
      }
      reducers.deleted = [];
    }

    // Delegate to the combined reducer
    return this.combined(state, action);
  }

  add(name, value) {
    // Don't override exsiting reducer with matching key
    if (!name || this.map[name]) {
      throw new Error(`Reducer ${name} already exists!`);
      return;
    }
    // Add to the reducer map
    this.map[name] = value;
    // Generate a new combined reducer
    this.update();
  }

  remove(name = "") {
    if (this.map[name]) {
      // Remove it from the reducer map
      delete this.map[key];
      // Add the key to the list of keys to clean up
      this.deleted.push(name);
      // Generate a new combined reducer
      this.update();
    }
  }
}
