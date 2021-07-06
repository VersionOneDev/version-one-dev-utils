export const compareActionTargets = (a, b) => {
  const splitA = a.toString().split("/");
  const splitB = b.toString().split("/");
  const length = Math.min(splitA.length, splitB.length);

  for (let i = 0; i < length; i++) {
    if (splitA[i] !== splitB[i] && splitA[i] !== "*" && splitB[i] !== "*") {
      // No match so early return
      return false;
    }
  }

  return true;
};
