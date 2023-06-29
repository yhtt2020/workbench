import {defineStore} from "pinia";
import {Server} from '../consts'
import dbStorage from "./dbStorage";
import {nanoid} from 'nanoid'

const {axios} = window.$models
const server = Server.baseUrl
//const server='http://localhost:8001'
const activeUrl = server + '/app/activeCode'
const verifyUrl = server + '/app/verifyCode'
const createUrl = server + '/app/createCodes'
const exchangeUrl = server + '/app/exchangeCode'
const listUrl = server + '/app/listCodes'
import {getConfig} from "../js/axios/serverApi";
// @ts-ignore
export const codeStore = defineStore('code', {
  state: () => ({
    myCode: '',//我的激活码
    serialHash: '',
    verified:false,
  }),
  actions: {

    async active(code, serialHash,uid) {
      let data={key: code, serialHash: serialHash,uid:uid}
      return axios.post(activeUrl, data)
    },

    async create() {
      axios.get(createUrl, {params: {num: 10}}).then((createRS) => {
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },

    async listCodes() {
      let rs = await axios.post(listUrl, undefined, await getConfig())
      if (rs.code !== 1000) {
        console.warn(rs)
        return {
          status: 0
        }
      } else {
        return {
          status: 1,
          data: rs.data
        }
      }
    },
    async exchange(num = 1) {
      let rs = await axios.post(exchangeUrl, {num}, await getConfig())
      if (rs.code !== 1000) {
        console.warn(rs)
        return {
          status: 0
        }
      } else {
        return {
          status: 1,
          data: rs.data
        }
      }
    },

    getSerialHash() {
      if (!this.serialHash) {
        this.serialHash = nanoid(8)
      }
      return this.serialHash
    },

    async verify(uid) {
      // if (!this.myCode) {
      //   console.warn('未设置激活码')
      //   return false
      // }

      // let hash = this.getSerialHash()

      let data={
        // serialHash: hash,
        key: this.myCode,
        uid:uid
      }
      let rs = await axios.post(verifyUrl,data)
      if (rs.code !== 1000) {
        // this.myCode = ''
        console.warn('返回失败', rs)
        if(rs.code==='ENOTFOUND'){
          throw 'neterror'
        }
        this.verified=false
        return false
      } else {
        console.log(rs)
        this.verified=true
        return true
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
