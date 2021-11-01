import _get from "lodash.get";

export const createCache = (store) => {
  const cache = {};
  const watchers = {};

  const get = (path, fn) => {
    if (cache[path]) {
      const promise = Promise.resolve();
      promise.__cached = true;
      return promise;
    } else {
      cache[path] = { value: null };
      return fn();
    }
  };

  const empty = (path) => delete cache[path];

  const watch = (path, fn) => (resolve, reject) => {
    if (watchers[path]) {
      clearTimeout(watchers[path].timeout);
      watchers[path].count++;
    } else {
      watchers[path] = { count: 1, timeout: null };
      return fn(resolve, reject);
    }
  };

  const unwatch = (path, fn) => (resolve) => {
    if (watchers[path]) {
      watchers[path].count--;
      if (!watchers[path].count) {
        watchers[path].timeout = setTimeout(() => {
          delete watchers[path];
          resolve();
          return fn();
        }, 100);
      }
    }
  };

  const update = (state) => {
    const now = Date.now();

    Object.keys(cache).forEach((path) => {
      const cached = cache[path];

      // Get value from state object
      const value = _get(state, path);

      if (value != cached.value) {
        cached.value = value;
        cached.ts = now;
      }
    });
  };

  return {
    get,
    empty,
    watch,
    unwatch,
    update,
  };
};
