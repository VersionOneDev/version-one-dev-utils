import React from "react";
import { MockStore, MockRouter } from "version-one-dev-utils/storybook";

import StreetFighterForm from ".";

const Stories = {
  title: "Containers/StreetFighterForm",
  component: StreetFighterForm,
};

export default Stories;

export const Default = (args) => {
  const { state, props, router } = args;

  return (
    <MockStore state={state}>
      <MockRouter {...router}>
        <div className=" m-4 p-6 bg-gray-200 text-black">
          <StreetFighterForm {...props} />
        </div>
      </MockRouter>
    </MockStore>
  );
};

Default.args = {
  state: {},
  props: {
    "data-testid": "testId",
  },
  router: {},
};
