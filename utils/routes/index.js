import { createContext, useContext, useMemo } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";

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
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const value = useMemo(
    () => ({
      ...routes,
      push: (route, params, query) =>
        history.push(getPath(route, params, query)),
      link: getPath,
      location,
      query: getQuery(location.search),
      params,
    }),
    [history, location, routes, params]
  );

  return value;
};
