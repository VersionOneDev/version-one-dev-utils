import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

function Button(props) {
  return (
    <button
      className={classnames(
        "block text-black uppercase text-lg mx-auto p-4 rounded",
        `bg-${props.color}`
      )}
      onClick={() => props.onClick(props.color)}
    >
      Click Me
    </button>
  );
}

Button.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export { Button };
