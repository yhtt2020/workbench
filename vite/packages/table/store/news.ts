import {defineStore} from "pinia";
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
        console.log(this.newsMsgList);
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

      if(response.status){
        if(response.data instanceof Array){
          this.newsMsgList=response.data
          
        }else{
          this.newsMsgList = response.data.result.data
        }
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
