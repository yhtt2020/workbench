import {defineStore} from "pinia";
import {sUrl} from "../consts";
import {getConfig} from "../js/axios/serverApi";
import axios from "axios";

const apiGetRank=sUrl('/app/rank/get')
export const rankStore = defineStore('rank', {
  state: () => ({
    rankLists:{
      onlineUserSum:{}//page=>data
    },
    pageInfos:{
      onlineUserSum:{}
    }


  }),
  actions:{
    async getRank(name,page) {
      let rs=await axios.get(apiGetRank, {params: {
        name,
          page
        },...await getConfig()}, )
      if(rs.data.code===1000){
        this['rankLists'][name][page]=rs.data.data.data.list
        this['rankLists'][name][page].forEach(li=>{
          if(!li.userInfo){
            li.userInfo={}
          }
        })
        this['pageInfos'][name]=rs.data.data.data.pageInfo
      }
      console.log(this.rankLists)
      console.log(rs)
    }
  }
})
