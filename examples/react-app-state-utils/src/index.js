import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";

import { Provider, Store } from "version-one-dev-utils";

import { App } from "./App";

import { ItemStore } from "./stores/ItemStore";
const storeConfig = Store(ItemStore);

ReactDOM.render(
  <Provider store={storeConfig}>
    <App />
  </Provider>,
  document.getElementById("root")
);
