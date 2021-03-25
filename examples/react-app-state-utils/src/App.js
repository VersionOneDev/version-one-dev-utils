import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteProvider } from "version-one-dev-utils";

import { ItemStore } from "./stores/ItemStore";

import { Items } from "./containers/Items";

const routes = {
  HOME: "/",
};

export function App() {
  React.useEffect(() => {
    ItemStore.actions.get({ id: 1 }, 1);
  }, []);

  return (
    <RouteProvider value={routes}>
      <BrowserRouter>
        <Switch>
          <Route path={routes.HOME} exact>
            <h1>React App</h1>
            <Items />
            <button onClick={() => ItemStore.actions.get({ id: 10 }, 10)}>
              Click me
            </button>
            <button onClick={() => ItemStore.actions.reset()}>Reset</button>
          </Route>
          <Route path="*">
            <h1>404</h1>
          </Route>
        </Switch>
      </BrowserRouter>
    </RouteProvider>
  );
}
