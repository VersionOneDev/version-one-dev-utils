declare module "version-one-dev-utils/state" {
  interface Action<Props, Payload> {
    type: string;
    meta: { props: Props; key: string };
    payload: Payload;
    error: Error;
  }

  interface ActionResponse<Payload> {
    payload: Payload;
    error: Error;
  }

  interface ActionPromise<Props, Payload>
    extends Promise<ActionResponse<Payload>>,
      Action<Props> {}

  const createAction: <Props = never, Payload = never, State = never>(
    fn: (props: Props) => Payload | Promise<Payload>
  ) => ((props?: Props, key?: string) => ActionPromise<Props, Payload>) & {
    pending?: (state: State, action: Action<Props, never>) => State;
    success?: (state: State, action: Action<Props, Payload>) => State;
    error?: (state: State, action: Action<Props, never>) => State;
  };

  const createCachedAction: <Props = never, Payload = never, State = never>(
    fn: (props: Props) => Payload | Promise<Payload>,
    lifespan?: number
  ) => ((props?: Props, key?: string) => ActionPromise<Props, Payload>) & {
    pending?: (state: State, action: Action<Props, never>) => State;
    success?: (state: State, action: Action<Props, Payload>) => State;
    error?: (state: State, action: Action<Props, never>) => State;
    setCache: (
      props: Props,
      payload?: Payload,
      lifespan?: number
    ) => Payload | void;
  };

  const createCallbackAction: <Props = never, Payload = never, State = never>(
    fn: (
      props: Props
    ) => (
      resolve: (payload?: Payload) => void,
      reject: (error?: unknown) => void
    ) => void
  ) => ((
    props?: Props,
    key?: string
  ) => ActionPromise<Props, Payload> & { unsubscribe: () => void }) & {
    pending?: (state: State, action: Action<Props, never>) => State;
    success?: (state: State, action: Action<Props, Payload>) => State;
    error?: (state: State, action: Action<Props, never>) => State;
  };

  const Store: {
    getState: () => unknown;
    add: (name: string, reducer: Function) => void;
    remove: (name: string) => void;
  };

  const ErrorStore: {
    actions: {
      clear: (target: string) => Promise;
    };
  };

  const usePending: () => {
    getPending: (...filters: any[]) => { type: string } | undefined;
  };

  const useErrors: () => {
    getPending: (...filters: any[]) => { type: string } | undefined;
    clearError: (target: string) => Promise;
  };

  const useSelector: <Result>(
    selector: () => Result,
    equalityFn?: (a: Result, b: Result) => boolean
  ) => Result;

  const createStore: <State, Actions, Select>(config: {
    name: string;
    initialState: State;
    actions: Actions;
    select?: Select;
    // Map props before each action is dispatched
    mapProps?: (props: unknown, type: string, key: string) => unknown;
  }) => {
    name: string;
    initialState: State;
    actions: Actions & { reset: () => {} };
    getState: () => State;
    select: Select;
    byKey: (key: string) => string;
    toString: () => string;
  };

  /**
   * Legacy
   */
  const createLegacyAction: any;
  const createLegacyCache: any;
  const createLegacyStore: any;
  const createLegacySyncAction: any;
  const createLegacyAsyncAction: any;
  const createLegacyCallbackAction: any;
  const useLegacySelector: any;

  export {
    Store,
    ErrorStore,
    usePending,
    useErrors,
    useSelector,
    createStore,
    createAction,
    createCachedAction,
    createCallbackAction,
    // Legacy
    createLegacyAction,
    createLegacyCache,
    createLegacyStore,
    createLegacySyncAction,
    createLegacyAsyncAction,
    createLegacyCallbackAction,
    useLegacySelector,
  };
}
