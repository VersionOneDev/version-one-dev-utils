const data = {};

export const actionCache = {
  set: (key, value, lifespan) => {
    if (lifespan) {
      data[key] = { value, expires: Date.now() + lifespan };
    } else {
      delete data[key];
    }
  },
  get: (key) => {
    if (data[key] && data[key].expires < Date.now()) {
      delete data[key];
    }

    return data[key] ? data[key].value : undefined;
  },
};
