import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import { Form } from ".";

const Stories = {
  title: "Containers/Form",
  component: Form,
};

export default Stories;

export const Default = (args) => {
  const { state, props, router } = args;

  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <Form {...props} />
      </MockRouter>
    </MockStore>
  );
};

Default.args = {
  state: {},
  props: {},
  router: {},
};
