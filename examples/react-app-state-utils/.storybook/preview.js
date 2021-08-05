import React from "react";
import { addDecorator } from "@storybook/react";
import "../src/index.css";

import { RouteProvider } from "version-one-dev-utils";
import { MockRouter } from "version-one-dev-utils/storybook";

import { routes } from "../src/routes.js";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => {
    return (
      <RouteProvider value={routes}>
        <MockRouter>
          <Story />
        </MockRouter>
      </RouteProvider>
    );
  },
];
