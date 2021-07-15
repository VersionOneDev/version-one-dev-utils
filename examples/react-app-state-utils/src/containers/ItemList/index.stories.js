import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import { Items } from ".";
import { ItemStore } from "../../stores/ItemStore";

const Stories = {
  title: "Containers/Items",
  component: Items,
};

export default Stories;

export const Default = (args) => {
  const { state, props, router } = args;
  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <Items {...props} />
      </MockRouter>
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
  router: { url: "/", route: "/" },
};

export const Pending = Default.bind({});
Pending.args = {
  ...Default.args,
  state: {
    PendingStore: [ItemStore.actions.get.byKey(1)],
    ItemStore: {},
  },
};
