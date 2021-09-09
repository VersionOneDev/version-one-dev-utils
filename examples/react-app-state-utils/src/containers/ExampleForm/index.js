import React from "react";
import * as yup from "yup";
import { useForm } from "version-one-dev-utils";

export default function ExampleForm() {
  const form = useForm({
    mode: "onBlur",
    schema: {
      name: yup.string().required("Please add your name"),
      age: yup
        .number()
        .required("Please enter your age")
        .min(18, "Must be an adult"),
      mathsQuestion: yup
        .string()
        .required("Have a go")
        .test(
          "Two plus two validation",
          "Wrong answer",
          (value) => value === 4
        ),
    },

    onSubmit: (values) => console.log(values),
  });

  return (
    <form {...form.props}>
      <label>Enter your name</label>
      {form.register("name", (fieldProps) => (
        <input {...fieldProps} />
      ))}
      <span>{form.errors.name}</span>

      <button type="button" onClick={() => form.setValue("name", "Clive")}>
        Choose a name for me
      </button>

      <label>Enter your name</label>
      {form.register("age", (fieldProps) => (
        <input {...fieldProps} />
      ))}
      <span>{form.errors.age}</span>

      <label>What is 2 + 2 ?</label>
      {form.register("question", (fieldProps) => (
        <input {...fieldProps} />
      ))}
      <span>{form.errors.mathsQuestion}</span>

      <button disabled={form.isSubmitting || form.errors}>Submit</button>
    </form>
  );
}
