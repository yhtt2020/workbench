import {defineStore} from "pinia";
import {Server} from '../consts'
import {getConfig} from "../js/axios/serverApi";
import dbStorage from "./dbStorage";
const {axios} = window.$models
const createUrl = Server.baseUrl + '/app/team/create'
const joinByNoUrl = Server.baseUrl + '/app/team/joinByNo'
export const teamStore = defineStore("teamStore", {
  state: () => ({
    teamVisible:false,//小组可见
    //小组
    team: {
      status: false
    },
  }),
  actions: {
    async create(name, no, avatar) {
      console.log(createUrl)
      console.log(await getConfig())
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
        paths:['team','teamVisible'],
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: dbStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  },
})
