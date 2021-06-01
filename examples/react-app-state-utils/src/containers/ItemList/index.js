import React from "react";

import { useSelector, usePending } from "version-one-dev-utils";
import classnames from "classnames";

import { ItemStore } from "../../stores/ItemStore";

export function ItemList(props) {
  const items = useSelector((state) => state.ItemStore);

  const { getPending } = usePending();

  return (
    <ul>
      {Object.values(items).map((item, index) => {
        const pending = getPending(ItemStore.byKey(item.id));

        return (
          <li
            key={index}
            className={classnames(
              "p-6 mb-4 block rounded-md bg-gray-400 hover:bg-gray-300 flex align-center cursor-pointer",
              item.completed && "bg-gray-600 hover:bg-gray-500"
            )}
            onClick={() =>
              !item.completed
                ? ItemStore.actions.complete({ id: item.id }, item.id)
                : ItemStore.actions.incomplete({ id: item.id }, item.id)
            }
          >
            <span
              className={classnames(
                "text-gray-700 flex-1 mr-4",
                item.completed && "line-through"
              )}
            >
              {item.title}
            </span>
            <span
              className={classnames(
                "inline-block w-6 h-6 border-2 border-gray-600 rounded-full",
                pending && "border-dashed animate-spin",
                !pending && item.completed && "border-green-700 bg-green-400"
              )}
            />
          </li>
        );
      })}
    </ul>
  );
}
