import React from "react";

import { addDecorator } from "@storybook/react";

import { RouteProvider } from "version-one-dev-utils";
import { MockRouter } from "version-one-dev-utils/storybook";

import { routes } from "../src/routes";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

addDecorator((storyFn) => {
  return (
    <RouteProvider value={routes}>
      <MockRouter>{storyFn()}</MockRouter>
    </RouteProvider>
  );
});
