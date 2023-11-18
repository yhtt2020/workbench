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
      const  cacheTag='toutiao:cache:'+tag
      const cacheData=localCache.get(cacheTag)
      if(cacheData){
        this.newsMsgList = cacheData
        // console.log(this.newsMsgList);
      }
      let response = await get(juheGet, {
        apiName: 'toutiao.index',
        params: JSON.stringify({
          type: tag,
          page_size: num,
        }),
        options: JSON.stringify({
          key: cacheTag,
          ttl: 300,
          cache: 1
        })
      })

      if(response.status){
        if(response.data instanceof Array){
          this.newsMsgList=response.data

        }else{
          this.newsMsgList = response.data.result.data
        }
        localCache.set(cacheTag,this.newsMsgList,300)
      }
      else{
        this.newsMsgList=[]
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
