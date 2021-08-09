import React from "react";
import { MockStore, MockRouter, action } from "version-one-dev-utils/storybook";
import { Heading } from ".";

const Stories = {
  title: "Containers/Heading",
  component: Heading,
};

export default Stories;

export const Template = (args) => {
  const { state, props, router } = args;
  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <Heading {...props} />
      </MockRouter>
    </MockStore>
  );
};

Template.args = {
  props: {
    value: "Title",
    "data-testid": "Heading",
    onClickHeading: action("onClickHeading"),
  },
};
