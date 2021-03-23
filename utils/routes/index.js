import { createContext, useContext, useMemo } from "react";

import { useHistory, useLocation } from "react-router-dom";

const context = createContext({});

export const RouteProvider = context.Provider;

const parseQuery = (params = {}) => {
  const parts = Object.keys(params).map((key) => `${key}=${params[key]}`);
  return parts.length ? `?${parts.join("&")}` : "";
};

const getPath = (route, params = {}, query = {}) => {
  const parts = route
    .split("/")
    .map((part) =>
      part.endsWith("?") ? part.substring(0, part.length - 1) : part
    )
    .map((part) => (part.charAt(0) === ":" ? params[part.substring(1)] : part));

  return `${parts.join("/").replace(/\/+$/, "")}${parseQuery(query)}`;
};

export const useRoutes = () => {
  const routes = useContext(context);
  const history = useHistory();
  const location = useLocation();

  const value = useMemo(
    () => ({
      ...routes,
      push: (route, params, query) =>
        history.push(getPath(route, params, query)),
      link: getPath,
      location,
    }),
    [history, location, routes]
  );

  return value;
};
