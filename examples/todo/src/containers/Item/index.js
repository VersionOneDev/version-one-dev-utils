import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import classnames from "classnames";

import { useSelector, useCallbackAction } from "version-one-dev-utils/state";
import { useRoutes } from "version-one-dev-utils/routes";

import { ItemStore } from "../../stores/ItemStore";
import { UserStore } from "../../stores/UserStore";

import { Input } from "../../components/Input";
import { UserAvatar } from "../../components/UserAvatar";

export function Item(props) {
  const { link, routes, params } = useRoutes();

  const item = useSelector((state) => state.ItemStore[params.id]);

  const createdBy = useSelector(
    (state) => item?.createdBy && state.UserStore[item.createdBy]
  );

  const completedBy = useSelector(
    (state) => item?.completedBy && state.UserStore[item.completedBy]
  );

  useCallbackAction(ItemStore.actions.watch, []);

  useEffect(() => {
    if (item?.createdBy) UserStore.actions.get({ id: item.createdBy });
    if (item?.completedBy) UserStore.actions.get({ id: item.completedBy });
  }, [item]);

  return (
    <>
      {item && (
        <div>
          <div className="flex mb-8 items-center">
            <div className="flex-1">
              <Link
                to={link(routes.HOME)}
                className="inline-block underline hover:no-underline text-violet-500 hover:text-violet-600"
              >
                Back to list
              </Link>
            </div>
            <button
              className={classnames(
                "rounded p-4 font-bold",
                item.completed && "text-green-900 bg-green-500",
                !item.completed && "text-gray-900 bg-gray-500"
              )}
              onClick={() => {
                item.completed
                  ? ItemStore.actions.incomplete(item)
                  : ItemStore.actions.complete(item);
              }}
            >
              {item.completed ? "Complete" : "Incomplete"}
            </button>
          </div>

          <Input
            className={classnames(
              "mb-10 text-4xl w-full",
              item.completed && "line-through opacity-50"
            )}
            defaultValue={item.title}
            onChange={(e) =>
              ItemStore.actions.edit({ id: item.id, title: e.target.value })
            }
          />

          <div className="grid grid-cols-2">
            {createdBy && (
              <div className="">
                <p className="mb-4 text-xs font-bold">Created by:</p>
                <UserAvatar name={createdBy.name} url={createdBy.avatar} />
                <span className="ml-4">{createdBy.name}</span>
              </div>
            )}

            {completedBy && (
              <div className="">
                <p className="mb-4 text-xs font-bold">Completed by:</p>
                <UserAvatar name={completedBy.name} url={completedBy.avatar} />
                <span className="ml-4">{completedBy.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
