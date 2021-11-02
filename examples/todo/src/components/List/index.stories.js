import React from "react";
import { List } from ".";

const Stories = {
  title: "Components/List",
  component: List,
};

export default Stories;

const Template = (args) => <List {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {},
};
