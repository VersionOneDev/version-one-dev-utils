import React from "react";
import PropTypes from "prop-types";
import { TestId } from "version-one-dev-utils";

function Heading(props) {
  const testId = TestId(props);

  return (
    <div onClick={props.onClickHeading} {...testId()}>
      <h1 className="mb-10 text-4xl text-center">{props.value}</h1>
    </div>
  );
}

Heading.propTypes = {
  value: PropTypes.string.isRequired,
  "data-testId": PropTypes.string,
  onClickHeading: PropTypes.func,
};

export { Heading };
