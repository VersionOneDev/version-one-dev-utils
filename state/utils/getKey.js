export const getKey = (action) => {
  return action.meta && action.meta.key ? "/" + action.meta.key : "";
};
