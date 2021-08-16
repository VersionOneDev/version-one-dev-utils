import React from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";

import {
  useSelector,
  usePending,
  useRoutes,
  TestId,
} from "version-one-dev-utils";

import { ItemStore } from "../../stores/ItemStore";

export function ItemList(props) {
  const testId = TestId(props);

  const items = useSelector((state) => state.ItemStore.items);

  const { getPending } = usePending();

  const { link, routes } = useRoutes();

  React.useEffect(() => {
    ItemStore.actions.get();
  }, []);

  return (
    <>
      <h1 {...testId("title")} className="mb-10 text-4xl text-center">
        To Do List
      </h1>

      <ul>
        {Object.values(items).map((item, index) => {
          const pending = getPending(ItemStore.byKey(item.id));

          return (
            <li
              key={index}
              className={classnames(
                "p-6 mb-4 block rounded-md bg-gray-400 hover:bg-gray-300 flex items-center cursor-pointer",
                item.completed && "bg-gray-600 hover:bg-gray-500"
              )}
              onClick={() =>
                !item.completed
                  ? ItemStore.actions.complete({ id: item.id }, item.id)
                  : ItemStore.actions.incomplete({ id: item.id }, item.id)
              }
            >
              <div className="flex-1 mr-4 text-gray-700">
                <span className={classnames(item.completed && "line-through")}>
                  {item.title}
                </span>
                <div>
                  <Link
                    className="underline hover:no-underline text-xs mt-1"
                    to={() => link(routes.ITEM, { id: item.id })}
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
  "data-test-id": PropTypes.string,
};
