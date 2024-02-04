import {defineStore} from "pinia";
import {Server} from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
import axios from 'axios'
// const {axios} = window.$models
const createUrl = Server.baseUrl + '/app/team/create'
const joinByNoUrl = Server.baseUrl + '/app/team/joinByNo'
const quitByNoUrl = Server.baseUrl + '/app/team/quitByNo'
const disbandByNoUrl = Server.baseUrl + '/app/team/disbandByNo'
const getTeamLeaderUrl = Server.baseUrl + '/app/team/getLeader'
const getTeamMembersUrl = Server.baseUrl + '/app/team/getMembers'


const getMemberDevote = Server.baseUrl + '/app/online/getMemberDevote'
const exchangeDevoteUrl = Server.baseUrl + '/app/online/exchangeDevote'


const getMy = Server.baseUrl + '/app/team/getMy'
const getByNo = Server.baseUrl + '/app/team/getByNo'
const getUserGradeUrl = Server.baseUrl + '/app/getUserGrade'
const getUserMedalUrl = Server.baseUrl + '/app/medal/getUserMedal'

const getListUrl = Server.baseUrl + '/app/team/getList'
import {appStore} from "../store";
import _ from "lodash-es";
import {get, post} from "../js/axios/request";

// @ts-ignore
export const teamStore = defineStore("teamStore", {
  state: () => ({
    teamVisible: false,//小组可见
    //小组
    team: {
      status: false,
      rankInfo: {}
    },
    teamLeader: {
      userInfo: {}
    },//当前小队队长
    teamMembers: {},//当前小队成员
    my: { //我的队伍

    },
    members: [],
    //小队成员的待领取奖励
    membersDevote: {},
  }),
  getters: {
    hasTeam: (state) => {
      if (state.my.created || state.my.joined)
        return true
      else return false
    },
    myTeamNo(state) {
      let teamNo = 0
      if (typeof state.my.created === 'undefined') {
        return 0
      }
      if (state.my.created.hasOwnProperty('no')) {
        //自己是队长
        teamNo = state.my.created.no
      } else {
        //是队员
        if (state.my.joined.length > 0) {
          teamNo = state.my.joined[0].team_no
        }
      }
      return teamNo
    },
    myTeam(state) {
      let teamNo = {}
      if (typeof state.my.created === 'undefined') {
        return teamNo
      }
      if (Object.keys(state.my.created).length > 0) {
        teamNo = state.my.created
      } else if (state.my.joined.length > 0) {
        teamNo = state.my.joined[0]
      }
      return teamNo
    }
  },
  actions: {
    async getUserMedal(uid) {
      return await get(getUserMedalUrl, {uid: uid})
    },

    async openTeam() {
      this.teamVisible = true
    },
    async closeTeam() {
      this.team = {
        status: false
      }
      this.my = {}
      this.teamVisible = false
      this.members = []
    },
    async getTeamList(query) {
      const {
        take = 1,
        skip = 0,
        type = 'active',
        order = 'create_time',
        members = 1,
        memberCache = 1,
        memberUserCache = 1,
        leader = 1,
        leaderCache = 1,
        leaderUserCache = 1,
        cache = 1
      } = query
      let time = Date.now()
      let rs = await get(getListUrl, query)
      return rs
    },

    async getTeamLeader(no, cache = 1, userCache = 1) {
      let data = await post(getTeamLeaderUrl, {no: no, cache: cache, userCache: userCache})
      if (data.status) {
        this.teamLeader = data.data
        return this.teamLeader
      } else {
        console.warn('无法取到队长信息')
      }
    },
    async getMemberGrade(uid) {
      return await get(getUserGradeUrl, {uid: uid})
    },
    async getTeamMembers(no, cache = 1, userCache = 1) {

      let teamMembersResult = await post(getTeamMembersUrl, {no: no, cache: cache, userCache: userCache})

      if (teamMembersResult.status) {
        this.teamMembers = teamMembersResult.data
        return this.teamMembers
      } else {
        console.warn('无法取到队员信息')
      }
    }
    ,
    async getMemberDevote() {
      let data = await get(getMemberDevote)
      if (data) {
        this.membersDevote = data.data || {}
        return this.membersDevote
      } else {
        this.membersDevote = {}
        console.warn('无法获取到小队收益')
      }
    },

    async exchangeDevote(from_uid = 0) {
      let data = await post(exchangeDevoteUrl,
        {from_uid: from_uid})
      if (data) {
        return {
          status: 1,
          data
        }
      } else {
        return {
          status: 0,
          info: '兑换失败'
        }
      }
    },

    async refreshTeamUsers() {
      await this.getTeamLeader(this.team.no, 0, 0)
      await this.getTeamMembers(this.team.no, 0, 0)
    },

    async updateTeam(no, cache, withRank = false) {
      let params = {
        no: no,
        cache: cache,
        withRank: withRank
      }
      let teamResult = await get(getByNo, params)
      //获取到队伍信息
      if (teamResult.status) {
        this.team = teamResult.data
      } else {
        this.team = {
          status: false
        }
      }
    },

    async updateMy(cache = 1) {
      let params = {
        cache: cache
      }
      let data = await get(getMy, params)
      if (data) {
        this.my = data.data
        let teamNo = 0
        if (this.my.created.hasOwnProperty('no')) {
          //自己是队长
          teamNo = this.my.created.no
        } else {
          //是队员
          if (this.my.joined.length > 0) {
            teamNo = this.my.joined[0].team_no
          }
        }
        //更新队伍信息
        if (teamNo) {
          await this.updateTeam(teamNo, cache)
        } else {
          await this.closeTeam()
        }
      }
    },


    /**
     * 更新全部的队伍信息，
     * @param no
     * @param options  userCache，用户缓存，默认未1
     */
    async updateTeamShip(no, options) {
      const defaultOptions = {
        userCache: 1
      }
      options = Object.assign(_.cloneDeep(defaultOptions), options)
      await this.getTeamLeader(no, options.userCache)
      await this.getTeamMembers(no, 1, options.userCache)
      if (!this.checkMember()) {
        await this.closeTeam()
      }
    },

    /**
     * 检查自己是不是成员，此方法包括队长也算在内
     */
    checkMember() {
      let myUid = Number(appStore().userInfo.uid)
      let isMember = false
      if (myUid === Number(this.team.leader)) {
        isMember = true
      }
      if (this.teamMembers.some((member => {
        if (Number(member.uid) === myUid) {
          return true
        }
      }))) {
        isMember = true
      }
      return isMember
    },

    async joinByNo(no) {
      try {
        let rs = await post(joinByNoUrl, {no: no})
        return rs
      } catch (e) {
        return {
          status: 0,
          info: e.message
        }
        console.warn(e)
      }

    },
    /**
     * 退出或者踢人
     * @param no
     * @param uid 如果不提交，则为自己退出
     */
    async quitByNo(no, uid) {
      try {
        let rs = await post(quitByNoUrl, {no: no, uid: uid})
        return rs
      } catch (e) {
        return {
          status: 0,
          info: e.message
        }
      }

    },
    /**
     * 解散小队
     * @param no
     * @param uid 如果不提交，则为自己退出
     */
    async disbandByNo(no) {
      try {
        let rs = await post(disbandByNoUrl, {teamNo: no})
        return rs
      } catch (e) {
        return {
          status: 0,
          info: e.message
        }
      }

    },
    async create(name, no, avatar) {
      let rs = await axios.post(createUrl, {
          name,
          no,
          avatar
        },
        await getConfig())
      return rs
    }
  },
  persist:
    {
      enabled: true,
      strategies:
        [
          {
            paths: ['team', 'teamVisible', 'my'],
            // 自定义存储的 key，默认是 store.$id
            // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
            storage: dbStorage,
            // state 中的字段名，按组打包储存
          },
        ],
    }
  ,
})
