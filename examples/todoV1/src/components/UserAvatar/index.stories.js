import React from "react";
import { UserAvatar } from ".";

const Stories = {
  title: "Components/UserAvatar",
  component: UserAvatar,
};

export default Stories;

const Template = (args) => <UserAvatar {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {
    name: "Bob",
  },
};
