import React from "react";

import { ItemStore } from "./ItemStore";

export default {
  title: "Stores/ItemStore",
};

export const Default = (args) => {
  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <h3>Initial State:</h3>
        {JSON.stringify(ItemStore.initialState)}
      </div>

      <div style={{ marginBottom: 40 }}>
        <h3>Actions:</h3>
        <ul>
          {Object.keys(ItemStore.actions).map((name) => {
            console.log(ItemStore.actions[name].propTypes);
            return (
              <li key={name} style={{ marginBottom: 10 }}>
                {`${name}(${
                  ItemStore.actions[name].propTypes
                    ? "{" +
                      Object.keys(ItemStore.actions[name].propTypes).join(",") +
                      "}"
                    : ""
                })`}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

Default.args = {};
