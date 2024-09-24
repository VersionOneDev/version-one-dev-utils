import React from "react";
import * as yup from "yup";
import classnames from "classnames";

import { useForm } from "version-one-dev-utils/forms";

import { ItemStore } from "../../stores/ItemStore";

export function AddTodo(props) {
  const form = useForm({
    mode: "onChange",
    schema: {
      title: yup.string().required("Please add a todo"),
    },
    defaultValues: {
      title: "",
    },
    onSubmit: (values) => ItemStore.actions.add(values).then(form.reset),
  });

  return (
    <form {...form.props} className="flex">
      {form.register("title", (fieldProps) => (
        <input
          {...fieldProps}
          placeholder="Add todo"
          className={classnames(
            "bg-gray-800 flex-1 mr-5 p-5 rounded outline-none border-4 border-gray-600 focus:border-blue-500",
            !form.fields.title.isValid && "border-red-500"
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
        Add
      </button>
    </form>
  );
}
