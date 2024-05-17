import {defineStore} from "pinia";
import {apiGet} from "../js/axios/request";

export const sharedDeskStore = defineStore("sharedDesk", {
  state: () => ({
      currentDesk:{}


    }
  ),
  actions:{
    async getDeskInfo(id){
      let rs=await apiGet('/app/good/desk/info',{id:id})
      console.log(rs,'返回结果')

      return rs
    }
  }


})
