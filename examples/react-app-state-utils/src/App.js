import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RouteProvider } from "version-one-dev-utils";
import { routes } from "./routes";

import { ItemList } from "./containers/ItemList";
import { Item } from "./containers/Item";
import { Notification } from "./containers/Notification";

export function App() {
  return (
    <RouteProvider value={routes}>
      <Router>
        <Switch>
          <Route path={routes.HOME} exact>
            <ItemList />
          </Route>
          <Route path={routes.ITEM}>
            <Item />
          </Route>

          <Route path={routes.NOT_FOUND}>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-8xl">404</h1>
            </div>
          </Route>
        </Switch>
      </Router>
      <Notification />
    </RouteProvider>
  );
}
