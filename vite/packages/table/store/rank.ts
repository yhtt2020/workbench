import {defineStore} from "pinia";
import {sUrl} from "../consts";
import {getConfig} from "../js/axios/serverApi";
import axios from "axios";

const apiGetRank=sUrl('/app/rank/get')
export const rankStore = defineStore('rank', {
  state: () => ({
    totalUserTimeSum:{ //page=>data

    },
    totalUserPageInfo:{}


  }),
  actions:{
    async getRank(name,page) {
      let rs=await axios.get(apiGetRank, {params: {
        name,
          page
        },...await getConfig()}, )
      if(rs.data.code===1000){
        this[name][page]=rs.data.data.list
        this[name+'PageInfo']=rs.data.data.pageInfo
      }
      console.log(rs)
    }
  }
})
