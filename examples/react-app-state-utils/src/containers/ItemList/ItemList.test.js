// React
import React from "react";
// Testing
import { render, screen, waitFor } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
// import userEvent from "@testing-library/user-event";
// Stories
import * as stories from "./index.stories";

// const jestFn = jest.fn();

const { Template } = composeStories(stories);

// global.STORYBOOK_ROUTE = (result) => {
//   console.log("Action Global: " + JSON.stringify(result))();
//   jestFn(result);
// };

global.STORYBOOK_ACTION = jest.fn();

describe("ItemList (Template Story)", () => {
  it("Renders", () => {
    render(<Template />);
  });
  it("Displays heading", () => {
    render(<Template />);
    expect(screen.getByTestId("title"));
  });
  it("calls ItemStore/get on render", async () => {
    render(<Template />);
    await waitFor(() =>
      expect(global.STORYBOOK_ACTION).toHaveBeenCalledWith({
        type: "ItemStore/get",
      })
    );
  });
});
