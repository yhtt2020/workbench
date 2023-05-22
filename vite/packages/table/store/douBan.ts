import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {compareTime, sendRequest} from '../js/axios/api'

// @ts-ignore
export const douBanStore = defineStore("douBan", {
  state: () => ({
    data: {},
  }),
  actions: {
    async getData() {
      // console.log("!!!!!!!!!!!!!!!!1")
      // if (typeof this.data !== 'object') {
      //   this.data = {}
      // }
      // //命中缓存
      // const discountList = this.data
      // if (discountList) {
      //   if (!compareTime(discountList.expiresDate)) {   // 将对象里面的时间进行判断是否大于12小时
      //     console.log('命中缓存了')
      //     console.log(this.data)
      //     //无需做任何操作-
      //     return
      //   }
      // }
      console.log('00000000000')
      let res = await sendRequest(`https://api.douban.com/v2/movie/in_theaters?apikey=0ab215a8b1977939201640fa14c66bab`,{})
      console.log(res)
      // if (res && res.headers) {
      //   const date = new Date(res.headers.Date)
      //   const requestObj = {
      //     expiresDate: date,
      //     list: res.data.subjects
      //   }
      //   this.updateGameData(requestObj)
      // }
    },
    // 通过时间更新数据
    updateGameData( value) {
      console.log('更新数据=', value)
      this.data = value
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        paths: ['data']
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
