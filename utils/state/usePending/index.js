import { useMemo, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useSelector } from "../useSelector";
import { compareActionTargets } from "../utils/compareActionTargets";

const storeName = "PendingStore";

export const usePending = (...targets) => {
  const cache = useRef([]);

  // Get a list of all errors matching everything in the filter cache
  // useSelector will cause the component to re-render
  const passed = useSelector(
    (state) => {
      let value = state[storeName];
      // If there is no value then give up
      if (!value || !value.length) return [];

      return value.filter((item) =>
        cache.current.find((target) => compareActionTargets(item, target))
      );
    },
    // Check for changes to the pending state before re-rendering the component.
    shallowEqual
  );

  const getPending = useMemo(() => {
    return (...filters) => {
      // If no filters are applied set a wildcard to search for everything
      if (!filters.length) filters = ["*"];
      // Update cache
      cache.current = [...new Set([...cache.current, ...filters])];
      // Run the filters on the current passed values
      const match = passed.find((item) =>
        filters.find((target) => compareActionTargets(item, target))
      );
      // Wrap in an object to match useError response for consistency
      if (match) {
        return { type: match };
      }
    };
  }, [passed]);

  // Return getPending function
  return useMemo(() => {
    return {
      getPending,
    };
  }, [getPending]);
};
