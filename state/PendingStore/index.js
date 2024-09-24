import { getKey } from "../utils/getKey";
import { getType } from "../utils/getType";
import { statuses } from "../utils/statuses";

export const PendingStore = {
  name: "PendingStore",
  reducer: (state = [], action) => {
    // If not pending return undefined to clear the state
    const path = getType(action) + getKey(action);
    if (action.type.includes(statuses.PENDING) && !state.includes(path)) {
      return [...state, path];
    } else if (state.includes(path)) {
      return state.filter((pending) => pending !== path);
    }

    return state;
  },
};
