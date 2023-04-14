import {PiniaPluginContext} from "pinia";
declare global{
  interface PersistStrategy {
    key?: string;
    storage?: Storage;
    paths?: string[];
  }

  interface PersistOptions {
    enabled: true;
    strategies?: PersistStrategy[];
  }

  type Store = PiniaPluginContext['store'];
  type PartialState = Partial<Store['$state']>;

  declare module 'pinia' {
     interface DefineStoreOptionsBase<S, Store> {
      persist?: PersistOptions;
    }
  }

}
