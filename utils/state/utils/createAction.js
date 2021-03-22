import { createAction as createActionI } from "@reduxjs/toolkit";
import PropTypes from "prop-types";

export const statuses = { PENDING: "/pending", ERROR: "/error" };

export const getType = (action) => {
  let { type } = action;
  Object.values(statuses).forEach(
    (status) => (type = type.replace(status, ""))
  );
  return type;
};

export const getKey = (action) =>
  action.meta && action.meta.key ? "/" + action.meta.key : "";

const prepareAction = (key, payload, error) => ({
  meta: { key },
  payload,
  error,
});

/**
 * Wait for the action to be processed and return a value.
 */
const waitForValue = async (result) => await result;

/**
 * CREATING ACTIONS:
 *
 * Action methods should return a value, promise, or a callback function that should accept resolve and reject as arguments.
 * Promises and callbacks will trigger a PENDING state, values will not.
 * Callbacks will remain in pending state until resolve or reject is called for the FIRST time.
 *
 * Examples:
 *
 * const myAction = (payload) => payload;
 *
 * const myAction = (payload) => Promise.resolve(payload);
 *
 * const myAction = (payload) => (resolve, reject) => setInterval(resolve, 2000, payload);
 *
 */

export const createAction = (store, type, handler) => {
  const action = (payload, key) => (dispatch, getState) => {
    // Validate payload - will throw a warning in the console if invalid.
    if (handler.propTypes) {
      PropTypes.checkPropTypes(
        handler.propTypes,
        payload,
        "prop",
        `${store}.actions.${type}`
      );

      PropTypes.resetWarningCache();
    }

    // ReduxThunk thunk will pass a dispatch function but Storybook won't
    // Only do the work if using ReduxThunk
    if (dispatch) {
      return new Promise((resolve, reject) => {
        const actionApi = {
          dispatch,
          getState,
        };

        const dispatchSuccess = (value) =>
          resolve(dispatch(action.success(key, value)));

        const dispatchError = (error) =>
          reject(dispatch(action.error(key, null, error)));

        // Get the result from the action handler
        const result = handler(payload, actionApi);

        if (result instanceof Function) {
          // Dispatch pending action and run the callback
          dispatch(action.pending(key));
          result(dispatchSuccess, dispatchError);
        } else {
          // Dispatch pending action if promise
          if (result.then && result.catch) {
            dispatch(action.pending(key));
          }

          waitForValue(result).then(dispatchSuccess).catch(dispatchError);
        }
      });
    } else {
      // Return the action for logging in Storybook
      return Promise.resolve({ type: action.toString(), payload });
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

  return action;
};
