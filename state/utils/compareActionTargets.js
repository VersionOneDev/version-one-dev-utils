const delimiter = "/";

/*const splitValue = (value) => {
  value = value.toString();
  // If the value does not contain the delimiter it should be a key so add wildcards
  return !value.includes(delimiter)
    ? ["*", "*", value]
    : value.split(delimiter);
};*/

/*export const compareActionTargets = (a, b) => {
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
};*/

export const compareActionTargets = (action, target = "*") => {
  let splitTarget;

  console.error("target", target);
  if (target.includes(delimiter)) {
    // Split
    splitTarget = target.split(delimiter);
  } else {
    // Target is a key
    splitTarget = ["*", "*", target];
  }

  const splitAction = action.split(delimiter);

  const t = [
    splitTarget[0] || "*",
    splitTarget[1] || "*",
    splitTarget[2] || "*",
  ];
  const a = [
    splitAction[0] || "*",
    splitAction[1] || "*",
    splitAction[2] || "*",
  ];

  for (let i = 0; i < t.length; i++) {
    if (t[i] !== a[i] && t[i] !== "*") {
      // No match so early return
      return false;
    }
  }

  return true;
};
