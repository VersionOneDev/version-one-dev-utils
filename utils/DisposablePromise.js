const STATE = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
};

function isThenable(val) {
  return val instanceof DisposablePromise;
}

export class DisposablePromise {
  constructor(callback) {
    this.toString = this.toString.bind(this);

    this.state = STATE.PENDING;
    this.value = undefined;
    this.handlers = [];
    try {
      this._disposer = callback(this._resolve, this._reject);
    } catch (err) {
      this._reject(err);
    }

    const cancelFn = () => {
      this.state = STATE.CANCELLED;
      this._disposer && this._disposer();
    };

    cancelFn.then = this.then.bind(this);
    cancelFn.catch = this.catch.bind(this);
    cancelFn.finally = this.finally.bind(this);

    return cancelFn;
  }

  _resolve = (value) => {
    this.updateResult(value, STATE.FULFILLED);
  };

  _reject = (error) => {
    this.updateResult(error, STATE.REJECTED);
  };

  updateResult(value, state) {
    // This is to make the processing async
    //setTimeout(() => {
    // process the promise if it is still in pending state
    if (this.state !== STATE.PENDING) {
      return;
    }

    // check is value is also a promise
    if (isThenable(value)) {
      return value.then(this._resolve, this._reject);
    }

    this.value = value;
    this.state = state;

    // execute handlers if already attached
    this.executeHandlers();
    //}, 0);
  }

  addHandlers(handlers) {
    this.handlers.push(handlers);
    this.executeHandlers();
  }

  executeHandlers() {
    // Don't execute handlers if promise is not yet fulfilled or rejected
    if (this.state === STATE.PENDING || this.state === STATE.CANCELLED) {
      return null;
    }

    // We have multiple handlers because add them for .finally block too
    this.handlers.forEach((handler) => {
      if (this.state === STATE.FULFILLED) {
        return handler.onSuccess(this.value);
      }
      return handler.onFail(this.value);
    });
    // After processing all handlers, we reset it to empty.
    this.handlers = [];
  }

  then(onSuccess, onFail) {
    return new DisposablePromise((res, rej) => {
      this.addHandlers({
        onSuccess: function (value) {
          // if no onSuccess provided, resolve the value for the next promise chain
          if (!onSuccess) {
            return res(value);
          }
          try {
            return res(onSuccess(value));
          } catch (err) {
            return rej(err);
          }
        },
        onFail: function (value) {
          // if no onFail provided, reject the value for the next promise chain
          if (!onFail) {
            return rej(value);
          }
          try {
            return res(onFail(value));
          } catch (err) {
            return rej(err);
          }
        },
      });
    });
  }

  // Since then method take the second function as onFail, we can leverage it while implementing catch
  catch(onFail) {
    return this.then(null, onFail);
  }

  // Finally block returns a promise which fails or succeedes with the previous promise resove value
  finally(callback) {
    return new DisposablePromise((res, rej) => {
      let val;
      let wasRejected;
      this.then(
        (value) => {
          wasRejected = false;
          val = value;
          return callback();
        },
        (err) => {
          wasRejected = true;
          val = err;
          return callback();
        }
      ).then(() => {
        // If the callback didn't have any error we resolve/reject the promise based on promise state
        if (!wasRejected) {
          return res(val);
        }
        return rej(val);
      });
    });
  }
}
