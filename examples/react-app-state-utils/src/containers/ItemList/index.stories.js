import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";
import deepmerge from "deepmerge";

import { ItemList } from ".";
import { ItemStore } from "../../stores/ItemStore";
import ItemStoreMock from "../../stores/ItemStore.mock";

const Stories = {
  title: "Containers/ItemList",
  component: ItemList,
};

export default Stories;

export const Template = (args) => {
  const { state, props, router } = args;
  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <ItemList {...props} />
      </MockRouter>
    </MockStore>
  );
};

Template.args = {
  state: {
    ItemStore: ItemStoreMock,
  },
  props: {},
  router: { url: "/", route: "/" },
};

export const CompletedItem = Template.bind({});
CompletedItem.args = deepmerge(Template.args, {});

export const IncompletedItem = Template.bind({});
IncompletedItem.args = deepmerge(Template.args, {
  state: {
    ItemStore: {
      items: {
        1: {
          completed: false,
        },
      },
    },
  },
});

export const Pending = Template.bind({});
Pending.args = deepmerge(Template.args, {
  state: {
    PendingStore: [ItemStore.actions.complete.byKey(1)],
  },
});
