import React from "react";
import { action } from "@storybook/addon-actions";
import PropTypes from "prop-types";

import { Store, StoreProvider } from "../../utils/state/Store";

export function MockStore(props) {
  Store.dispatch = (a) => {
    // Log the action
    a().then((result) => action("Action: " + JSON.stringify(result))());

    // Return an empty resolved promise to keep the chain going
    return Promise.resolve();
  };

  const { state, children } = props;
  return React.createElement(StoreProvider, { value: state }, children);
}

MockStore.propTypes = {
  /** Mocked store state. */
  state: PropTypes.object,
  /** Children to render. */
  children: PropTypes.any,
};
