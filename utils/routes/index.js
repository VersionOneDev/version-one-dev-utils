import { createContext, useContext, useMemo } from "react";
import {
  useHistory,
  useLocation,
  useRouteMatch,
  matchPath,
} from "react-router-dom";

const context = createContext({});

export const RouteProvider = context.Provider;

const getQuery = (str) => {
  const v = {};
  const p = new URLSearchParams(str);
  for (const [key, value] of p) v[key] = value;
  return v;
};

const parseQuery = (params = {}) => {
  const parts = Object.keys(params)
    .filter((key) => params[key])
    .map((key) => `${key}=${params[key]}`);
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
  const _history = useHistory();
  const _location = useLocation();
  const _route = useRouteMatch();

  const query = useMemo(() => getQuery(_location.search), [_location.search]);

  return useMemo(
    () => ({
      routes,
      route: _route.path,
      path: _location.pathname,
      hash: _location.hash,
      params: _route.params,
      query,
      push: (route, params, query) =>
        _history.push(getPath(route, params, query)),
      replace: (route, params, query) =>
        _history.replace(getPath(route, params, query)),
      link: getPath,
      match: (path) => matchPath(_location.pathname, { path }),
    }),
    [routes, _history, _location, _route, query]
  );
};
