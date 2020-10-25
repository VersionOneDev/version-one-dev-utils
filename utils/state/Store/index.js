import { configureStore } from "@reduxjs/toolkit";
import ReduxThunk from "redux-thunk";

import { createStore } from "../utils/createStore";
import { combineReducers } from "../utils/combineReducers";
import { PendingStore } from "../PendingStore";
import { ErrorsStore } from "../ErrorsStore";

export const Store = (a) => {
  const aa = createStore(a.name, a.initialState, a.actions);

  return configureStore({
    middleware: [ReduxThunk],
    reducer: combineReducers(PendingStore, ErrorsStore, aa),
  });
};
