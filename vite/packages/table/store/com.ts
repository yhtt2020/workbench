import {defineStore} from "pinia";
import {Server,sUrl} from '../consts'
const getTodayRank=sUrl('/app/com/sign/getTodayRank')
const {axios} = window.$models
import {getConfig} from "../js/axios/serverApi";
import {getDateTime} from "../util";
export const comStore = defineStore("comStore", {
  state: () => ({
    signIn:{

    },
    todayRank:[],

  }),
  actions:{
    async updateTodayRank() {
      let response = await axios.get(getTodayRank, await getConfig())
      if(response.code===1000){
        let rankResponse=response.data
        if(rankResponse.status===1){
          this.todayRank=rankResponse.data.rankInfo.map(r=>{
            // { id: 1, headSculpture: '', username: '阳光小葵', time: '00:01' },
            if(!r.userInfo){
              r.userInfo={

              }
            }
            const time=getDateTime(new Date(Number(r.signTime)))
            console.log(r.signTime,time)
            return {
              id:r.rank,
              uid:r.uid,
              avatar:r.userInfo.avatar || '',
              nickname:r.userInfo.nickname || '',
              time: time.hours+':'+time.minutes+':'+time.minutes
            }
          })
        }
      }
    }
  }
})
