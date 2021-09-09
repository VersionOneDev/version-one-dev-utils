import React from "react";
import * as yup from "yup";

import { useForm } from "version-one-dev-utils";

export default function ExampleForm() {
  const form = useForm({
    mode: "onChange",
    schema: {
      name: yup
        .string()
        .required("Please add a name")
        .max(10, "That is to long!"),
      age: yup.number().required().min(16),
    },

    onSubmit: (values) => console.log(values),
  });

  return (
    <form {...form.props}>
      {form.register("name", (fieldProps) => (
        <div>
          <input />
          <span>{form.errors.name}</span>
        </div>
      ))}

      <button disabled={form.isSubmitting || form.errors}>Submit</button>
    </form>
  );
}
