import { statuses } from "./statuses";

export const getType = (action) => {
  let { type } = action;
  Object.values(statuses).forEach(
    (status) => (type = type.replace(status, ""))
  );
  return type;
};
