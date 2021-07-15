import { useMemo, useRef } from "react";
import { useSelector } from "../useSelector";
import { compareActionTargets } from "../utils/compareActionTargets";
import { ErrorStore } from "../ErrorStore";

const storeName = "ErrorStore";

export const useErrors = (...targets) => {
  const cache = useRef([]);

  // Get a list of all errors matching everything in the filter cache
  // useSelector will cause the component to re-render
  const passed = useSelector(
    (state) => {
      let value = state[storeName];
      // If there is no value then give up
      if (!value || !value.length) return [];

      return value.filter((item) =>
        cache.current.find((target) => compareActionTargets(item.type, target))
      );
    },
    // Check for changes to the pending state before re-rendering the component.
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );

  const getError = useMemo(() => {
    return (...filters) => {
      // If no filters are applied set a wildcard to search for everything
      if (!filters.length) filters = ["*"];
      // Update cache
      cache.current = [...new Set([...cache.current, ...filters])];
      // Run the filters on the current passed values
      return passed.find((item) =>
        filters.find((target) => compareActionTargets(item.type, target))
      );
    };
  }, [passed]);

  // Return getError and clearError functions
  return useMemo(() => {
    return {
      getError,
      clearError: ErrorStore.actions.clear,
    };
  }, [getError]);
};
