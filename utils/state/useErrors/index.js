import { useMemo } from "react";
import { useSelector } from "../useSelector";
import { compareActionTargets } from "../utils/compareActionTargets";

export const useErrors = (...targets) => {
  const passed = useSelector(
    (state) => {
      let errors = state.ErrorStore;
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
    const error = passed.length ? passed[0].value : null;

    const filterErrors = (...filters) => {
      // If there are no filters then try to return the first error.
      if (!filters.length) {
        return passed.length ? passed[0].value : null;
      }

      const error = passed.find((error) =>
        filters.find((target) => compareActionTargets(error.type, target))
      );

      if (error) {
        return error;
      }
    };

    return { error, filterErrors };
  }, [passed]);
};
