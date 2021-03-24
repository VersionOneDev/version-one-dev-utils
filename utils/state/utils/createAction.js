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

export const getKey = (action) => {
  return action.meta && action.meta.key ? "/" + action.meta.key : "";
};

const prepareAction = (props, key, payload, error) => ({
  meta: { key, props },
  payload,
  error,
});

/**
 * Wait for the action to be processed and return a value.
 */
const waitForValue = async (value) => await value;

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

export const createAction = (store, type, handler) => {
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

    // Validate payload - will throw a warning in the console if invalid.
    if (handler.propTypes) {
      PropTypes.checkPropTypes(
        handler.propTypes,
        props,
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
          resolve(dispatch(action.success(props, key, value)));

        const dispatchError = (error) =>
          reject(dispatch(action.error(props, key, null, error)));

        // Get the payload from the action handler
        try {
          const payload = handler(props, actionApi);

          if (payload instanceof Function) {
            // Dispatch pending action and run the callback
            dispatch(action.pending(props, key));
            payload(dispatchSuccess, dispatchError);
          } else if (payload.then && payload.catch) {
            // Dispatch pending action if promise
            dispatch(action.pending(props, key));
            waitForValue(payload).then(dispatchSuccess).catch(dispatchError);
          } else {
            dispatchSuccess(payload);
          }
        } catch (error) {
          dispatchError(error);
        }
      });
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
