import { useEffect, useCallback } from "react";

/**
 * Hook that automatically unsubscribes from a callback action when it's dependencies are updated or on unmount.
 **/
export const useCallbackAction = (cb, deps) => {
  // We only want to update fn when deps changes, not when cb changes as this will be generated in every render in the component.
  const fn = useCallback(cb, deps); // eslint-disable-line

  useEffect(() => {
    let action;
    fn().then((value) => (action = value));
    return () => action && action.meta.unsubscribe();
  }, [fn]);
};
