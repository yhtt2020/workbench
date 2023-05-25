import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {sendRequest} from "../js/axios/api"

// @ts-ignore
export const filmStore = defineStore("film", {
  state: () => ({
    data: {},
    filmDetail: {}
  }),
  actions: {
    async getData() {
      let res = await sendRequest(`https://m.maoyan.com/ajax/movieOnInfoList`,{},{
        localCache:true,
        localTtl:12*60*60
      })
      res.data.movieList.forEach(item => {
        item.img = item.img.replace('2500x2500','240x354')
        item.comingDate = item.comingTitle.split(' ')[0]
      });
      this.data = res.data.movieList
      // console.log("data",this.data)
    },
    
  },
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        paths: ['data','filmDetail']
        // state 中的字段名，按组打包储存
      },
    ],
  },
});
