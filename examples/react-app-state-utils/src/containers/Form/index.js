import React from "react";
import * as yup from "yup";

import Select from "react-select";

import { useForm } from "version-one-dev-utils";

import PropTypes from "prop-types";

const colorOptions = [
  { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
  { value: "blue", label: "Blue", color: "#0052CC", isDisabled: true },
  { value: "purple", label: "Purple", color: "#5243AA" },
  { value: "red", label: "Red", color: "#FF5630", isFixed: true },
  { value: "orange", label: "Orange", color: "#FF8B00" },
  { value: "yellow", label: "Yellow", color: "#FFC400" },
  { value: "green", label: "Green", color: "#36B37E" },
  { value: "forest", label: "Forest", color: "#00875A" },
  { value: "slate", label: "Slate", color: "#253858" },
  { value: "silver", label: "Silver", color: "#666666" },
];

function CustomInput(props) {
  console.log("CustomInput", props);
  return (
    <>
      <button
        type="button"
        onClick={() => props.onClick(props.defaultValue + 1)}
      >
        Custom Input
      </button>
      {props.defaultValue}
    </>
  );
}

CustomInput.propTypes = {
  defaultValue: PropTypes.number,
  onClick: PropTypes.func,
};

export function Form(props) {
  const form = useForm({
    mode: "onTouched",
    schema: {
      email: yup
        .string()
        .required()
        .email("Please enter a valid email address"),
      password: yup.string().required().min(2, "Min 2 chars please"),
      remember: yup.bool().required(),
      custom: yup.string().required(),
      color: yup.array().required(),
    },
    defaultValues: {
      email: "",
      password: "password",
      remember: false,
      custom: 100,
      color: [],
    },
    onSubmit: (values) =>
      new Promise((r) =>
        setTimeout(() => {
          console.log("onSubmit", values);
          form.reset();
          r();
        }, 2000)
      ),
  });

  return (
    <form {...form.props}>
      <div style={{ marginBottom: 20 }}>
        {form.register("email", (field) => (
          <input
            {...field}
            type="email"
            placeholder="Email"
            style={{
              border: "1px solid",
              borderColor: !form.fields.email.isValid ? "red" : "blue",
              outline: "none",
            }}
          />
        ))}
        {form.errors.email}
      </div>
      <div style={{ marginBottom: 20 }}>
        {form.register("password", (field) => (
          <input
            {...field}
            type="password"
            placeholder="Password"
            style={{
              border: "1px solid",
              borderColor: !form.fields.password.isValid ? "red" : "blue",
              outline: "none",
            }}
          />
        ))}

        {form.errors.password}
      </div>
      <div style={{ marginBottom: 20 }}>
        {form.register("remember", (field) => (
          <input {...field} type="checkbox" placeholder="Remember me" />
        ))}
        <label>Remember me</label>
        {form.errors.remember}
      </div>
      <div style={{ marginBottom: 20 }}>
        {form.register("custom", (field) => (
          <button
            type="button"
            onClick={() => {
              field.onBlur();
              field.onChange(field.value + 1);
            }}
          >
            Custom Input: {field.value}
          </button>
        ))}
      </div>
      <div style={{ marginBottom: 20 }}>
        {form.register("color", (field) => (
          <Select
            isMulti
            options={colorOptions}
            value={field.value?.map((i) => ({ value: i, label: i }))}
            onChange={(v) => field.onChange(v.map((i) => i.value))}
          />
        ))}
        {form.errors.color}
      </div>
      <button disabled={form.isSubmitting}>Login</button>
      <button type="reset" onClick={form.reset}>
        Reset
      </button>
      <button
        type="button"
        onClick={() => form.setValue("email", "a@example.com")}
      >
        Set custom value
      </button>
      <br />
      <br />
      <b>FORM:</b> {JSON.stringify(form.form)}
      <br />
      <br />
      <b>FIELDS:</b> {JSON.stringify(form.fields)}
      <br />
      <br />
      <b> VALUES:</b> {JSON.stringify(form.values)}
      <br />
      <br />
      <b>ERRORS:</b> {JSON.stringify(form.errors)}
    </form>
  );
}
