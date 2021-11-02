import React from "react";
import { Login } from ".";

const Stories = {
  title: "Components/SignUp",
  component: Login,
};

export default Stories;

const Template = (args) => <Login {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {
    firstName: null,
    surname: null,
  },
};

export const Mark = Template.bind({});
Mark.args = {
  props: {
    firstName: "Mark",
    surname: "Carson",
  },
};
