import {defineStore} from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";

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
     * 刷新全部城市的天气
     */
     reloadAll(){
      this.cities.forEach(async city=>{
        await this.reloadCityWeatherAll(city)
      })
    },

    /**
     * 刷新某个城市的全部天气
     * @param city
     */
    async reloadCityWeatherAll(city) {
      try {
        let lastUpdate=city.getTime
        let nowTime=Date.now()
        let span=nowTime-lastUpdate
        if(span<=60*60*12*1000){
          console.warn('获取间隔过小，直接返回')
          return
        }
        let nowData=await this.getNow(city)
        let now=nowData.now
        let h24= await this.get24h(city)
        let d7= await this.get7d(city)
        if(now){
          city.now=now
        }
        if(h24){
          city.h24=h24
        }
        if(d7){
          city.d7=d7
        }
        city.getTime = Date.now()
        if(typeof city.now==='undefined'){
          city.now={}
        }
        if(typeof city.h24 ==='undefined'){
          city.h24={}
        }
        if(typeof city.d7==='undefined'){
          city.d7={}
        }

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
        console.log(result.data)
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
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
