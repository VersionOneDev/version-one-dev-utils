import React from "react";
import { useForm } from "version-one-dev-utils/forms";
import * as yup from "yup";
import PropTypes from "prop-types";
// import classnames from "classnames";
// yup.addMethod(yup.string, "letter", function () {
//   return;
// });

export function Login(props) {
  const form = useForm({
    onSubmit: (values) => console.log("Form submitted with values:", values),
    schema: {
      firstName: yup
        .string()
        .required("Please enter your first name")
        .min(2, "First name must be two or more characters"),
      surname: yup
        .string()
        .required("Please enter your surname")
        .min(2, "First name must be two or more characters"),
      email: yup
        .string()
        .required("Please enter your email")
        .email("Invalid email"),
      password: yup
        .string()
        .required("Please enter your password")
        .min(3, "Password must be more than three characters"),
      age: yup
        .number()
        .min(18, "Must be at least 18 years old")
        .required("Please enter your age"),
    },
  });

  return (
    <form {...form.props}>
      <p>First Name</p>
      {form.register("firstName", (fieldProps) => (
        <input
          {...fieldProps}
          className="text-black"
          placeholder="Enter first name"
          value={props.firstName}
        />
      ))}
      <span className={form.isValid ? "text-green-500" : "text-red-500"}>
        {form.isValid ? "Valid" : form.errors.firstName}
      </span>
      <br />
      <p>Surname</p>
      {form.register("surname", (fieldProps) => (
        <input
          {...fieldProps}
          className="text-black"
          placeholder="Enter surname"
          value={props.surname}
        />
      ))}
      <span className="text-red-500">{form.errors.surname}</span>
      <br />
      <p>Age</p>
      {form.register("age", (fieldProps) => (
        <input {...fieldProps} className="text-black" placeholder="Enter age" />
      ))}
      <span className="text-red-500">{form.errors.age}</span>
      <br />
      <p>Email</p>
      {form.register("email", (fieldProps) => (
        <input
          {...fieldProps}
          className="text-black"
          placeholder="Enter email address"
        />
      ))}
      <span className="text-red-500">{form.errors.email}</span>
      <br />
      <p>Password</p>
      {form.register("password", (fieldProps) => (
        <input
          {...fieldProps}
          className="text-black"
          placeholder="Enter password"
        />
      ))}
      <span className="text-red-500">{form.errors.password}</span>
      <br />
      <button className={form.isValid ? "text-green-500" : "text-red-500"}>
        {(!form.isDirty ? "Enter Details" : "Complete Form") ||
          (form.isValid ? "All systems go" : "Check errors")}
      </button>
    </form>
  );
}

Login.propTypes = {
  firstName: PropTypes.string,
  surname: PropTypes.string,
};
