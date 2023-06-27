import {PiniaPluginContext} from 'pinia'
import _ from 'lodash-es'
const isPromise = (val) => {
  return typeof val === 'object' && typeof val.then === 'function' && typeof val.catch === 'function';
};
export const updateStorage = async (strategy: PersistStrategy, store: Store) => {
  const storage = strategy.storage || sessionStorage
  const storeKey = strategy.key || store.$id

  if (strategy.paths) {
    const partialState = strategy.paths.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key]
      return finalObj
    }, {} as PartialState)
     storage.setItem(storeKey, JSON.stringify(partialState))
  } else {
     storage.setItem(storeKey, JSON.stringify(store.$state))
  }
}

export default async ({options, store}: PiniaPluginContext): void => {
  if (options.persist?.enabled) {
    const defaultStrat: PersistStrategy[] = [{
      key: store.$id,
      storage: sessionStorage,
    }]

    const strategies = options.persist?.strategies?.length ? options.persist?.strategies : defaultStrat
    for (const strategy of strategies) {
      const storage = strategy.storage || sessionStorage
      const storeKey = strategy.key || store.$id
      const storageResult = storage.getItem(storeKey)

      if (storageResult) {
        if (isPromise(storageResult)) {
          let rs = await storageResult
          if (rs) {
            store.$patch(JSON.parse(rs))
            updateStorage(strategy, store)
          }
        } else {
          store.$patch(JSON.parse(storageResult))
          updateStorage(strategy, store)
        }

      }
    }

    store.$subscribe((s,state) => {
      strategies.forEach((strategy) => {
        updateStorage(strategy, store)
      })
    })
  }
}
