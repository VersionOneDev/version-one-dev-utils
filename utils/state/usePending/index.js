import { useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useSelector } from "../useSelector";
import { compareActionTargets } from "../utils/compareActionTargets";

import { Store } from "../Store";

export const usePending = (...targets) => {
  const passed = useSelector(
    () => {
      const state = Store.getState();
      let pending = state.pending;
      // If there is no pending state then give up
      if (!pending || !pending.length) return [];

      // If there are no targets return all pending actions
      if (!targets.length) {
        return pending;
      }

      return pending.filter((action) =>
        targets.find((target) => compareActionTargets(action, target))
      );
    },
    // Check for changes to the pending state before re-rendering the component.
    shallowEqual
  );

  return useMemo(() => {
    return (...filters) => {
      // If there are no filters then just see if anything is pending.
      if (!filters.length) {
        return !!passed.length;
      }

      return filters.some((target) =>
        passed.some((action) => compareActionTargets(target, action))
      );
    };
  }, [passed]);
};
