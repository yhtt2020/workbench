import {defineStore} from "pinia";

// @ts-ignore
export const weatherStore = defineStore('weather', {
  state: () => ({
    cities: [],//当前城市
    lastUpdateTime: 0,//最后一次更新时间
  }),
  actions: {
    /**
     * 添加城市
     * @param city
     */
    addCity(city) {
      this.cities.push(city)
    },
    /**
     * 移除城市
     * @param cityId
     */
    removeCity(cityId) {
      this.cities = this.cities.filter(city => {
        return city.id !== cityId
      })
    },
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: localStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
