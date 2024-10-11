import { useMemo, useRef, useCallback } from "react";

import { useDebounce } from "../useDebounce";

const MODES = {
  onBlur: { trigger: ["blur", "submit"], retrigger: [] },
  onChange: { trigger: ["change", "submit"], retrigger: [] },
  onSubmit: { trigger: ["submit"], retrigger: ["change"] },
  onTouched: { trigger: ["blur", "submit"], retrigger: ["change"] },
};

const DEFAULT_CONFIG = {
  mode: "onTouched",
  schema: {},
  defaultValues: {},
  onSubmitValidationError: () => {},
  onSanitize: (value) => value,
};

export const useForm = (config) => {
  const results = useRef({});
  const fields = useRef({});
  const props = useRef({});
  const values = useRef({});
  const errors = useRef({});
  const schema = useRef({});

  const _config = useMemo(() => {
    const value = { ...DEFAULT_CONFIG, ...config };
    schema.current = value.schema;
    return value;
  }, [config]);

  const mode = MODES[_config.mode];

  const form = useRef({
    isDirty: false,
    isTouched: false,
    isValid: true,
    isValidating: false,
    isSubmitting: false,
    isSubmitted: false,
  });

  const [state, setState] = useDebounce(
    {
      ...form.current,
      errors: errors.current,
      values: values.current,
      fields: fields.current,
    },
    10
  );

  const forceRender = useCallback(() => {
    setState({
      ...form.current,
      errors: errors.current,
      values: values.current,
      fields: fields.current,
    });
  }, [setState]);

  // Keep track of last time validate was called so we can ignore out of date results
  const validateTimes = useRef({
    // Last time any validation was called
    __any: Date.now(),
    // Individual field timestamps will go in here
  });

  const validate = useCallback(
    (names, type) => {
      console.log("VALIDATE 1", names, type);
      const ts = (validateTimes.current.__any = Date.now());

      form.current.isValidating = true;
      forceRender();

      return Promise.all(
        names.map((name) => {
          console.log("VALIDATE 2", name, type);

          validateTimes.current[name] = ts;

          const isActive = () => ts === validateTimes.current[name];

          return Promise.resolve(
            schema.current[name]
              ? schema.current[name].validate(values.current[name])
              : null
          )
            .then(() => isActive() && delete results.current[name])
            .catch(
              (err) => isActive() && (results.current[name] = err.errors[0])
            )
            .then(() => {
              if (!isActive()) {
                console.log("VALIDATE 3", name, type);

                return;
              }

              console.log("VALIDATE 4", name, type);

              // Update field and errors if we're not registering a new field
              if (type !== "register") {
                const error = results.current[name];

                console.log("VALIDATE 5", name, type, error);

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

              console.log("VALIDATE 6", name, type);
            });
        })
      ).then(() => {
        if (validateTimes.current.__any === ts) {
          form.current.isValidating = false;
          forceRender();
        }
      });
    },
    [forceRender]
  );

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
        values.current[name] = _config.onSanitize(_config.defaultValues[name]);

        validate([name], "register");

        // Create the return props
        props.current[name] = {
          name,
          //defaultValue: values.current[name],
          value: values.current[name],
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

            if (value !== values.current[name]) {
              // Update the value
              values.current[name] = _config.onSanitize(value);
              // Field and form are dirty
              fields.current[name].isDirty = true;
              form.current.isDirty = true;

              // Wrap in set timeout in case previous validation is still running
              setTimeout(() => {
                // Validate field if mode matches or force render now
                mode.trigger.includes("change") ||
                (fields.current[name].isValidated &&
                  mode.retrigger.includes("change"))
                  ? validate([name], "change")
                  : forceRender();
              });
            } else {
              console.log("ignore change", name);
            }
          },
        };
      }

      props.current[name].value = values.current[name];

      if (cb) {
        return cb(props.current[name]);
      } else {
        return props.current[name];
      }
    },
    [_config.defaultValues, validate, forceRender, mode]
  );

  const onSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    form.current.isSubmitting = true;
    forceRender();

    // Validate all fields
    return validate(Object.keys(fields.current), "submit").then(() => {
      // If form is valid...
      if (form.current.isValid) {
        // ... submit it

        return Promise.resolve(_config.onSubmit(values.current)).finally(() => {
          form.current.isSubmitting = false;
          form.current.isSubmitted = true;
          forceRender();
          return Promise.resolve();
        });
      } else {
        form.current.isSubmitting = false;
        forceRender();
        _config.onSubmitValidationError(errors.current);
      }
    });
  };

  const reset = useCallback(() => {
    results.current = {};
    fields.current = {};
    props.current = {};
    values.current = {};
    errors.current = {};

    form.current = {
      isDirty: false,
      isTouched: false,
      isValid: true,
      isValidating: false,
      isSubmitting: false,
    };

    forceRender();
  }, [forceRender]);

  const registerIfFieldMissing = useCallback(
    (name) => {
      // Fields must be registered before setValue/setValues can update them
      // Subsequent calls to register the field during a render will still work
      !fields[name] && register(name);
    },
    [register]
  );

  const setValue = useCallback(
    (name, value) => {
      registerIfFieldMissing(name);
      values.current[name] = _config.onSanitize(value);
      validate([name], "change");
    },
    [validate, registerIfFieldMissing]
  );

  const setValues = useCallback(
    (v) => {
      Object.keys(v).forEach(registerIfFieldMissing);
      const sanitizedValues = _config.onSanitize(v);
      values.current = { ...values.current, ...sanitizedValues };
      validate(Object.keys(v), "change");
    },
    [validate, registerIfFieldMissing]
  );

  const validateAll = useCallback(() => {
    validate(Object.keys(values.current), "manual");
  }, [validate]);

  return {
    props: {
      noValidate: true,
      onSubmit,
    },
    validate: validateAll,
    register,
    submit: onSubmit,
    reset,
    setValue,
    setValues,
    defaultValues: _config.defaultValues,
    ...state,
  };
};

// Allow onSanitize to be a dependancy in setValue, setValues and onChange
