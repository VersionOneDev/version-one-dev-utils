const addPromiseMethod = (scope, name) => {
  return (callback) => {
    scope.promise = scope.promise[name]((value) => {
      if (!scope.destroyed) {
        return callback(value);
      }
    });
    return scope.api;
  };
};

export class DisposablePromise {
  constructor(resolver) {
    this.destroyed = false;

    this.promise = new Promise((resolve, reject) => {
      this.disposer = resolver(resolve, reject);
    });

    this.api = () => {
      this.destroyed = true;
      return this.disposer && this.disposer();
    };

    this.api.then = addPromiseMethod(this, "then");
    this.api.catch = addPromiseMethod(this, "catch");
    this.api.finally = addPromiseMethod(this, "finally");

    return this.api;
  }
}
