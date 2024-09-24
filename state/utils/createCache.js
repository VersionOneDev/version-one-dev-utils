const getKey = (id, props) => id + "__" + JSON.stringify(props);

/**
 * Cache calls to actions.
 */

const DEFAULTS = { lifespan: 60000, interval: 5000, name: "cache" };

export function createCache(defaults) {
  defaults = { ...DEFAULTS, ...defaults };
  const items = {};
  let interval;

  const updateInterval = () => {
    const numItems = Object.keys(items).length;

    if (!interval && numItems) {
      // Set a loop to flush expired items
      interval = setInterval(flushAll, defaults.interval);
    } else if (interval && !numItems) {
      clearInterval(interval);
      interval = null;
    }
  };

  /**
   * Flush items from the cache
   * If force: true  Item will be removed regardless of state
   * If force: false Items without unsubscribe methods will be removed once they reach their lifespan
   *                 Items with unsubscribe methods will be skipped over until all requests are cleared to avoid accidental cleanup.
   */
  const flushItem = (key, force = false, ts = 0) => {
    ts = ts || Date.now();
    const item = items[key];

    const remove = () => {
      delete items[key];
      updateInterval();
    };

    if (item) {
      if (force) return remove();
      if (item.lifespan !== -1 && item.ts && ts - item.ts >= item.lifespan) {
        item.unsubscribe && item.unsubscribe();
        return remove();
      }
    }

    return item;
  };

  const flushAll = (force) => {
    const now = Date.now();
    Object.keys(items).forEach((key) => flushItem(key, force, now));
  };

  const add = (id, handler, lifespan = DEFAULTS.lifespan) => {
    const cacheHandler = (props, actionApi) => {
      const key = getKey(id, props);

      // Flush item returns active items and clears any that have expired
      let item = flushItem(key);

      if (handler.type === "callback") {
        return (resolve, reject) => {
          const request = { resolve, reject };

          // Callbacks will override cache.set values since they should be watching/subscribing to changing state
          if (!item || !item.unsubscribe) {
            item = {
              lifespan,
              key,
              ts: null,
              payload: null,
              unsubscribe: null,
              requests: [request],
            };

            try {
              const callback = handler(props, actionApi);
              item.unsubscribe = callback(
                (payload) => {
                  item.payload = payload;
                  item.requests.forEach((req) => req.resolve(payload));
                },
                (error) => {
                  item.requests.forEach((req) => req.reject(error));
                  // Remove from cache if error
                  flushItem(key, true);
                }
              );

              items[key] = item;
              updateInterval();
            } catch (error) {
              item.requests.forEach((req) => req.reject(error));
              // Remove from cache if error
              flushItem(key, true);
            }
          } else {
            // Already in cache
            // Clear timestamp if set since callback should remain alive whilst something is subscribed to it
            item.ts = null;
            item.requests.push(request);

            if (item.payload) {
              request.resolve(item.payload);
            }
          }

          // Return an unsubscribe function
          // We should only be able to hit unsubscribe once for each time an action is dispatched to keep the requests array valid
          let unsubscribed = false;
          return () => {
            if (!unsubscribed) {
              unsubscribed = true;
              const index = item.requests.indexOf(request);
              if (index != -1) item.requests.splice(index, 1);
              if (!item.requests.length) {
                // If there are no requests left set a timestamp so item can time out of cache
                item.ts = Date.now();
              }
            }
          };
        };
      } else {
        if (!item) {
          try {
            set(id, props, handler(props, actionApi), lifespan);
          } catch (error) {
            // Remove from cache if error
            return Promise.reject(error);
          }
        }

        return items[key].payload;
      }
    };

    cacheHandler.type = handler.type;

    return cacheHandler;
  };

  const set = (id, props, payload, lifespan = DEFAULTS.lifespan) => {
    const key = getKey(id, props);

    const item = flushItem(key) || { key, unsubscribe: null, requests: [] };
    // Only set timestamp if item is not a callback type with an unsubscribe function
    if (!item.unsubscribe || !item.requests.length) item.ts = Date.now();
    item.lifespan = lifespan;
    item.payload = payload;
    // Call resolve on any existing requests
    item.requests.forEach((req) => req.resolve(payload));

    items[key] = item;
    updateInterval();

    // Return the payload for convienience
    return payload;
  };

  const remove = (id, props) => flushItem(getKey(id, props), true);

  const removeAll = () => flushAll(true);

  return {
    add,
    set,
    remove,
    removeAll,
    items,
  };
}
