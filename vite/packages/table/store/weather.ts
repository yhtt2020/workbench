import {defineStore} from "pinia";
import axios from "axios";
import {message} from "ant-design-vue";

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

    async reloadCityWeatherAll(city) {
      try {
        city.weather = await this.getNow(city)
        city.h24 = await this.get24h(city)
        city.d7 = await this.get7d(city)
        city.getTime = Date.now()
        return city
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    async get(url, data) {
      let result = await axios.get(url, {
        params: {
          ...data,
          key: '10e0203ea2234e028301877d04d08ffc'
        }
      })
      if (result.status === 200 && result.data.code === '200') {
        return result.data
      } else {
        return false
      }
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
    async getNow(city) {
      let weather = await this.get('https://devapi.qweather.com/v7/weather/now?', {
        location: city.id
      })
      return weather
    },
    async get24h(city) {
      let weather = await this.get('https://devapi.qweather.com/v7/weather/24h?', {
        location: city.id
      })
      return weather
    },
    async get7d(city) {
      let weather = await this.get('https://devapi.qweather.com/v7/weather/7d?', {
        location: city.id
      })
      return weather
    },
    async search(words) {
      if (!words) {
        return false
      }
      let cities = await this.get('https://geoapi.qweather.com/v2/city/lookup?', {
          location: words
        }
      )
      if (cities) {
        return cities.location
      } else {
        return false
      }
    },//
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
