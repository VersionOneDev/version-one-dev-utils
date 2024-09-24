export const createAction = (fn) => {
  fn.type = "default";
  return fn;
};

export const createCachedAction = (fn, lifespan) => {
  fn.lifespan = lifespan;
  fn.type = "cached";
  return fn;
};

export const createCallbackAction = (fn) => {
  fn.type = "callback";
  return fn;
};
