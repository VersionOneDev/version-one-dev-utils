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
    if (!data[key]) {
      console.log(key, "not in cache");
    }

    if (data[key] && data[key].expires < Date.now()) {
      console.log(key, "has expired");
      delete data[key];
    }

    if (data[key]) {
      console.log(key, "found in cache");
    }

    return data[key] ? data[key].value : undefined;
  },
};
