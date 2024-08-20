declare module "version-one-dev-utils/state" {


    type Action = { 
        type: string;
        meta: { key: string; cached: boolean };
    };
  
    type ActionOptions = {
        cache?:boolean;
    }
  
  
    const createSyncAction: <P, R>(fn: (props:P) => R, options?: ActionOptions) => ((props:P) => Promise<R>) & {
        pending?:(state:any, action: Action & {meta: {props:P}, payload: undefined, error: undefined}) => any;
        success?:(state:any, action: Action & {meta: {props:P}, payload: R, error: undefined}) => any;
        error?:(state:any, action: Action & {meta: {props:P}, payload: undefined, error: any}) => any;
    };
  
  
  
    const createAsyncAction: <P, R>(fn: (props:P) => Promise<R>, options?: ActionOptions) => ((props:P) => Promise<R>) & {
        pending?:(state:any, action: Action & {meta: {props:P}, payload: undefined, error: undefined}) => any;
        success?:(state:any, action: Action & {meta: {props:P}, payload: R, error: undefined}) => any;
        error?:(state:any, action: Action & {meta: {props:P}, payload: undefined, error: any}) => any;
    };
  
  
    const createCallbackAction: <P, R, E>(fn: (props:P) => (resolve:Function, reject:<E>(error:E) => void) => void, options?: ActionOptions) => ((props:P) => Promise<Parameters<typeof resolve>>) & {
        pending?:(state:any, action: Action & {meta: {props:P}, payload: undefined, error: undefined}) => any;
        success?:(state:any, action: Action & {meta: {props:P}, payload: R, error: undefined}) => any;
        error?:(state:any, action: Action & {meta: {props:P}, payload: undefined, error: any}) => any;
    };
  
  
  
    const Store: any;
    const PendingStore: any;
    const ErrorStore: any;
    const usePending: () => {getPending: (...filters?: any[] | undefined) => ({type:string} | undefined)};
    const useErrors: any;
    const useSelector:<R>(selector:() => R, equalityFn?: (a:R, b:R) => bool) => R;
    const createStore: any;
    const createCache: any;
  
    
  
    export {
        Store,
        PendingStore,
        ErrorStore,
        usePending,
        useErrors,
        useSelector,
        createStore,
        createCache,
        createSyncAction,
        createAsyncAction,
        createCallbackAction
    }
  }
  
  
  