import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { RouteProvider } from "version-one-dev-utils";

import { ItemStore } from "./stores/ItemStore";

import { ItemList } from "./containers/ItemList";
import { Notification } from "./containers/Notification";

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
            <h1 className="mb-10 text-4xl text-center">To Do List</h1>
            <div>
              <div>
                <div>
                  <ItemList />
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <ItemList />
                </div>
              </div>
            </div>

            <Notification />
          </Route>
          <Route path="*">
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-8xl">404</h1>
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    </RouteProvider>
  );
}
