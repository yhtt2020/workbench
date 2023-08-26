import {defineStore} from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";
import {sUrl} from "../consts";
import {get} from "../js/axios/request";

const juheGet = sUrl('/app/juhe/get')

// @ts-ignore
export const newsStore = defineStore("news", {
  state: () => ({
    NewsMsgList: [],
  }),
  actions: {
    async getNewsMsg(tag, num) {
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

      console.log(response, '接口返回')
      if(response.status){
        this.NewsMsgList = response.data
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
        paths: ['NewsMsgList'],
      }
    ]
  }
});
