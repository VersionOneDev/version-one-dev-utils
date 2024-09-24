import React, { useEffect } from "react";
import * as yup from "yup";
import classnames from "classnames";
import moment from "moment";

import { useForm } from "version-one-dev-utils/forms";
import { useSelector } from "version-one-dev-utils/state";

import { ChatStore } from "../../stores/ChatStore";
import { UserStore } from "../../stores/UserStore";

export function Chat(props) {
  const userId = useSelector((state) => state.AuthStore.id);
  const items = useSelector((state) => state.ChatStore);
  const users = useSelector((state) => state.UserStore);

  useEffect(() => ChatStore.actions.watch(), []);

  useEffect(() => {
    items.forEach((item) => UserStore.actions.get({ id: item.from }));
  }, [items]);

  const form = useForm({
    mode: "onChange",
    schema: {
      message: yup.string().required("Please add a message"),
    },
    defaultValues: {
      message: "",
    },
    onSubmit: (values) => ChatStore.actions.add(values).then(form.reset),
  });

  return (
    <div className="h-full flex flex-col">
      <ul className="flex-1">
        {items.map((item, index) =>
          users[item.from] ? (
            <li
              key={index}
              className={classnames(
                "mb-4",
                item.from === userId ? "text-right" : "text-left"
              )}
            >
              <div
                className={classnames(
                  "inline-block mb-2 p-4 rounded-lg",
                  item.from === userId ? "bg-blue-500" : "bg-gray-700 "
                )}
              >
                {item.message}
              </div>
              <div
                className={classnames(
                  "flex items-center",
                  item.from === userId ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className="flex flex-col text-xs mx-2">
                  <span className="opacity-50">{users[item.from].name}</span>
                  <span className="opacity-25">
                    {moment(item.ts).fromNow()}
                  </span>
                </div>
              </div>
            </li>
          ) : (
            <li key={index}>...</li>
          )
        )}
      </ul>
      <form {...form.props} className="flex">
        {form.register("message", (fieldProps) => (
          <input
            {...fieldProps}
            placeholder="Type a message"
            className={classnames(
              "bg-gray-800 flex-1 mr-4 p-2 rounded outline-none border-4 border-gray-600 focus:border-blue-500",
              !form.fields.message.isValid && "border-red-500"
            )}
          />
        ))}

        <button
          className={classnames(
            "p-5 rounded",
            !form.isValid || form.isSubmitting
              ? "bg-gray-500 opacity-30"
              : "bg-blue-500"
          )}
          disabled={!form.isValid || form.isSubmitting}
        >
          Send
        </button>
      </form>
    </div>
  );
}
