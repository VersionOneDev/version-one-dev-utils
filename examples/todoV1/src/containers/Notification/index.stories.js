import React from "react";
import { MockStore } from "version-one-dev-utils/storybook";

import { Notification } from ".";
import { ItemStore } from "../../stores/ItemStore";

const Stories = {
  title: "Containers/Notification",
  component: Notification,
};

export default Stories;

export const Default = (args) => {
  const { state, props } = args;
  return (
    <MockStore state={state}>
      <Notification {...props} />
    </MockStore>
  );
};

Default.args = {
  state: {
    PendingStore: [ItemStore.actions.complete.byKey(1)],
  },
  props: {},
};
