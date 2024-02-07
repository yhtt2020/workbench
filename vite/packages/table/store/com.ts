import {defineStore} from "pinia";
import {sUrl} from '../consts'
import {getDateTime} from "../util";
import {get,post} from '../js/axios/request'

const getTodayRank = sUrl('/app/com/sign/getTodayRank')
const doSignUrl = sUrl('/app/com/sign/doSign')
const getSignInfoUrl = sUrl('/app/com/sign/getSignInfo')
const getDailyNewUsersUrl = sUrl('/app/com/sign/getDailyNewUsers')

export const comStore = defineStore("comStore", {
  state: () => ({
    signIn: {},
    todayRank: [],

  }),
  actions: {
    async updateTodayRank() {
      let response = await get(getTodayRank)
      if (response?.status === 1) {
        this.todayRank = response.data.rankInfo.map(r => {
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
            equippedItems: r.userInfo.equippedItems,
            time: time.hours + ':' + time.minutes + ':' + time.seconds
          }
        })
      }
    },
    async doSign() {
      return  await post(doSignUrl)
    },
    async getSignInfo() {
      let response = await get(getSignInfoUrl)
      return response
    },
    async getDailyNewUsers(page) {
      return await get(getDailyNewUsersUrl, {
        page: page
      })
    }
  }
})
