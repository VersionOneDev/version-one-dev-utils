import PropTypes from "prop-types";

export const TestId = (props = {}) => {
  const component = props[TestId.attribute];
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

TestId.getDefaultProps = () => ({ [TestId.attribute]: "" });
TestId.getPropTypes = () => ({ [TestId.attribute]: PropTypes.string });
