import React from "react";
import { action } from "version-one-dev-utils/storybook";
import { Button } from ".";

const Stories = {
  title: "Components/Button",
  component: Button,
};

export default Stories;

const Template = (args) => <Button {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {
    color: "blue-500",
    onClick: action("onClick"),
  },
};

export const Yellow = Template.bind({});
Yellow.args = {
  props: {
    color: "yellow",
    onClick: action("onClick"),
  },
};
