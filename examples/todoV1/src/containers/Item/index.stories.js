import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import { Item } from ".";
import { ItemStore } from "../../stores/ItemStore";
import ItemStoreMock from "../../stores/ItemStore.mock";

const Stories = {
  title: "Containers/Item",
  component: Item,
};

export default Stories;

const Template = (args) => {
  const { state, props, router } = args;

  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <Item {...props} />
      </MockRouter>
    </MockStore>
  );
};

export const Default = Template.bind({});

Default.args = {
  state: {
    ItemStore: ItemStoreMock,
  },
  props: {},
  router: {
    url: "/item/1",
    route: "/item/:id",
  },
};

export const Pending = Default.bind({});
Pending.args = {
  ...Default.args,
  state: {
    PendingStore: [ItemStore.actions.get.byKey(1)],
    ItemStore: {},
  },
};
