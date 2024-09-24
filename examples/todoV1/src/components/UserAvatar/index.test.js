// React
import React from "react";
// Testing
import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
// Stories
import * as stories from "./index.stories";

const { Default } = composeStories(stories);

describe("UserAvatar", () => {
  it("Matches snapshot", () => {
    expect(render(<Default />)).toMatchSnapshot();
  });
  it("Displays the correct inital", () => {
    render(<Default />);
    expect(screen.getByTestId("ref")).toHaveTextContent("B");
  });
});
