import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { TestId } from "version-one-dev-utils/tests";

function Input(props) {
  const testId = TestId(props);

  return (
    <input
      {...testId()}
      {...props}
      className={classnames(
        "bg-gray-800 p-5 rounded outline-none border-4 border-gray-600 focus:border-blue-500",
        props.className
      )}
    />
  );
}

Input.propTypes = {
  "data-testid": PropTypes.string,
  className: PropTypes.string,
};

export { Input };
