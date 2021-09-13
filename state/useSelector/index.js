import { useContext, useLayoutEffect, useReducer, useRef } from "react";

import { unstable_batchedUpdates } from "react-dom";

import { Store, StoreContext } from "../Store";

// Set up a batch to limit calls to render
const listeners = [];

Store.subscribe(() => {
  unstable_batchedUpdates(() => {
    for (let i in listeners) listeners[i]();
  });
});

const Subscribe = (listener) => {
  listeners.push(listener);
  return () => listeners.splice(listeners.indexOf(listener), 1);
};

// Hook
export const useSelector = (selector, equalityFn = (a, b) => a === b) => {
  // Toggle between 0 and 1 to force a render
  const [, forceRender] = useReducer((s) => (s ? 0 : 1), 0);

  const latestSelector = useRef();
  const latestStoreState = useRef();
  const latestSelectedState = useRef();

  const context = useContext(StoreContext);
  const storeState = context || Store.getState();

  let selectedState;

  if (
    selector !== latestSelector.current ||
    storeState !== latestStoreState.current
  ) {
    selectedState = selector(storeState);
  } else {
    selectedState = latestSelectedState.current;
  }

  useLayoutEffect(() => {
    latestSelector.current = selector;
    latestStoreState.current = storeState;
    latestSelectedState.current = selectedState;
  });

  useLayoutEffect(() => {
    return Subscribe(() => {
      latestStoreState.current = context || Store.getState();

      const newSelectedState = latestSelector.current(latestStoreState.current);

      if (equalityFn(newSelectedState, latestSelectedState.current)) {
        return;
      }

      latestSelectedState.current = newSelectedState;

      forceRender();
    });
  }, [forceRender, context, equalityFn]);

  return selectedState;
};
