import React from "react";

import { ItemStore } from "./stores/ItemStore";

import { Items } from "./containers/Items";

export function App() {
  React.useEffect(() => {
    ItemStore.actions.get({ id: 1 }, 1);
  }, []);

  return (
    <div>
      <h1>React App</h1>
      <Items />
      <button onClick={() => ItemStore.actions.get({ id: 10 }, 10)}>
        Click me
      </button>
      <button onClick={() => ItemStore.actions.reset()}>Reset</button>
    </div>
  );
}
