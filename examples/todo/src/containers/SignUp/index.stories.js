import React from "react";
import { SignUp } from ".";
import { MockStore } from "version-one-dev-utils/storybook";

const Stories = {
  title: "Containers/SignUp",
  component: SignUp,
};

export default Stories;

const Template = (args) => (
  <MockStore state={{}}>
    <SignUp {...args.props} />
  </MockStore>
);

export const Default = Template.bind({});
Default.args = {
  props: {},
};
