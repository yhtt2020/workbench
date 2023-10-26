import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, cacheRequest} from '../js/axios/api'
import axios from "axios";
import {serverCache} from "../js/axios/serverCache";
// @ts-ignore
export const filmStore = defineStore("film", {
  state: () => ({
    data: {}
  }),
  actions: {
    async getData(cache=1) {
      const url = `https://m.maoyan.com/ajax/movieOnInfoList`
      if (!cache) {
        let axiosResponse = await axios.get(url, {})
        if (axiosResponse.status === 200) {
          // 如果请求到数据，post到serverCache的setCache api
          await serverCache.set(url, axiosResponse, 60 * 60 * 12).then()
        }
        this.data = axiosResponse.data
        return
      } else {
        if (typeof this.data !== 'object') {
          this.data = {}
        }
        const discountList = this.data
        if (discountList.list) {
          if (!compareTime(discountList.expiresDate)) {   // 将对象里面的时间进行判断是否大于12小时
            // console.log('命中缓存了')
            return
          }
        }
        let res = await cacheRequest(url, {}, {
          localCache: true,
          localTtl: 60 * 60 * 12
        })
        if (res.data.code) {
          this.data = res.data
          return
        } else {
          if (res && res.headers) {
            const date = new Date(res.headers.Date)
            const requestObj = {
              expiresDate: date,
              list: res.data.movieList
            }
            this.updateGameData(requestObj)
          }
          this.data.list.forEach(item => {
            item.img = item.img.replace('2500x2500', '240x354')
            item.comingDate = item.comingTitle.split(' ')[0]
            item.score = this.priceFormat(item.sc)
          });
        }
      }

    },
    priceFormat(num) {
      if (!isNaN(num)) {
        return ((num + '').indexOf('.') != -1) ? num : num.toFixed(1);
      }
    },
    //  通过时间更新数据
    updateGameData(value) {
      // console.log('更新数据=', value)
      this.data = value
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        paths: ['data']
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
