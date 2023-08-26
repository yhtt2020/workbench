import {defineStore} from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {get} from "../js/axios/request";
import {localCache} from '../js/axios/serverCache'
const juheGet = sUrl('/app/juhe/get')

// @ts-ignore
export const newsStore = defineStore("news", {
  state: () => ({
    newsMsgList: [],
  }),
  actions: {
    
    async getNewsMsg(tag, num) {
      if(localCache.get(tag)){
        this.newsMsgList = localCache.get(tag)
      }
      let response = await get(juheGet, {
        apiName: 'toutiao.index',
        params: {
          type: tag,
          page_size: num,
        },
        options: {
          key: 'toutiao.'+tag,
          ttl: 300,
          cache: 1
        }
      })

      // console.log(response, '接口返回')
      if(response.status){
        this.newsMsgList = response.data
        localCache.set(tag,this.newsMsgList,300)
      }
      else{
        return false
      }
    },

  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: dbStorage,
        paths: ['newsMsgList'],
      }
    ]
  }
});
