import React from "react";
// import PropTypes from "prop-types";
// import classnames from "classnames";
const list = ["cat", "dog", "bird"];

function List(props) {
  return (
    <div>
      <ul>
        {list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export { List };
