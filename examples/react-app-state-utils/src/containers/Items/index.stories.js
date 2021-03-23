import React from "react";
import { MockStore } from "version-one-dev-utils/storybook/MockStore";

import { Items } from ".";

const Stories = {
  title: "Containers/Items",
  component: Items,
};

export default Stories;

export const Default = (args) => {
  const { state, props } = args;
  return (
    <MockStore state={state}>
      <Items {...props} />
    </MockStore>
  );
};

Default.args = {
  state: {
    ItemStore: {
      1: { type: "hello" },
    },
  },
  props: {},
};

export const Two = Default.bind({});
Two.args = {
  ...Default.args,
  state: {
    ItemStore: {},
  },
};
