import React, { useRef, useEffect } from "react";
import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import PropTypes from "prop-types";
import { action } from "../action";

export const MockRouter = (props) => {
  const { route, url, state, children } = props;

  const history = useRef();
  // Make sure we only call createMemoryHistory when we have to!
  if (!history.current) {
    history.current = createMemoryHistory();
    history.current.replace(url, state);
  }

  useEffect(() => {
    const unlisten = history.current.listen(() => {
      const location = history.current.location;
      const args = [location.pathname];
      if (location.state) args.push(location.state);
      action("Route")(...args);
    });

    return () => unlisten();
  }, []);

  return React.createElement(
    Router,
    { history: history.current },
    React.createElement(Route, { path: route }, children)
  );
};

MockRouter.defaultProps = {
  route: "*",
  url: "/",
};

MockRouter.propTypes = {
  /** The url to render. */
  url: PropTypes.string,
  /** The route to test. */
  route: PropTypes.string,
  /** Additional state to pass to a route. */
  state: PropTypes.object,
  /** Children to render. */
  children: PropTypes.any,
};
