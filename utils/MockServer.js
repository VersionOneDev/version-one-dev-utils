import merge from "deepmerge";

import { MockWebSocket } from "./MockWebSocket";

const DEFAULT_CONFIG = { method: "GET", headers: {}, body: null };

export class MockServer {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.db = config.db;
    this.routes = {};
    this.debug = config.debug;

    this.nativeFetch = window.fetch.bind(window);
    window.fetch = this.fetch.bind(this);
    window.WebSocket = MockWebSocket;
  }

  createRoute(path, method, cb) {
    if (!this.routes[path]) {
      this.routes[path] = {};
    }

    this.routes[path][method] = (...args) => {
      if (this.debug) console.log("MockServer: ", method, path, ...args);
      return cb(...args);
    };
    return this;
  }

  getPathFromURL(url) {
    const paths = Object.keys(this.routes);

    const path = paths.find((path) => {
      const splitURL = url.split("/");
      const splitPath = path.split("/");

      if (splitURL.length !== splitPath.length) return false;

      for (var i = 0; i < splitURL.length; i++) {
        if (splitURL[i] !== splitPath[i] && splitPath[i][0] !== ":")
          return false;
      }

      return true;
    });

    return path;
  }

  getParams(url, path) {
    const splitURL = url.split("/");
    const splitPath = path.split("/");

    const params = {};

    for (var i = 0; i < splitURL.length; i++) {
      if (splitPath[i][0] === ":") {
        params[splitPath[i].substring(1)] = splitURL[i];
      }
    }

    return params;
  }

  update(data) {
    this.db = merge(this.db, data);
    MockWebSocket.dispatch();
  }

  get(path, cb) {
    return this.createRoute(path, "GET", cb);
  }

  post(path, cb) {
    return this.createRoute(path, "POST", cb);
  }

  put(path, cb) {
    return this.createRoute(path, "PUT", cb);
  }

  delete(path, cb) {
    return this.createRoute(path, "DELETE", cb);
  }

  socket(path, cb) {
    return this.createRoute(path, "SOCKET", cb);
  }

  fetch(url, config = {}) {
    const mergedConfig = merge(DEFAULT_CONFIG, config);

    const path = this.getPathFromURL(url);

    if (path) {
      const cb = this.routes[path][mergedConfig.method];
      const db = this.db;

      if (cb) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const req = {
              headers: mergedConfig.headers,
              params: this.getParams(url, path),
              body: JSON.parse(mergedConfig.body),
            };

            const res = {
              status: 200,
              body: undefined,
              ...cb(req, db),
            };

            if (res.status >= 200 && res.status < 400) {
              return resolve({
                status: res.status,
                json: () => res.body && JSON.parse(JSON.stringify(res.body)),
              });
            } else {
              return reject({
                status: res.status,
                error: {
                  message: res.error || "Internal server error",
                },
              });
            }
          }, mergedConfig.method !== "SOCKET" && Math.random() * 1000);
        });
      }
    }

    return this.nativeFetch(url, config);
  }
}

let server;

MockServer.get = (db) => {
  if (!server) {
    server = new MockServer({ baseURL: "" });
  }

  server.db = { ...server.db, ...db };
  return server;
};
