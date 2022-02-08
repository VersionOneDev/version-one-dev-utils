import { useEffect, useCallback } from "react";

/**
 * Hook that automatically unsubscribes from a callback action when it's dependencies are updated or on unmount.
 **/
export const useCallbackAction = (cb, deps) => {
  const fn = useCallback(cb, deps);

  useEffect(() => {
    let action;
    fn().then((value) => (action = value));
    return () => action && action.meta.unsubscribe();
  }, [fn]);
};
