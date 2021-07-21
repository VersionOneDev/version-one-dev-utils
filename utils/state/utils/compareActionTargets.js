const delimiter = "/";

const splitValue = (value) => {
  value = value.toString();
  // If the value does not contain the delimiter it should be a key so add wildcards
  return !value.includes(delimiter)
    ? ["*", "*", value]
    : value.split(delimiter);
};

export const compareActionTargets = (a, b) => {
  const splitA = splitValue(a);
  const splitB = splitValue(b);
  const length = Math.min(splitA.length, splitB.length);

  for (let i = 0; i < length; i++) {
    if (splitA[i] !== splitB[i] && splitA[i] !== "*" && splitB[i] !== "*") {
      // No match so early return
      return false;
    }
  }

  return true;
};
