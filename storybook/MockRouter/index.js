import React, { useRef, useEffect } from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import PropTypes from "prop-types";
import { action } from "@storybook/addon-actions";

export const MockRouter = (props) => {
  const { path, state, children } = props;
  const actionHandler = React.useMemo(() => action("Route"), []);

  const history = useRef();
  // Make sure we only call createMemoryHistory when we have to!
  if (!history.current) {
    history.current = createMemoryHistory();
    history.current.replace(path, state);
  }

  useEffect(() => {
    const unlisten = history.current.listen(() => {
      const location = history.current.location;
      const args = [location.pathname];
      if (location.state) args.push(location.state);
      actionHandler(...args);
    });

    return () => unlisten();
  }, [actionHandler]);

  return React.createElement(
    Router,
    { history: history.current },
    React.createElement(Route, { path: props.route }, children)
  );
};

MockRouter.defaultProps = {
  route: "*",
  path: "/",
};

MockRouter.propTypes = {
  /** The path to render. */
  path: PropTypes.string,
  /** The route to test. */
  route: PropTypes.string,
  /** Additional state to pass to a route. */
  state: PropTypes.object,
  /** Children to render. */
  children: PropTypes.any,
};
