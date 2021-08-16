import React from "react";
import { render, screen } from "@testing-library/react";
import { ItemList } from "./index";

it("renders welcome message", () => {
  render(<ItemList />);
  expect(screen.getByTestId("ref/title")).toBeInTheDocument();
});
