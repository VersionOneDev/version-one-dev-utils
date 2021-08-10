import { action as _action } from "@storybook/addon-actions";

global.STORYBOOK_ACTION = () => {};

export const action = (name) => {
  const cb = _action(name);
  return (...args) => {
    global.STORYBOOK_ACTION(...args);
    return cb(...args);
  };
};
