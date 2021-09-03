// React
import React from "react";
// Testing
import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
// Stories
import * as stories from "./index.stories";
import userEvent from "@testing-library/user-event";

const { Template } = composeStories(stories);

describe("ItemList (Template Story)", () => {
  it("Matches snapshot", () => {
    expect(render(<Template />)).toMatchSnapshot();
  });
  it("Displays the correct text value", () => {
    render(<Template />);
    expect(screen.getByTestId("ref")).toHaveTextContent("Title");
  });
  it("Calls onClickHeading when clicked", () => {
    render(<Template />);
    userEvent.click(screen.getByTestId("ref"));
    expect(global.STORYBOOK_ACTION).toHaveBeenCalled();
  });
});
