import { combineReducers as combineReducersI } from "@reduxjs/toolkit";

export const combineReducers = (...stores) => {
  const reducers = {};
  stores.forEach((store) => (reducers[store.name] = store.reducer));
  return combineReducersI(reducers);
};
