import {defineStore} from "pinia";
import {Server} from '../consts'
import dbStorage from "./dbStorage";
import {nanoid} from 'nanoid'
import axios from 'axios'
//const server='http://localhost:8001'
const activeUrl =  '/app/activeCode'
const verifyUrl = '/app/verifyCode'
const createUrl = '/app/createCodes'
import {getConfig} from "../js/axios/serverApi";
import {apiGet, apiPost, post} from "../js/axios/request";
// @ts-ignore
export const codeStore = defineStore('code', {
  state: () => ({
    myCode: '',//我的激活码
    serialHash: '',
    verified:false,
  }),
  actions: {

    async active(code) {
      let data={key: code}
      return await  apiPost(activeUrl, data)
    },

    async create() {
      apiGet(createUrl, {params: {num: 10}}).then((createRS) => {
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },

    async listCodes() {
      return await apiPost( '/app/listCodes', undefined)
    },
    async exchange(num = 1) {
      let rs = await apiPost( '/app/exchangeCode', {num})
      if (rs) {
        return {
          status: 1,
          data: rs
        }
      } else {
        return {status:0}
      }
    },


    async verify(uid) {
      let data={
        key: this.myCode,
        uid:uid
      }
      let rs = await apiPost(verifyUrl,data)
      if (rs) {
        this.verified=true
        return true
      } else {
        this.verified=false
        return false
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
