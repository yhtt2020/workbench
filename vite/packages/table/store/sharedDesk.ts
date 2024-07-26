import {defineStore} from "pinia";
import {apiGet} from "../js/axios/request";
import shareHelper from "../js/lib/shareHelper";

export const sharedDeskStore = defineStore("sharedDesk", {
  state: () => ({
      currentDesk:{}


    }
  ),
  actions:{
    async getDeskInfo(code){
      let rs=await shareHelper.get(code)
      console.log(rs,'返回结果')

      return rs
    }
  }


})
