import React from "react";
import PropTypes from "prop-types";
// import classnames from "classnames";

function Search(props) {
  return (
    <form action="/" method="get">
      <input type="text" id="search" placeholder={props.placeholder} />
      <button type="submit">Search</button>
    </form>
  );
}

Search.propTypes = {
  placeholder: PropTypes.string,
};

export { Search };
