import React from "react";
import { useSelector, usePending, useErrors } from "version-one-dev-utils";

import { ItemStore } from "../../stores/ItemStore";

export function Items() {
  const items = useSelector((state) => state.ItemStore);

  const { pending, filterPending } = usePending(ItemStore.actions.get);
  const { error, filterErrors } = useErrors(ItemStore.actions.get);

  return (
    <div>
      {Object.values(items).map((item, index) => (
        <p key={index}>{JSON.stringify(item)}</p>
      ))}

      {pending && <p>Loading...</p>}

      {
        // Only show loading when key is 10
        filterPending(ItemStore.actions.get.byKey(10)) && <p>Loading 10!</p>
      }

      {error && <p>Error: {error}</p>}
      {
        // Only show loading when key is 10
        filterErrors(ItemStore.actions.get.byKey(10)) && (
          <p>Error 10: {filterErrors(ItemStore.actions.get.byKey(10))}</p>
        )
      }

      <button onClick={() => ItemStore.actions.get({ id: 1 }, 1)}>
        Dispatch another
      </button>
    </div>
  );
}
