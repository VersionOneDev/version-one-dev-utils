import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { useSelector, usePending } from "version-one-dev-utils/state";
import { useRoutes } from "version-one-dev-utils/routes";
import { TestId } from "version-one-dev-utils/tests";

import classnames from "classnames";

import { ItemStore } from "../../stores/ItemStore";

export function ItemList(props) {
  const items = useSelector((state) => state.ItemStore);

  const { getPending } = usePending();

  const { link, routes } = useRoutes();

  useEffect(() => {
    ItemStore.actions.watch();
    //return () => ItemStore.actions.unwatch();
  }, []);

  const testId = TestId(props);

  return (
    <>
      <ul>
        {Object.values(items).map((item) => {
          const pending = getPending(ItemStore.byKey(item.id));

          return (
            <li
              key={item.id}
              className={classnames(
                "p-6 mb-4 block rounded-md flex items-center cursor-pointer",
                "bg-gradient-to-tr from-gray-400 to-gray-200",
                !item.completed && "opacity-90 hover:opacity-100",
                item.completed && "opacity-50 hover:opacity-80"
              )}
              onClick={() =>
                !item.completed
                  ? ItemStore.actions.complete({ id: item.id }, item.id)
                  : ItemStore.actions.incomplete({ id: item.id }, item.id)
              }
            >
              <div className="flex-1 mr-4 text-gray-700">
                <span
                  {...testId("itemTitle", item.id)}
                  className={classnames(item.completed && "line-through")}
                >
                  {item.title}
                </span>
                <div>
                  <Link
                    {...testId("itemView", item.id)}
                    className="underline hover:no-underline text-xs mt-1"
                    to={() => link(routes.ITEM, { id: item.id })}
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </Link>
                </div>
              </div>

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
    </>
  );
}

ItemList.propTypes = {
  "data-testId": PropTypes.string,
};