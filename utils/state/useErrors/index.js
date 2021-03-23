import { useMemo } from "react";
import { useSelector } from "../useSelector";
import { compareActionTargets } from "../utils/compareActionTargets";

import { Store } from "../Store";

export const useErrors = (...targets) => {
  const passed = useSelector(
    () => {
      const state = Store.getState();
      let errors = state.errors;
      // If there is no errors state then give up
      if (!errors || !errors.length) return [];

      // If there are no targets return all errors
      if (!targets.length) {
        return errors;
      }

      return errors.filter((error) =>
        targets.find((target) => compareActionTargets(error.type, target))
      );
    },
    // Check for changes to the pending state before re-rendering the component.
    (a, b) => JSON.stringify(a) === JSON.stringify(b)
  );

  return useMemo(() => {
    return (...filters) => {
      // If there are no filters then try to return the first error.
      if (!filters.length) {
        return passed.length ? passed[0].value : null;
      }

      const error = passed.find((error) =>
        filters.find((target) => compareActionTargets(error.type, target))
      );

      if (error) {
        return error.value;
      }
    };
  }, [passed]);
};
