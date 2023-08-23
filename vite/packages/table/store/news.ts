import { defineStore } from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";


export const newsStore = defineStore('news', {
  state: () => ({
    NewsMsgList: [],
  }),
  actions: {
    async getNewsMsg(tag) {
      let res=await axios.post('http://v.juhe.cn/toutiao/index',{
        params:{
          key:'2ce91c43301c9528f2f9d1cd6f310e2b',
          tag:tag,
          page_size:10,
        }
      })
    }
  },
  persist: {
    enabled: true,
    strategies:[
      {
        storage: dbStorage
      }
    ]
  }
})
