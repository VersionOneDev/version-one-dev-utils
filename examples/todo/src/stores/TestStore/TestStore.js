/**
 *
 * TEST STORE is intended to be used to test actions, caching, and state updates.
 *
 **/

import {
  createLegacyStore,
  createSyncAction,
  createAsyncAction,
  createCallbackAction,
} from "version-one-dev-utils/state";

import PropTypes from "prop-types";

const callbackLoop = (props, cb) => {
  let i = 0;
  const n = 10;
  let interval;

  interval = setInterval(() => {
    if (i++ < n) cb({ ...props, numCallbacks: i });
  }, 5);

  return () => {
    clearInterval(interval);
    return "unsubscribed"; // Return a string so we can easily check function is called in the tests.
  };
};

const sync = createSyncAction((props) => props, {
  propTypes: { value: PropTypes.string },
});
sync.success = (state, action) => action.payload;

const async = createAsyncAction((props) => Promise.resolve(props), {
  propTypes: { value: PropTypes.string },
});
async.success = (state, action) => action.payload;

const callback = createCallbackAction(
  (props) => (resolve) => callbackLoop(props, resolve),
  {
    propTypes: { value: PropTypes.string },
  }
);
callback.success = (state, action) => action.payload;

let cachedSyncCount = 0;
const cachedSync = createSyncAction(
  (props) => {
    cachedSyncCount++;

    return {
      value: props.value + cachedSyncCount.toString(),
    };
  },
  { propTypes: { value: PropTypes.string }, cache: { lifespan: 100 } }
);
cachedSync.success = (state, action) => action.payload;

let cachedAsyncCount = 0;
const cachedAsync = createAsyncAction(
  (props) => {
    cachedAsyncCount++;

    return Promise.resolve({
      value: props.value + cachedAsyncCount.toString(),
    });
  },
  { propTypes: { value: PropTypes.string }, cache: { lifespan: 100 } }
);
cachedAsync.success = (state, action) => action.payload;

let cachedCallbackCount = 0;
const cachedCallback = createCallbackAction(
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
  { propTypes: { value: PropTypes.string }, cache: { lifespan: 100 } }
);
cachedCallback.success = (state, action) => action.payload;

const getCachedValue = createSyncAction(
  (props) => ({
    value: "getCachedValue",
  }),
  { propTypes: { value: PropTypes.string }, cache: { lifespan: 100 } }
);
getCachedValue.success = (state, action) => action.payload;

const setCachedValue = createSyncAction(
  (props) => {
    TestStore.cache.set("getCachedValue", props, { value: "setCachedValue" });
    return {
      value: "setCachedValue",
    };
  },
  { propTypes: { value: PropTypes.string } }
);
setCachedValue.success = (state, action) => action.payload;

export const TestStore = createLegacyStore({
  name: "TestStore",
  initialState: {
    value: null,
    numCallbacks: 0,
  },
  actions: {
    sync,
    async,
    callback,
    cachedSync,
    cachedAsync,
    cachedCallback,
    getCachedValue,
    setCachedValue,
  },
  propTypes: PropTypes.shape({
    value: PropTypes.string,
    numCallbacks: PropTypes.number,
  }),
  cache: { lifespan: 100 },
});
