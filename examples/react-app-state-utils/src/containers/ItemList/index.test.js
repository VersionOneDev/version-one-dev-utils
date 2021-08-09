// React
import React from "react";
// Testing
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import userEvent from "@testing-library/user-event";
// Stories
import * as stories from "./index.stories";

const { Template } = composeStories(stories);

global.STORYBOOK_ACTION = jest.fn();

/** Template story */
describe("ItemList (Template Story)", () => {
  it("Matches snapshot", () => {
    expect(render(<Template />)).toMatchSnapshot();
  });

  it("Changes route to item when view is clicked", () => {
    render(<Template />);
    userEvent.click(screen.getByTestId("ItemList/itemView/1"));
    expect(global.STORYBOOK_ACTION).toHaveBeenCalledWith("/item/1");
  });

  it("Displays Heading component", () => {
    render(<Template />);
    expect(screen.getByTestId("ItemList/title"));
  });

  it("Fetches items from ItemStore", async () => {
    render(<Template />);
    await waitFor(() =>
      expect(global.STORYBOOK_ACTION).toHaveBeenCalledWith({
        type: "ItemStore/get",
      })
    );
  });
});
