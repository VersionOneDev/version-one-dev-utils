import React from "react";
import { render } from "@testing-library/react";
import { Default } from "./index.stories";

test("Renders", () => {
  render(<Default />);
});
