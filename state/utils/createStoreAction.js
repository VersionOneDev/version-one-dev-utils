import { createAction as createActionI } from "@reduxjs/toolkit";

if (!("toJSON" in Error.prototype))
  Object.defineProperty(Error.prototype, "toJSON", {
    value: function () {
      var alt = {};

      Object.getOwnPropertyNames(this).forEach(function (key) {
        alt[key] = this[key];
      }, this);

      return alt;
    },
    configurable: true,
    writable: true,
  });

/**
 * Wait for the action to be processed and return a value.
 */
const waitForValue = async (value) => await value;

export const statuses = { PENDING: "/pending", ERROR: "/error" };

export const getType = (action) => {
  let { type } = action;
  Object.values(statuses).forEach(
    (status) => (type = type.replace(status, ""))
  );
  return type;
};

export const getKey = (action) => {
  return action.meta && action.meta.key ? "/" + action.meta.key : "";
};

const prepareAction = (props, key, payload, error) => {
  return {
    meta: { key, props },
    payload,
    error,
  };
};

/**
 * CREATING ACTIONS:
 *
 * Action methods should return a value, promise, or a callback function that should accept resolve and reject as arguments.
 * Promises and callbacks will trigger a PENDING state, values will not.
 * Callbacks will remain in pending state until resolve or reject is called for the FIRST time.
 *
 * Examples:
 *
 * const myAction = (props) => props;
 *
 * const myAction = (props) => Promise.resolve(props);
 *
 * const myAction = (props) => (resolve, reject) => setInterval(resolve, 2000, props);
 *
 */

export const createStoreAction = (store, type, handler) => {
  const action = (props, key) => (dispatch, getState) => {
    // Check props is an object
    if (props) {
      const propsType = typeof props;
      if (propsType !== "object") {
        throw new Error(
          `Invalid type ${propsType} passed to ${store}.actions.${type}, props must be an object`
        );
      }
    }

    // ReduxThunk thunk will pass a dispatch function but Storybook won't
    // Only do the work if using ReduxThunk
    if (dispatch) {
      let unsubscribe;
      let complete = false;

      const promise = new Promise((resolve) => {
        const actionApi = {
          dispatch,
          getState,
        };

        const dispatchError = (message) => {
          complete = true;

          return resolve(
            dispatch(
              action.error(
                props,
                key,
                undefined,
                new Error(message, { cause: action.toString() })
              )
            )
          );
        };

        // Get the payload from the action handler
        try {
          const dispatchSuccess = (value) => {
            complete = true;
            const result = dispatch(action.success(props, key, value));
            resolve(result.payload);
            return result;
          };

          if (handler.type === "callback") {
            const callback = handler(props, actionApi);
            unsubscribe = callback(dispatchSuccess, dispatchError);
          } else {
            const payload = handler(props, actionApi);
            waitForValue(payload).then(dispatchSuccess).catch(dispatchError);
          }

          // If calling the handler hasn't immediately triggered dispatchSuccess or dispatchError then assume we're in a pending state
          if (!complete) {
            dispatch(action.pending(props, key));
          }
        } catch (error) {
          dispatchError(error);
        }
      });

      // Create an action object to apply to the promise to fullfil ActionPromise type
      const actionObj = prepareAction(props, key);

      Object.keys(actionObj).forEach((key) => {
        promise[key] = actionObj[key];
      });

      promise.type = action.toString();
      promise.unsubscribe = unsubscribe;

      return promise;
    } else {
      // Return the action for logging in Storybook
      return Promise.resolve({ type: action.toString(), props, key });
    }
  };

  action.toString = () => `${store}/${type}`;
  action.byKey = (key) => `${action.toString()}/${key}`;
  action.success = createActionI(action.toString(), prepareAction);
  action.error = createActionI(
    `${action.toString()}${statuses.ERROR}`,
    prepareAction
  );
  action.pending = createActionI(
    `${action.toString()}${statuses.PENDING}`,
    prepareAction
  );

  action.propTypes = handler.propTypes;

  return action;
};
