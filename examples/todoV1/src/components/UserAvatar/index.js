import React from "react";
import PropTypes from "prop-types";
import { TestId } from "version-one-dev-utils/tests";

function UserAvatar(props) {
  const testId = TestId(props);

  return (
    <div
      {...testId()}
      className="relative inline-flex justify-center items-center w-[3em] h-[3em] font-bold bg-violet-700 rounded-full overflow-hidden"
    >
      {props.name.charAt(0).toUpperCase()}
      {props.url && (
        <img className="absolute inset-0" src={props.url} alt={props.name} />
      )}
    </div>
  );
}

UserAvatar.propTypes = {
  "data-testid": PropTypes.string,
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
};

export { UserAvatar };
