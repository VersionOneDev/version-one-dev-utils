const delimiter = "/";
const attribute = "data-testid"

export const TestId = (props = {}) => {
  const component = props[attribute];
  return (element, key) => {
    const testId = [component, element, key]
      .filter((v) => v !== undefined)
      .join(delimiter);

    return {
      [attribute]: testId,
    };
  };
};
