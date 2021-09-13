import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector, usePending } from "version-one-dev-utils/state";
import { useRoutes } from "version-one-dev-utils/routes";

import { ItemStore } from "../../stores/ItemStore";

export function Item(props) {
  const { link, routes, params } = useRoutes();

  const item = useSelector((state) => state.ItemStore.item);

  const { getPending } = usePending();
  const pending = getPending(ItemStore.actions.getItem.byKey(params.id));

  useEffect(() => {
    ItemStore.actions.getItem({ id: Number(params.id) }, params.id);
  }, [params.id]);

  return (
    <>
      <Link
        to={link(routes.HOME)}
        className="inline-block underline hover:no-underline text-blue-500 hover:text-blue-600 mb-10"
      >
        Back
      </Link>
      {pending && <div>Loading...</div>}
      {item && (
        <>
          <h1 className="mb-10 text-4xl text-center">{item.title}</h1>
          <p>{item.body}</p>
        </>
      )}
    </>
  );
}
