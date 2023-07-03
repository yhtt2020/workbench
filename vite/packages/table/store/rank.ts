import {defineStore} from "pinia";
import {sUrl} from "../consts";
import {getConfig} from "../js/axios/serverApi";
import axios from "axios";

const apiGetRank = sUrl('/app/rank/get')
const apiGetMy = sUrl('/app/rank/getMy')
export const rankStore = defineStore('rank', {
  state: () => ({
    rankLists: {
      onlineUserSum: {},//page=>data
      onlineTeamSum:{}
    },
    pageInfos: {
      onlineUserSum: {},
      onlineTeamSum:{}
    },
    myRanks:{}


  }),
  actions: {
    async getRank(name, page, params = {}) {
      let rs = await axios.get(apiGetRank, {
        params: {
          name,
          page,
          params
        }, ...await getConfig()
      },)
      if (rs.data.code === 1000) {
        this['rankLists'][name][page] = rs.data.data.data.list
        this['rankLists'][name][page].forEach(li => {
          if (!li.userInfo) {
            li.userInfo = {}
          }
        })
        this['pageInfos'][name] = rs.data.data.data.pageInfo
      }
      console.log(this.rankLists)
      console.log(rs)
    },
    async getMy(name) {
        let rs=await axios.get(apiGetMy,{
          params:{
            name
          },
          ...await getConfig()
        })
      if(rs.data.code===1000){
        let myRank= rs.data.data
        if (!myRank.userInfo) {
          myRank.userInfo = {}
        }
        this['myRanks'][name] =myRank
      }
    }
  }
})
