import React, { useState } from "react";
import PropTypes from "prop-types";
// import classnames from "classnames";

function Form(props) {
  const [value, setValue] = useState("");
  // const [options, setOptions] = useState([]);
  //
  // useEffect(() => {
  //   setOptions(props.options);
  // }, [props.options, setOptions]);

  function onChange(event) {
    setValue(event.target.value);
  }

  function onSubmit(event) {
    event.preventDefault();
    props.onClick(value);
  }

  return (
    <form onSubmit={onSubmit}>
      <label>
        Pick {props.label}:
        <select className="bg-black" value={value} onChange={onChange}>
          {props.options?.map((item, i) => (
            <option key={i} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <input type="submit" value="Submit" className="bg-black" />
    </form>
  );
}

Form.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string),
};

export { Form };
