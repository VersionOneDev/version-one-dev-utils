import React from "react";
import * as yup from "yup";
import { setLocale } from "yup";
import PropTypes from "prop-types";
import DatePicker from "react-date-picker";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useForm } from "version-one-dev-utils";

const abilities = ["power", "health", "mobility", "technique", "range"];
const mockFetch = async (cb) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  cb();
};

const FormGroup = (props) => {
  const { label, errors, type, render, ...fieldProps } = props;
  return (
    <div className="mb-4 p-2 bg-gray-100">
      <label className="font-bold block">{label}</label>
      {render ? (
        render()
      ) : (
        <input type={type} className="my-1 rounded p-1" {...fieldProps} />
      )}
      <div className="text-red-800" style={{ minHeight: 24 }}>
        {errors}
      </div>
    </div>
  );
};
FormGroup.propTypes = {
  "data-testId": PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.string,
  type: PropTypes.string,
  render: PropTypes.func,
  fieldProps: PropTypes.shape({
    name: PropTypes.any,
    value: PropTypes.any,
    onBlue: PropTypes.func,
    onChange: PropTypes.func,
  }),
};

const today = new Date();

export default function StreetFighterForm() {
  setLocale({
    number: {
      min: "You fool! Value must be more than ${min}",
    },
  });
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      releaseDate: today,
      color: "#DD3A3A",
    },
    schema: {
      name: yup
        .string()
        .required("Please add a name")
        .max(10, "That is to long!"),
      dob: yup
        .date()
        .required("Please enter a date of birth")
        .min(
          new Date("September 9, 1995 "),
          "Must be at least sixteen years old"
        ),
      season: yup.number().required().min(5),
      releaseDate: yup
        .date()
        .required("Please enter a date")
        .min(new Date(), "Release date must be in future"),
      firstTournament: yup
        .date()
        .required("Please enter a date")
        .min(new Date(), "Tournament date must be in future"),
      speciality: yup
        .string()
        .required()
        .test("custom", "Not one of the 5 abilities!", (value) =>
          abilities.includes(value.toLowerCase())
        ),
      color: yup.string().required("They must have a primary color!"),
    },

    onSubmit: (values) => mockFetch(() => console.log(values)),
  });

  return (
    <form {...form.props}>
      <h2 className="mb-10 font-bold text-2xl">Create new character</h2>
      {form.register("name", (fieldProps) => (
        <FormGroup label={"Name"} errors={form.errors.name} {...fieldProps} />
      ))}
      <button
        onClick={() => form.setValue("name", "Clive")}
        className="p-2 mb-8 bg-purple-100 font-bold rounded text-xs"
      >
        Create a name for me
      </button>
      {form.register("dob", (fieldProps) => (
        <FormGroup
          label={"Date of birth (browser date picker)"}
          errors={form.errors.dob}
          type="date"
          {...fieldProps}
        />
      ))}
      {form.register("season", (fieldProps) => (
        <FormGroup
          label={"Season release (number input)"}
          errors={form.errors.season}
          type="number"
          {...fieldProps}
        />
      ))}
      {form.register("releaseDate", (fieldProps) => (
        <FormGroup
          label={"Release date (react-date-picker)"}
          errors={form.errors.releaseDate}
          render={() => (
            <DatePicker
              className="my-1 rounded p-1"
              onChange={() => console.log("hit")}
              {...fieldProps}
            />
          )}
        />
      ))}
      {form.register("firstTournament", (fieldProps) => (
        <FormGroup
          label={"First top 8 tournament appearance (react-datepicker)"}
          errors={form.errors.firstTournament}
          render={() => (
            <ReactDatePicker
              className="my-1 rounded p-1"
              onChange={() => null}
              selected={fieldProps.value}
              {...fieldProps}
            />
          )}
        />
      ))}
      {form.register("speciality", (fieldProps) => (
        <FormGroup
          label={"Speciality (oneof validation)"}
          errors={form.errors.speciality}
          {...fieldProps}
        />
      ))}
      {form.register("color", (fieldProps) => (
        <FormGroup
          label={"Primary color (browser color picker)"}
          type="color"
          errors={form.errors.color}
          {...fieldProps}
        />
      ))}
      {form.isSubmitting && <p>Submitting...</p>}
      <button type="button" className="p-2 bg-blue-400 font-bold rounded">
        No submit
      </button>

      <button className="p-2 bg-blue-400 font-bold rounded">Submit</button>
    </form>
  );
}
