import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import { AddTodo } from ".";

const Stories = {
  title: "Containers/AddTodo",
  component: AddTodo,
};

export default Stories;

export const Default = (args) => {
  const { state, props, router } = args;

  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <AddTodo {...props} />
      </MockRouter>
    </MockStore>
  );
};

Default.args = {
  state: {},
  props: {},
  router: {},
};
