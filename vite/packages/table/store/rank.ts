import {defineStore} from "pinia";
import {sUrl} from "../consts";
import {getConfig} from "../js/axios/serverApi";
import axios from "axios";
import {teamStore} from "./team";
import {apiPost} from "../js/axios/request";

const apiGetRank = sUrl('/app/rank/get')
const apiGetMy = sUrl('/app/rank/getMy')

export const rankStore = defineStore('rank', {
  state: () => ({
    rankLists: {
      onlineUserSum: {},//page=>data
      onlineTeamSum: {},
      people:{}
    },
    pageInfos: {
      onlineUserSum: {},
      onlineTeamSum: {},
      people:{}
    },
    myRanks: {
      onlineUserSum: false,
      onlineTeamSum: false,
    }


  }),
  actions: {
    async getRank(name, page, params = {}) {
      if(['onlineUserSum','onlineTeamSum'].includes(name)){
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
        await this.getMy(name)
      }
      if(name==='people'){
        let rs=await apiPost('/app/com/scoreRankList')

        if(rs?.status===1){
          let list=this.parsePeopleList(rs.data)
          this['rankLists'][name][1]= list
          this['pageInfos'][name][1]=list
          console.log(list)
        }

      }

    },
    parsePeopleList(data){
      let list=[]
      for(const li of data){
        list.push({
          ...li,
          name:li.nickname,
          uid:li.uid,
          avatar:li.avatar_64,
          score:li.score,
          scoreName:li.score_name,
          no:li.sort
        })
      }
      return list
    },
    async getMy(name, params = {}) {
      if (name === 'onlineTeamSum') {
        params.teamNo = teamStore().team.no
      }
      console.log(params,'arams')
      let rs = await axios.get(apiGetMy, {
        params: {
          name,
          ...params
        },
        ...await getConfig()
      })
      if (rs.data.code === 1000) {
        let myRank = rs.data.data
        if (!myRank.userInfo) {
          myRank.userInfo = {}
        }
        this['myRanks'][name] = myRank
      }
    }
  }
})
