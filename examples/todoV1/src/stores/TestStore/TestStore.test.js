import merge from "deepmerge";

import { TestStore } from "./TestStore";

const wait = async (delay) => await new Promise((r) => setTimeout(r, delay));

// Helpers
const createActionObject = (type, props, payload) => ({
  type,
  payload,
  meta: { key: undefined, props },
  error: undefined,
});

describe("initial state", () => {
  it("Has initial state", () => {
    expect(TestStore.getState()).toEqual(TestStore.initialState);
  });
});

describe("sync", () => {
  const props = { value: "Sync Example" };

  it("Returns a promise that resolves with action object", async () => {
    expect(await TestStore.actions.sync(props)).toEqual(
      createActionObject("TestStore/sync", props, props)
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual(props);
  });
});

describe("async", () => {
  const props = { value: "Async Example" };

  it("Returns a promise that resolves with action object", async () => {
    expect(await TestStore.actions.async(props)).toEqual(
      createActionObject("TestStore/async", props, props)
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual(props);
  });
});

describe("callback", () => {
  const props = { value: "Callback Example" };
  const payload = { value: props.value, numCallbacks: 1 };
  let unsubscribe;
  let result;

  it("Returns a promise that resolves with action object", async () => {
    unsubscribe = TestStore.actions.callback(props);
    result = await unsubscribe;

    expect(result).toEqual(
      createActionObject("TestStore/callback", props, payload)
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual(payload);
  });

  it("Updates state on second callback", async () => {
    await wait(5);
    expect(TestStore.getState()).toEqual(merge(payload, { numCallbacks: 2 }));
  });

  it("Fires unsubscribe callback and stops ", () => {
    expect(unsubscribe()).toEqual("unsubscribed");
  });

  it("Has stopped updating", async () => {
    await wait(5);
    expect(TestStore.getState()).toEqual(merge(payload, { numCallbacks: 2 }));
  });
});

describe("cached sync", () => {
  const props = { value: "Cached Sync Example" };

  let result;

  it("Returns a promise that resolves with action object", async () => {
    result = await TestStore.actions.cachedSync(props);
    expect(result).toEqual(
      createActionObject("TestStore/cachedSync", props, {
        value: props.value + "1",
      })
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual({ value: props.value + "1" });
  });

  it("Returns the same action object when action is cached", async () => {
    const newRes = await TestStore.actions.cachedSync(props);
    expect(newRes).toEqual(result);
  });

  it("Does not return the same action object when the cache is expired", async () => {
    await wait(100);
    const newRes = await TestStore.actions.cachedSync(props);
    expect(newRes).not.toEqual(result);
  });
});

describe("cached async", () => {
  const props = { value: "Cached Async Example" };

  let result;

  it("Returns a promise that resolves with action object", async () => {
    result = await TestStore.actions.cachedAsync(props);
    expect(result).toEqual(
      createActionObject("TestStore/cachedAsync", props, {
        value: props.value + "1",
      })
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual({ value: props.value + "1" });
  });

  it("Returns the same action object when action is cached", async () => {
    const newRes = await TestStore.actions.cachedAsync(props);
    expect(newRes).toEqual(result);
  });

  it("Does not return the same action object when the cache is expired", async () => {
    await wait(100);
    const newRes = await TestStore.actions.cachedAsync(props);
    expect(newRes).not.toEqual(result);
  });
});

describe("cached callback", () => {
  const props = { value: "Cached Callback Example" };
  const payload = { value: props.value + "1", numCallbacks: 1 };

  let unsubscribe;
  let result, secondResult;

  it("Returns a promise that resolves with action object", async () => {
    result = await TestStore.actions.cachedCallback(props);

    expect(result).toEqual(
      createActionObject("TestStore/cachedCallback", props, payload)
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual(payload);
  });

  it("Returns the same action object when action is cached", async () => {
    const newRes = await TestStore.actions.cachedCallback(props);
    expect(newRes).toEqual(result);
  });

  it("Updates state on second callback", async () => {
    await wait(5);
    expect(TestStore.getState()).toEqual(merge(payload, { numCallbacks: 2 }));
  });

  it("Returns the second value when reading from cache", async () => {
    expect(await TestStore.actions.cachedCallback(props)).toEqual(
      createActionObject(
        "TestStore/cachedCallback",
        props,
        merge(payload, { numCallbacks: 2 })
      )
    );
  });

  it("Does not return the same action object when the cache is expired", async () => {
    await wait(100);
    unsubscribe = TestStore.actions.cachedCallback(props);
    secondResult = await unsubscribe;
    expect(secondResult).not.toEqual(result);
  });

  it("Updates state with new value", () => {
    expect(TestStore.getState()).toEqual({
      value: props.value + "2",
      numCallbacks: 1,
    });
  });

  it("Updates state with new value on second callback", async () => {
    await wait(5);
    expect(TestStore.getState()).toEqual({
      value: props.value + "2",
      numCallbacks: 2,
    });
  });

  it("Fires unsubscribe callback and stops ", () => {
    expect(unsubscribe()).toEqual("unsubscribed");
  });

  it("Has stopped updating", async () => {
    await wait(5);
    expect(TestStore.getState()).toEqual({
      value: props.value + "2",
      numCallbacks: 2,
    });
  });
});

describe("Set cache values manually", () => {
  const props = { value: "none" };
  let result;

  it("Returns a promise that resolves with action object", async () => {
    await TestStore.actions.getCachedValue(props);
    await TestStore.actions.setCachedValue(props);
    result = await TestStore.actions.getCachedValue(props);

    expect(result).toEqual(
      createActionObject("TestStore/getCachedValue", props, {
        value: "setCachedValue",
      })
    );
  });

  it("Updates state", () => {
    expect(TestStore.getState()).toEqual({ value: "setCachedValue" });
  });
});

/**
 * CACHE TESTS - Move these to somewhere rather than exposing the cache object in the TestStore?
 */

describe("Clearing the cache", () => {
  it("Is empty by default", () => {
    TestStore.cache.removeAll();
    expect(TestStore.cache.items).toEqual({});
  });

  it("Is emptied when a single item is removed", () => {
    const props = { value: "Cached Callback Example" };

    TestStore.actions.cachedCallback(props);
    TestStore.cache.remove("cachedCallback", props);
    expect(TestStore.cache.items).toEqual({});
  });

  it("Is emptied when all items are removed", () => {
    TestStore.actions.cachedSync({ value: "Cached Sync Example" });
    TestStore.actions.cachedAsync({ value: "Cached Async Example" });
    TestStore.actions.cachedCallback({ value: "Cached Callback Example" });
    TestStore.cache.removeAll();
    expect(TestStore.cache.items).toEqual({});
  });
});
