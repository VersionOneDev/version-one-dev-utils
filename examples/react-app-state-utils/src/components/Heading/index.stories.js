import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";
import { Heading } from ".";

const Stories = {
  title: "Containers/Heading",
  component: Heading,
};

export default Stories;

const onClickHeading = () => console.log("onClickHeading called");

export const Template = (args) => {
  const { state, props, router } = args;
  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <Heading {...props} onClickHeading={onClickHeading} />
      </MockRouter>
    </MockStore>
  );
};

Template.args = {
  props: {
    value: "Title",
    "data-testid": "Heading",
  },
};
