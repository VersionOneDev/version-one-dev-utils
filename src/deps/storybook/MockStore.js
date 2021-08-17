import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ReduxThunk from "redux-thunk";
import { action } from "@storybook/addon-actions";
import PropTypes from "prop-types";

const logAction = (store) => (next) => (a) => {
  return next((dispatch, getState) => {
    // Log the action
    a().then((result) => {
      const actionHandler = action(`Action (${result.type})`);
      result.payload ? actionHandler(result.payload) : actionHandler();
    });

    // Return an empty resolved promise to keep the chain going
    return Promise.resolve();
  });
};

export const MockStore = (props) => {
  const { state, children } = props;

  const store = configureStore({
    reducer: () => state,
    middleware: [logAction, ReduxThunk],
  });

  return React.createElement(Provider, { store }, children);
};

MockStore.propTypes = {
  /** Mocked store state. */
  state: PropTypes.object,
  /** Children to render. */
  children: PropTypes.any,
};
