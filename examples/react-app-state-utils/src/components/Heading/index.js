import React from "react";
import PropTypes from "prop-types";
import { TestId } from "version-one-dev-utils";

function Heading(props) {
  const testId = TestId(props);

  return (
    <h1
      {...testId()}
      className="mb-10 text-4xl text-center"
      onClick={props.onClick}
    >
      {props.value}
    </h1>
  );
}

Heading.propTypes = {
  "data-testid": PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export { Heading };
