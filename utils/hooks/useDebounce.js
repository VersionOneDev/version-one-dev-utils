import React, { useCallback, useRef, useState } from "react";

export const useDebounce = (initialValue, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  const timeout = useRef();

  const setter = useCallback(
    (value) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(setDebouncedValue, delay, value);
    },
    [setDebouncedValue, delay]
  );

  React.useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, []);

  return [debouncedValue, setter];
};
