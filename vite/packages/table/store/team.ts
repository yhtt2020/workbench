import {defineStore} from "pinia";
import {Server} from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
const {axios} = window.$models
const createUrl = Server.baseUrl + '/app/team/create'
const joinByNoUrl = Server.baseUrl + '/app/team/joinByNo'
const getTeamLeaderUrl = Server.baseUrl + '/app/team/getLeader'
const getTeamMembersUrl = Server.baseUrl + '/app/team/getMembers'

// @ts-ignore
export const teamStore = defineStore("teamStore", {
  state: () => ({
    teamVisible: false,//小组可见
    //小组
    team: {
      status: false
    },
    teamLeader: {
      userInfo:{}
    },//当前小队队长
    teamMembers: {},//当前小队成员
  }),
  actions: {
    async getTeamLeader(no, cache = 1, userCache = 1) {
      let teamLeaderResult = await axios.post(getTeamLeaderUrl, {no: no, cache: cache, userCache: userCache},
        await getConfig())
      if (teamLeaderResult.code === 1000) {
        let data = teamLeaderResult.data
        if (data.status) {
          this.teamLeader = data.data
          return this.teamLeader
        } else {
          console.warn('无法取到队长信息')
        }
      }
    },
    async getTeamMembers(no, cache = 1, userCache = 1) {

      let teamMembersResult = await axios.post(getTeamMembersUrl, {no: no, cache: cache, userCache: userCache},
        await getConfig())
      if (teamMembersResult.code === 1000) {
        let data = teamMembersResult.data
        if (data.status) {
          this.teamMembers = data.data
          return this.teamMembers
        } else {
          console.warn('无法取到队员信息')
        }
      }
    },

    /**
     * 更新全部的队伍信息
     */
    async updateTeamShip(no) {
      await this.getTeamLeader(no)
      await this.getTeamMembers(no)
    },

    async joinByNo(no) {
      try {
        let rs = await axios.post(joinByNoUrl, {no: no},
          await getConfig())
        return rs
      } catch (e) {
        return {
          status: 0,
          info: e.message
        }
        console.warn(e)
      }

    },
    async create(name, no, avatar) {
      let rs = await axios.post(createUrl, {
          name,
          no,
          avatar
        },
        await getConfig())
      console.log(rs)
      return rs
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['team', 'teamVisible'],
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
})
