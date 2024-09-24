import { createAction } from "@reduxjs/toolkit";

import { compareActionTargets } from "../utils/compareActionTargets";
import { getKey } from "../utils/getKey";
import { getType } from "../utils/getType";
import { statuses } from "../utils/statuses";

import { Store } from "../Store";

const clear = createAction("ErrorStore/clear");

export const ErrorStore = {
  name: "ErrorStore",
  reducer: (state = [], action) => {
    const path = getType(action) + getKey(action);
    if (action.type === "ErrorStore/clear") {
      return state.filter(
        (error) => !compareActionTargets(action.payload || "*", error.type)
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
  actions: {
    clear: (payload) => Store.dispatch(clear(payload)),
  },
};
