import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import { Item } from ".";
import { ItemStore } from "../../stores/ItemStore";

const Stories = {
  title: "Containers/Item",
  component: Item,
};

export default Stories;

export const Default = (args) => {
  const { state, props } = args;

  return (
    <MockStore state={state}>
      <MockRouter path="/item/one?foo=bar#hash" route="/item/:id">
        <Item {...props} />
      </MockRouter>
    </MockStore>
  );
};

Default.args = {
  state: {
    ItemStore: {
      1: { id: 1, type: "hello" },
    },
  },
  props: {},
};

export const Pending = Default.bind({});
Pending.args = {
  ...Default.args,
  state: {
    PendingStore: [ItemStore.actions.get.byKey(1)],
    ItemStore: {},
  },
};
