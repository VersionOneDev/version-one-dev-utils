import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { RouteProvider } from "version-one-dev-utils/routes";
import { routes } from "./routes";

import { useSelector } from "version-one-dev-utils/state";

import { AuthStore } from "./stores/AuthStore";
import { NewStore } from "./stores/NewStore";

import { Header } from "./containers/Header";

import { AddTodo } from "./containers/AddTodo";
import { ItemList } from "./containers/ItemList";
import { Item } from "./containers/Item";
import { Chat } from "./containers/Chat";

import { Notification } from "./containers/Notification";

export function App() {
  const ready = useSelector((state) => state.AuthStore.ready);

  useEffect(() => {
    AuthStore.actions.login();
    NewStore.actions.test({ value: "app" });
    NewStore.actions.test({ value: "app" });
  }, []);

  if (!ready) {
    return <p>Loading...</p>;
  }

  return (
    <RouteProvider value={routes}>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 divide-x divide-gray-600">
          <div className="flex-1 p-8">
            <Router>
              <Switch>
                <Route path={routes.HOME} exact>
                  <div className="mb-10">
                    <AddTodo />
                  </div>
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
          </div>
          <div className="p-8">
            <Chat />
          </div>
        </div>
      </div>
      <Notification />
    </RouteProvider>
  );
}
