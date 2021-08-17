import React from "react";
import "../src/index.css";
import { RouteProvider, TestId } from "version-one-dev-utils";
import { MockRouter } from "version-one-dev-utils/storybook";

import { routes } from "../src/routes.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story, config) => {
    config.args.props = {
      "data-testid": "ref",
      ...config.args.props,
    };
    return (
      <RouteProvider value={routes}>
        <MockRouter>
          <Story />
        </MockRouter>
      </RouteProvider>
    );
  },
];
