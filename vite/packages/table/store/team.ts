import {defineStore} from "pinia";
import {Server} from '../consts'
import {getConfig} from "../js/axios/serverApi";
const {axios} = window.$models
const createUrl = Server.baseUrl + '/app/team/create'
const joinByNoUrl = Server.baseUrl + '/app/team/joinByNo'
export const teamStore = defineStore("teamStore", {
  state: () => ({
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
  }
})
