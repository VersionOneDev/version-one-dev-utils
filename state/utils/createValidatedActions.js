const validatedAction = (target, fn, options) => {
  const action = (props) => {
    const result = fn(props);

    let method, payloadType;

    if (result instanceof Function) {
      method = "callback";
      payloadType = "function";
    } else if (result && result.then && result.catch) {
      method = "async";
      payloadType = "promise";
    } else {
      method = "sync";
      payloadType = "value";
    }

    if (method !== target) {
      throw new Error(
        `${target} action: Invalid payload of type ${payloadType}, use ${method} action instead.`
      );
    }

    return result;
  };

  // Apply options
  for (let key in options) action[key] = options[key];

  return action;
};

export const createSyncAction = (fn, options) =>
  validatedAction("sync", fn, options);

export const createAsyncAction = (fn, options) =>
  validatedAction("async", fn, options);

export const createCallbackAction = (fn, options) =>
  validatedAction("callback", fn, options);
