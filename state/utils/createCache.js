import { waitForValue } from "../../utils/waitForValue";

const getKey = (id, props) => id + "__" + JSON.stringify(props);

/**
 * Cache calls to actions.
 */
export function createCache(defaults = { lifespan: 60000 }) {
  const items = {};

  const flush = (expiredOnly = true) => {
    const ts = Date.now();

    Object.keys(items).forEach((key) => {
      const item = items[key];
      if (
        (item.lifespan !== -1 && ts - item.ts >= item.lifespan) ||
        !expiredOnly
      ) {
        item.unsubscribe && item.unsubscribe();
        delete items[key];
      }
    });
  };

  // Set a loop to flush expired items
  const interval = setInterval(flush, defaults.lifespan);

  const add = (id, handler, options = { lifespan: defaults.lifespan }) => {
    return (props, actionApi) => {
      const key = getKey(id, props);

      let item = items[key];

      const ts = Date.now();

      if (!item || (item.lifespan !== -1 && ts - item.ts >= item.lifespan)) {
        item = {
          ...options,
          key,
          ts,
          payload: null,
          unsubscribe: null,
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

                  item.unsubscribe = () => {
                    item.listenerCount--;

                    if (!item.listenerCount && unsubscribe) {
                      // Remove from the cache
                      delete items[key];
                      // Call unsubscribe to remove any listeners, intervals etc. created when the action was fired
                      return unsubscribe();
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
      }

      return item.handler;
    };
  };

  const remove = (id, props) => {
    const key = getKey(id, props);
    const item = items[key];
    if (item) {
      item.unsubscribe();
      delete items[key];
    }
  };

  const removeAll = () => flush(true);

  const destroy = () => {
    clearInterval(interval);
    removeAll();
  };

  return {
    add,
    remove,
    removeAll,
    destroy,
  };
}
