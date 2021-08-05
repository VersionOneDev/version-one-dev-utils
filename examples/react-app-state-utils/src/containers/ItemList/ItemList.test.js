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
global.STORYBOOK_ROUTE = jest.fn();

describe("ItemList (Template Story)", () => {
  it("Displays title", () => {
    render(<Template />);
    expect(screen.getByTestId("ref/title"));
  });

  it("Fetches items from ItemStore", async () => {
    render(<Template />);
    await waitFor(() =>
      expect(global.STORYBOOK_ACTION).toHaveBeenCalledWith({
        type: "ItemStore/get",
      })
    );
  });

  it("Changes route to item when view is clicked", () => {
    render(<Template />);
    userEvent.click(screen.getByTestId("ref/itemView/1"));
    expect(global.STORYBOOK_ROUTE).toHaveBeenCalledWith("/item/1");
  });
});
