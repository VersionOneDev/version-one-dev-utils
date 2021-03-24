import { createAction } from "@reduxjs/toolkit";

import { statuses, getType, getKey } from "../utils/createAction";
import { compareActionTargets } from "../utils/compareActionTargets";

const clear = createAction("ErrorStore/clear");

export const ErrorStore = {
  name: "ErrorStore",
  reducer: (state = [], action) => {
    const path = getType(action) + getKey(action);
    if (action.type === "ErrorStore/clear") {
      return state.filter(
        (error) => !compareActionTargets(action.payload, error.type)
      );
    } else if (
      action.type.includes(statuses.ERROR) &&
      !state.find((error) => error.type === path)
    ) {
      return [...state, { type: path, value: action.error }];
    } else if (state.find((error) => error.type === path)) {
      return state.filter((error) => error.type !== path);
    }

    return state;
  },
  // Actions
  clear,
};
