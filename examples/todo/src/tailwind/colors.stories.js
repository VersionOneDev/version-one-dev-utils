import React from "react";
import PropTypes from "prop-types";

import config from "./colors";

const Stories = {
  title: "Tailwind/Colors",
};

export default Stories;

const Color = (props) => (
  <div className="inline-block text-center text-xs mr-1">
    <div
      style={{ width: 50, height: 30, background: props.value }}
      className={`bg-${props.name} rounded mb-0.5 ${
        props.name === "white" && "border border-grey-300"
      }`}
    />
    <div>{props.shade}</div>
  </div>
);

Color.propTypes = {
  name: PropTypes.string,
  shade: PropTypes.string,
  value: PropTypes.string,
};

export const Colors = () => {
  return (
    <div className="divide-y divide-grey-100">
      {Object.keys(config.colors).map((color) => {
        return (
          <div key={color} className="flex py-2">
            <p style={{ width: 120 }}>{color}</p>
            <div>
              {typeof config.colors[color] === "string" && (
                <Color name={color} value={config.colors[color]} />
              )}
              {typeof config.colors[color] !== "string" &&
                Object.keys(config.colors[color]).map((shade) => (
                  <Color
                    key={shade}
                    name={`${color}-${shade}`}
                    shade={shade}
                    value={config.colors[color][shade]}
                  />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
