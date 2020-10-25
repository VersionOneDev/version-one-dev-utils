import React from "react";
import { useDispatch } from "version-one-dev-utils";

import { ItemStore } from "./stores/ItemStore";

export function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(ItemStore.actions.get(1));
  }, [dispatch]);

  return <h1>React App</h1>;
}
