import React from "react";
import { useSelector, usePending } from "version-one-dev-utils";

import { ItemStore } from "./stores/ItemStore";

export function App() {
  const items = useSelector((state) => state.ItemStore || {});

  // Pending function will watch all get actions
  const getPending = usePending(ItemStore.actions.get);

  React.useEffect(() => {
    ItemStore.actions.get({ id: 1 }, 1);
  }, []);

  return (
    <div>
      <h1>React App</h1>
      {Object.values(items).map((item) => (
        <p key={item.id}>{JSON.stringify(item)}</p>
      ))}

      {
        // Only show loading when key is 10
        getPending(ItemStore.actions.get.byKey(10)) && <p>Loading...</p>
      }

      <button onClick={() => ItemStore.actions.get({ id: 10 }, 10)}>
        Click me
      </button>
    </div>
  );
}
