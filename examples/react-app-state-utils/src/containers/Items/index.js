import React from "react";
import { useSelector, usePending } from "version-one-dev-utils";

import { ItemStore } from "../../stores/ItemStore";

export function Items() {
  const items = useSelector((state) => state.ItemStore);

  // Pending function will watch all get actions
  const getPending = usePending(ItemStore.actions.get);

  return (
    <div>
      {Object.values(items).map((item, index) => (
        <p key={index}>{JSON.stringify(item)}</p>
      ))}

      {
        // Only show loading when key is 10
        getPending(ItemStore.actions.get.byKey(10)) && <p>Loading...</p>
      }
      <button onClick={() => ItemStore.actions.get({ id: 1 })}>
        Dispatch another
      </button>
    </div>
  );
}
