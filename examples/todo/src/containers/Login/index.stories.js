import React from "react";
import { Login } from ".";

const Stories = {
  title: "Containers/Login",
  component: Login,
};

export default Stories;

const Template = (args) => <Login {...args.props} />;

export const Default = Template.bind({});
Default.args = {
  props: {},
};
