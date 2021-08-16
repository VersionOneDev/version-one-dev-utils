import React from "react";
import * as yup from "yup";
import { useForm } from "version-one-dev-utils";

import PropTypes from "prop-types";

function CustomInput(props) {
  console.log("CustomInput", props);
  return (
    <button type="button" onClick={() => props.onClick(props.defaultValue + 1)}>
      Custom Input
    </button>
  );
}

CustomInput.propTypes = {
  defaultValue: PropTypes.number,
  onClick: PropTypes.func,
};

export function Form(props) {
  const { formProps, form, register, reset, fields, errors, values } = useForm({
    mode: "onTouched",
    schema: {
      email: yup
        .string()
        .required()
        .email("Please enter a valid email address"),
      password: yup.string().required().min(2, "Min 2 chars please"),
      remember: yup.bool().required(),
      custom: yup.string().required(),
    },
    defaultValues: {
      password: "password",
      custom: 100,
    },
    onSubmit: (values) =>
      new Promise((r) =>
        setTimeout(() => {
          console.log("onSubmit", values);
          reset();
          r();
        }, 2000)
      ),
  });

  return (
    <form {...formProps}>
      <div style={{ marginBottom: 20 }}>
        <input
          {...register("email")}
          type="email"
          placeholder="Email"
          style={{
            border: "1px solid",
            borderColor: !fields.email.isValid ? "red" : "blue",
            outline: "none",
          }}
        />
        {errors.email}
      </div>
      <div style={{ marginBottom: 20 }}>
        <input
          {...register("password")}
          type="password"
          placeholder="Password"
          style={{
            border: "1px solid",
            borderColor: !fields.password.isValid ? "red" : "blue",
            outline: "none",
          }}
        />
        {errors.password}
      </div>
      <div style={{ marginBottom: 20 }}>
        <input
          {...register("remember")}
          type="checkbox"
          placeholder="Remember me"
        />
        <label>Remember me</label>
        {errors.remember}
      </div>
      <div style={{ marginBottom: 20 }}>
        <CustomInput
          {...register("custom", (field) => {
            console.log("field value", field.value);
            return {
              defaultValue: field.value,
              onClick: (value) => {
                field.onBlur();
                field.onChange(value);
              },
            };
          })}
        />
      </div>
      <button disabled={form.isSubmitting}>Login</button>
      <button type="reset" onClick={reset}>
        Reset
      </button>
      <br />
      <br />
      <b>FORM:</b> {JSON.stringify(form)}
      <br />
      <br />
      <b>FIELDS:</b> {JSON.stringify(fields)}
      <br />
      <br />
      <b> VALUES:</b> {JSON.stringify(values)}
      <br />
      <br />
      <b>ERRORS:</b> {JSON.stringify(errors)}
    </form>
  );
}
