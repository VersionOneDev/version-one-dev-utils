/** Accepts a string or props object. **/
export const TestId = (props = "") => {
  const component = typeof props === "string" ? props : props[TestId.attribute];
  return (element, key) => {
    const testId = [component, element, key]
      .filter((v) => v !== undefined)
      .join(TestId.delimiter);

    return {
      [TestId.attribute]: testId,
    };
  };
};

TestId.attribute = "data-testid";
TestId.delimiter = "/";
