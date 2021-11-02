import React from "react";
import { SignUp } from ".";

const Stories = {
  title: "Components/SignUp",
  component: SignUp,
};

export default Stories;

const Template = (args) => <SignUp {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {},
};
