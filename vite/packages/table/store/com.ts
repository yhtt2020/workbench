import {defineStore} from "pinia";
import {Server, sUrl} from '../consts'

const getTodayRank = sUrl('/app/com/sign/getTodayRank')
const doSignUrl = sUrl('/app/com/sign/doSign')
const getSignInfoUrl = sUrl('/app/com/sign/getSignInfo')
const {axios} = window.$models
import {getConfig} from "../js/axios/serverApi";
import {getDateTime} from "../util";

export const comStore = defineStore("comStore", {
  state: () => ({
    signIn: {},
    todayRank: [],

  }),
  actions: {
    async updateTodayRank() {
      let response = await axios.get(getTodayRank, await getConfig())
      if (response.code === 1000) {
        let rankResponse = response.data
        if (rankResponse.status === 1) {
          this.todayRank = rankResponse.data.rankInfo.map(r => {
            // { id: 1, headSculpture: '', username: '阳光小葵', time: '00:01' },
            if (!r.userInfo) {
              r.userInfo = {}
            }
            const time = getDateTime(new Date(Number(r.signTime)))
            return {
              id: r.rank,
              uid: r.uid,
              avatar: r.userInfo.avatar || '',
              nickname: r.userInfo.nickname || '',
              time: time.hours + ':' + time.minutes + ':' + time.minutes
            }
          })
        }
      }
    },
    async doSign() {
      let response = await axios.post(doSignUrl, {}, await getConfig())
      if (response.code === 1000) {
        if (response.data.status === 1) {
          return true
        } else {
          return false
        }
      }
    },
    async getSignInfo() {
      let response = await axios.get(getSignInfoUrl, await getConfig())
      if (response.code === 1000) {
        return response.data
      }else{
        return false
      }
    }
  }
})
