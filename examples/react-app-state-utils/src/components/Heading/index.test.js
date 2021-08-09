// React
import React from "react";
// Testing
import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
// Stories
import * as stories from "./index.stories";
import userEvent from "@testing-library/user-event";

const { Template } = composeStories(stories);

global.STORYBOOK_ACTION = jest.fn();

describe("ItemList (Template Story)", () => {
  it("Displays the component", () => {
    render(<Template />);
    expect(screen.getByTestId(Template.args.props["data-testid"]));
  });
  it("Calls onClickHeading when clicked", () => {
    render(<Template />);
    userEvent.click(screen.getByTestId(Template.args.props["data-testid"]));
    expect(global.STORYBOOK_ACTION).toHaveBeenCalled();
  });
});
