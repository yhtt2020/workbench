import {defineStore} from "pinia";
import {Server} from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";

const {axios} = window.$models
const createUrl = Server.baseUrl + '/app/team/create'
const joinByNoUrl = Server.baseUrl + '/app/team/joinByNo'
const getTeamLeaderUrl = Server.baseUrl + '/app/team/getLeader'
const getTeamMembersUrl = Server.baseUrl + '/app/team/getMembers'
const getMy = Server.baseUrl + '/app/team/getMy'
const getByNo = Server.baseUrl + '/app/team/getByNo'
const getUserGradeUrl = Server.baseUrl + '/app/getUserGrade'


const getListUrl=Server.baseUrl+'/app/team/getList'
// @ts-ignore
export const teamStore = defineStore("teamStore", {
  state: () => ({
    teamVisible: false,//小组可见
    //小组
    team: {
      status: false
    },
    teamLeader: {
      userInfo: {}
    },//当前小队队长
    teamMembers: {},//当前小队成员
    my: { //我的队伍

    },
    members: []
  }),
  getters:{
    hasTeam:(state)=>{
      if(state.my.created || state.my.joined)
        return true
      else return false
    },
  },
  actions: {
    async closeTeam(){
      this.team={
        status:false
      }
      this.my={

      }
      this.teamVisible=false
      this.members=[]
    },
    async getTeamList(query) {
      const {
        take=1 ,
        skip=0,
        type='active',
        order='create_time',
        members=1,
        memberCache=1,
        memberUserCache=1,
        leader=1,
        leaderCache=1,
        leaderUserCache=1,
        cache=1
      } = query
      let conf = await getConfig()
      conf.params = query
      let response = await axios.get(getListUrl, conf)
      console.log(response, 'response======================')
      if (response.code === 1000) {
        return response.data
      }
    },

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
    async getMemberGrade(uid) {
      let conf = await getConfig()
      conf.params = {uid: uid}
      let response = await axios.get(getUserGradeUrl, conf)
      console.log(response, 'response======================')
      if (response.code === 1000) {
        return response.data
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

    async updateTeam(no, cache) {
      let conf = await getConfig()
      console.log(conf)
      conf.params = {
        no: no,
        cache: cache
      }
      let teamResult = await axios.get(getByNo, conf)
      if (teamResult.code === 1000) {
        //获取到队伍信息
        if (teamResult.data.status) {
          this.team = teamResult.data.data
        } else {
          this.team = {
            status: false
          }
        }
      }
      console.log('teamResult=', teamResult)
    },

    async updateMy(cache = 1) {
      let conf = await getConfig()
      console.log(conf)
      conf.params = {
        cache: cache
      }
      let myTeamResult = await axios.get(getMy, conf)
      if (myTeamResult.code === 1000) {
        let data = myTeamResult.data
        console.log('myTeamResult=', myTeamResult)
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
        console.log('取到队伍=', teamNo)
        //更新队伍信息
        if (teamNo) {
          await this.updateTeam(teamNo, cache)
        }else{
         await this.closeTeam()

        }
      }
      console.log(myTeamResult)

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
