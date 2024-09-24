import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import mockData from "../../mock.json";

import { Header } from ".";

const Stories = {
  title: "Containers/Header",
  component: Header,
};

export default Stories;

export const Default = (args) => {
  const { state, props, router } = args;

  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <Header {...props} />
      </MockRouter>
    </MockStore>
  );
};

Default.args = {
  state: {
    ...mockData,
  },
  props: {},
  router: {},
};
