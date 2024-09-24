import { waitForValue } from "../../utils/waitForValue";

const getKey = (id, props) => id + "__" + JSON.stringify(props);

/**
 * Cache calls to actions.
 */
export function createCache(defaults = { lifespan: 60000, name: "cache" }) {
  const items = {};
  let interval;

  const updateInterval = () => {
    const numItems = Object.keys(items).length;

    if (!interval && numItems) {
      // Set a loop to flush expired items
      interval = setInterval(flushAll, defaults.lifespan);
    } else if (interval && !numItems) {
      clearInterval(interval);
      interval = null;
    }
  };

  const flushItem = (key, force = false) => {
    const ts = Date.now();
    const item = items[key];

    if (
      item &&
      ((item.lifespan !== -1 && ts - item.ts >= item.lifespan) || force)
    ) {
      item.listenerCount = 0;
      item.unsubscribe && item.unsubscribe();
      delete items[key];
      updateInterval();
    } else {
      return item;
    }
  };

  const flushAll = (force) =>
    Object.keys(items).forEach((key) => flushItem(key, force));

  const add = (id, handler, options = { lifespan: defaults.lifespan }) => {
    return (props, actionApi) => {
      const key = getKey(id, props);

      // Flush item returns active items and clears any that have expired
      let item = flushItem(key);

      if (!items[key]) {
        item = {
          ...options,
          key,
          ts: Date.now(),
          payload: null,
          unsubscribe: null,
          active: true,
          listenerCount: 0,
          handler: (resolve, reject) => {
            try {
              if (!item.payload) {
                item.payload = handler(props, actionApi);
              }

              const done = (v) => {
                // Set isCached value on handler so createAction can avoid dispatching unnessesary pending events
                item.handler.isCached = true;
                // Resolve with value
                resolve(v);
              };

              if (item.payload instanceof Function) {
                // Callback
                // Wrap in a promise so subsequent calls to action are treated as async and do not cause the payload creator to fire multiple times.
                // The initial call to action can continue to fire resolve/reject callbacks to allow updates from web sockets, firebase etc.
                item.payload = new Promise((resolvePromise, rejectPromise) => {
                  // Unsubscribe method can be used to clean up event listeners, stop intervals etc.
                  // that may be used when action is making multiple callbacks
                  const unsubscribe = item.payload(
                    (v) => {
                      // Update the item payload so the latest value is returned in subsequent calls to action
                      item.payload = Promise.resolve(v);
                      done(v);
                      resolvePromise(v);
                    },
                    (e) => {
                      reject(e);
                      rejectPromise(e);
                    }
                  );

                  let fired = false;

                  item.unsubscribe = () => {
                    // We should only be able to hit unsubscribe once for each time an action is dispatched to keep the listener count valid
                    if (!fired) {
                      fired = true;
                      item.listenerCount--;

                      if (item.active && item.listenerCount < 1) {
                        item.active = false;
                        item.listenerCount = 0;
                        // Remove from the cache
                        delete items[key];
                        // Call unsubscribe to remove any listeners, intervals etc. created when the action was fired
                        return unsubscribe && unsubscribe();
                      }
                    }
                  };
                });
              } else if (item.payload.then && item.payload.catch) {
                // Async
                waitForValue(item.payload).then(done).catch(reject);
              } else {
                // Sync
                done(item.payload);
              }
            } catch (error) {
              reject(error);
            }

            item.listenerCount++;

            return item.unsubscribe;
          },
        };

        items[key] = item;
        updateInterval();
      }

      return item.handler;
    };
  };

  const set = (
    id,
    props,
    payload,
    options = { lifespan: defaults.lifespan }
  ) => {
    const key = getKey(id, props);

    // Force flush any existing cached action with matching key
    flushItem(key, true);

    // Create a new cached item
    const item = (items[key] = {
      ...options,
      key,
      ts: Date.now(),
      payload,
      unsubscribe: null,
      active: true,
      listenerCount: 0,
      handler: (resolve) => resolve(item.payload),
    });

    // Set isCached value on handler so createAction can avoid dispatching unnessesary pending events
    item.handler.isCached = true;

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
