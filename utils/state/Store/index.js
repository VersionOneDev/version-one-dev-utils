import { configureStore } from "@reduxjs/toolkit";
import ReduxThunk from "redux-thunk";
import { createStore } from "../utils/createStore";
import { combineReducers } from "../utils/combineReducers";
import { PendingStore } from "../PendingStore";
import { ErrorsStore } from "../ErrorsStore";

const stores = [PendingStore, ErrorsStore];
let store;

export const Store = (...appStores) => {
  appStores.map((store) =>
    stores.push(createStore(store.name, store.initialState, store.actions))
  );
  store = configureStore({
    middleware: [ReduxThunk],
    reducer: combineReducers(...stores),
  });
  return store;
};

export const dispatch = (action) => {
  // /const store = action.split("/")[0];
  console.log(store);
  store.dispatch(ErrorsStore.clear());
};
