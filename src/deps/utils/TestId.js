/** Accepts a string or props object. **/
export const TestId = (props = "") => {
  const component = props[TestId.attribute];
  return (element, key) => {
    const testId = [
      component,
      element && component ? TestId.elementDelimiter + element : element,
      key ? TestId.keyDelimiter + key : undefined,
    ]
      .filter((v) => v !== undefined)
      .join("");

    if (testId) {
      return {
        [TestId.attribute]: testId,
      };
    } else {
      return {};
    }
  };
};

TestId.attribute = "data-testid";
TestId.elementDelimiter = "/";
TestId.keyDelimiter = "-";
