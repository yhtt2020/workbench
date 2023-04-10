import { PiniaPluginContext } from 'pinia'

const isPromise = (val) => {
  return typeof val === 'object' && typeof val.then ==='function' && typeof val.catch ==='function';
};
export const updateStorage = async (strategy: PersistStrategy, store: Store) => {
  const storage = strategy.storage || sessionStorage
  const storeKey = strategy.key || store.$id

  if (strategy.paths) {
    const partialState = strategy.paths.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key]
      return finalObj
    }, {} as PartialState)
    await storage.setItem(storeKey, JSON.stringify(partialState))
  } else {
    await storage.setItem(storeKey, JSON.stringify(store.$state))
  }
}

export default ({ options, store }: PiniaPluginContext): void => {
  if (options.persist?.enabled) {
    const defaultStrat: PersistStrategy[] = [{
      key: store.$id,
      storage: sessionStorage,
    }]

    const strategies = options.persist?.strategies?.length ? options.persist?.strategies : defaultStrat

    strategies.forEach((strategy) => {
      const storage = strategy.storage || sessionStorage
      const storeKey = strategy.key || store.$id
      const storageResult = storage.getItem(storeKey)

      if (storageResult) {
        if(isPromise(storageResult)){
          storageResult.then(rs=>{
            if(rs){
              console.log(rs,'获取到的值')
              store.$patch(JSON.parse(rs))
              updateStorage(strategy, store)
            }
          })
        }else{
          store.$patch(JSON.parse(storageResult))
          updateStorage(strategy, store)
        }

      }
    })

    store.$subscribe(() => {
      strategies.forEach((strategy) => {
        updateStorage(strategy, store)
      })
    })
  }
}
