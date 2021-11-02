import React from "react";
import { Search } from ".";

const Stories = {
  title: "Components/Search",
  component: Search,
};

export default Stories;

const Template = (args) => <Search {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {
    placeholder: "Not Google",
  },
};
