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
  const thisStore = action.split("/")[0];
  const thisAction = action.split("/")[1];
  //store.dispatch(thisStore.thisAction());
  store.dispatch(ErrorsStore.clear());
};
