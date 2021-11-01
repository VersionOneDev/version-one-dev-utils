import { MockServer } from "./MockServer";

import data from "../mock.json";

const server = new MockServer({
  baseURL: "",
  db: data,
});

server.get("/login", (req, db) => ({ body: db.AuthStore }));

server.post("/logout");

server.get("/user/:id", (req, db) => ({
  body: db.UserStore[req.params.id],
}));

server.socket("/chat", (req, db) => {
  switch (req.body.type) {
    case "add":
      server.update({
        ChatStore: [
          {
            message: req.body.message,
            from: req.body.from,
            ts: Date.now(),
          },
        ],
      });
      return;
    default:
      return { body: db.ChatStore };
  }
});

server.socket("/items", (req, db) => ({ body: db.ItemStore }));

server.post("/items", (req, db) => {
  const id = Date.now().toString();
  server.update({
    ItemStore: {
      [id]: {
        id,
        title: req.body.title,
        completed: false,
        completedBy: "",
        createdBy: req.headers.Authorization,
      },
    },
  });
});

server.put("/items/:id", (req, db) => {
  server.update({
    ItemStore: {
      [req.params.id]: {
        title: req.body.title,
      },
    },
  });
});

server.put("/items/:id/complete", (req, db) => {
  server.update({
    ItemStore: {
      [req.params.id]: {
        completed: true,
        completedBy: req.headers.Authorization,
      },
    },
  });

  return { body: db.ItemStore[req.params.id] };
});

server.put("/items/:id/incomplete", (req, db) => {
  server.update({
    ItemStore: {
      [req.params.id]: {
        completed: false,
        completedBy: "",
      },
    },
  });

  return { body: db.ItemStore[req.params.id] };
});
