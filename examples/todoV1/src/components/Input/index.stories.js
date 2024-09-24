import React from "react";
import { Input } from ".";

const Stories = {
  title: "Components/Input",
  component: Input,
};

export default Stories;

const Template = (args) => <Input {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {},
};
