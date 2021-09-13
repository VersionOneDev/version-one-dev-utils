const delimiter = "/";

export const TestId = (props = {}) => {
  const component = props["data-testid"];
  return (element, key) => {
    const testId = [component, element, key]
      .filter((v) => v !== undefined)
      .join(delimiter);

    return {
      "data-testid": testId,
    };
  };
};
