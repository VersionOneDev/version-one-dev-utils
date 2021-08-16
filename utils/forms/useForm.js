import { useMemo, useRef, useCallback } from "react";

import { useDebounce } from "../hooks/useDebounce";

const MODES = {
  onBlur: { trigger: ["blur", "submit"], retrigger: [] },
  onChange: { trigger: ["change", "submit"], retrigger: [] },
  onSubmit: { trigger: ["change"], retrigger: ["change"] },
  onTouched: { trigger: ["blur", "submit"], retrigger: ["change"] },
};

const DEFAULT_CONFIG = {
  mode: "onTouched",
  schema: {},
  defaultValues: {},
};

export const useForm = (config) => {
  const _config = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const mode = MODES[_config.mode];

  const results = useRef({});
  const fields = useRef({});
  const props = useRef({});
  const values = useRef({});
  const errors = useRef({});

  const form = useRef({
    isDirty: false,
    isTouched: false,
    isValid: true,
    isValidating: false,
    isSubmitting: false,
    submitCount: 0,
  });

  const [value, setValue] = useDebounce(
    {
      form: form.current,
      errors: errors.current,
      values: values.current,
      fields: fields.current,
    },
    100
  );

  const forceRender = () => {
    setValue({
      form: form.current,
      errors: errors.current,
      values: values.current,
      fields: fields.current,
    });
  };

  const register = useCallback(
    (name, cb) => {
      if (!fields.current[name]) {
        // Add field state
        fields.current[name] = {
          isDirty: false,
          isTouched: false,
          isValid: true,
        };

        // Add default value
        values.current[name] = _config.defaultValues[name];

        validate([name], "register");

        // Create the return props
        props.current[name] = {
          name,
          defaultValue: values.current[name],
          onBlur: (e) => {
            // Field and form have been touched
            fields.current[name].isTouched = true;
            form.current.isTouched = true;

            // Validate field if mode matches or force render now
            mode.trigger.includes("blur")
              ? validate([name], "blur")
              : forceRender();
          },
          onChange: (arg) => {
            const isReactEvent = arg && !!arg.nativeEvent;

            // Assume argument is the value...
            let value = arg;

            // ...but if argument is a react synthetic event pull the value from the HTML input instead
            if (isReactEvent) {
              const target = arg.target;

              value =
                target.type === "radio" || target.type === "checkbox"
                  ? target.checked
                  : target.value;
            }

            // Update the value
            values.current[name] = value;
            // Field and form are dirty
            fields.current[name].isDirty = true;
            form.current.isDirty = true;

            // Validate field if mode matches or force render now
            mode.trigger.includes("change") ||
            (fields.current[name].isValidated &&
              mode.retrigger.includes("change"))
              ? validate([name], "change")
              : forceRender();
          },
        };
      }

      if (cb) {
        props.current[name].value = values.current[name];
        return cb(props.current[name]);
      } else {
        return props.current[name];
      }
    },
    [_config.defaultValues]
  );

  const validate = (names, type) => {
    form.current.isValidating = true;
    forceRender();

    return Promise.all(
      names.map((name) => {
        return Promise.resolve(
          _config.schema[name]
            ? _config.schema[name].validate(values.current[name])
            : null
        )
          .then(() => delete results.current[name])
          .catch((err) => (results.current[name] = err.errors[0]))
          .then(() => {
            // Update field and errors if we're not registering a new field
            if (type !== "register") {
              const error = results.current[name];

              // Update field
              fields.current[name].isValidated = true;
              fields.current[name].isValid = !error;

              // Update errors
              if (error) {
                errors.current[name] = error;
              } else {
                delete errors.current[name];
              }
            }

            // Update form
            form.current.isValid = !Object.keys(results.current).length;

            forceRender();
          });
      })
    ).then(() => {
      form.current.isValidating = false;
      forceRender();
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    validate(Object.keys(fields.current), e.type).then(() => {
      // If form is valid...
      if (form.current.isValid) {
        // ... submit it
        form.current.isSubmitting = true;
        forceRender();

        Promise.resolve(_config.onSubmit(values.current)).then(() => {
          form.current.submitCount++;
          form.current.isSubmitting = false;
          forceRender();
        });
      }
    });
  };

  return {
    formProps: {
      noValidate: true,
      onSubmit,
    },
    register,
    ...value,
  };
};
