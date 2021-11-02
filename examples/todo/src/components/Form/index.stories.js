import React from "react";
import { action } from "version-one-dev-utils/storybook";
import { Form } from ".";

const Stories = {
  title: "Components/Form",
  component: Form,
};

export default Stories;

const Template = (args) => <Form {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {
    label: "an option",
    onClick: action("onClick"),
  },
};

export const Animals = Template.bind({});
Animals.args = {
  props: {
    label: "an animal",
    options: ["cat", "dog", "bird"],
    onClick: action("onClick"),
  },
};
