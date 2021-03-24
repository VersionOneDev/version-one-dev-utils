import { useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useSelector } from "../useSelector";
import { compareActionTargets } from "../utils/compareActionTargets";

export const usePending = (...targets) => {
  const passed = useSelector(
    (state) => {
      let pending = state.PendingStore;
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
    const pending = !!passed.length;

    const filterPending = (...filters) => {
      // If there are no filters then just see if anything is pending.
      if (!filters.length) {
        return !!passed.length;
      }

      return filters.some((target) =>
        passed.some((action) => compareActionTargets(target, action))
      );
    };

    return { pending, filterPending };
  }, [passed]);
};
