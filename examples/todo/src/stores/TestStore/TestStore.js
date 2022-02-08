/**
 *
 * TEST STORE is intended to be used to test actions, caching, and state updates.
 *
 **/

import { createStore, createCache } from "version-one-dev-utils/state";

import PropTypes from "prop-types";

const cache = createCache();

const callbackLoop = (props, cb) => {
  let i = 0;
  const n = 10;
  let timeout;

  const tick = () => {
    timeout = setTimeout(() => {
      if (i++ < n) {
        cb({ ...props, numCallbacks: i });
        tick();
      }
    }, 5);
  };
  tick();

  return () => {
    clearTimeout(timeout);
    return "unsubscribed"; // Return a string so we can easily check function is called in the tests.
  };
};

const sync = (props) => props;
sync.propTypes = { value: PropTypes.string };
sync.success = (state, action) => action.payload;

const async = (props) => Promise.resolve(props);
async.propTypes = { value: PropTypes.string };
async.success = (state, action) => action.payload;

const callback = (props) => (resolve) => callbackLoop(props, resolve);
callback.propTypes = { value: PropTypes.string };
callback.success = (state, action) => action.payload;

let cachedSyncCount = 0;
const cachedSync = cache.add(
  "sync",
  (props) => {
    cachedSyncCount++;

    return {
      value: props.value + cachedSyncCount.toString(),
    };
  },
  { lifespan: 100 }
);
cachedSync.propTypes = { value: PropTypes.string };
cachedSync.success = (state, action) => action.payload;

let cachedAsyncCount = 0;
const cachedAsync = cache.add(
  "sync",
  (props) => {
    cachedAsyncCount++;

    return Promise.resolve({
      value: props.value + cachedAsyncCount.toString(),
    });
  },
  { lifespan: 100 }
);
cachedAsync.propTypes = { value: PropTypes.string };
cachedAsync.success = (state, action) => action.payload;

let cachedCallbackCount = 0;
const cachedCallback = cache.add(
  "cachedCallback",
  (props) => {
    cachedCallbackCount++;

    return (resolve) => {
      return callbackLoop(
        {
          value: props.value + cachedCallbackCount.toString(),
        },
        resolve
      );
    };
  },
  { lifespan: 100 }
);
cachedCallback.propTypes = { value: PropTypes.string };
cachedCallback.success = (state, action) => action.payload;

export const TestStore = createStore({
  name: "TestStore",
  initialState: {
    value: null,
    numCallbacks: 0,
  },
  actions: { sync, async, callback, cachedSync, cachedAsync, cachedCallback },
  propTypes: PropTypes.shape({
    value: PropTypes.string,
    numCallbacks: PropTypes.number,
  }),
});
