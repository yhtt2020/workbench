import {defineStore} from "pinia";
import {Server} from '../consts'
const {axios} = window.$models
const server = Server.baseUrl
//const server='http://localhost:8001'
const activeUrl = server + '/app/activeCode'
const verifyUrl = server + '/app/verifyCode'
const createUrl = server + '/app/createCodes'
const exchangeUrl= server+'/app/exchangeCode'
const listUrl= server+'/app/listCodes'
const getConfig = async () => {
  let token;
  const res = await window.tsbApi.user.get()
  token = res.data.token

  return {
    headers: {
      'Authorization': token
    }
  }
}
// @ts-ignore
export const codeStore = defineStore('code', {
  state: () => ({
    myCode: ''//我的激活码
  }),
  actions: {

    async active(code, serialHash) {
      return axios.post(activeUrl, {key: code, serialHash: serialHash})
    },

    async create(){
      axios.get(createUrl, { params: { num: 10 } }).then((createRS) => {
        this.loading = false
      }).catch(e => {
        this.loading = false
      })
    },

    async listCodes(){
      let rs=await axios.post(listUrl,undefined,await getConfig())
      if(rs.code!==1000){
        console.warn(rs)
        return {
          status:0
        }
      }else{
        return {
          status:1,
          data:rs.data
        }
      }
    },
    async exchange(num=1){
      let rs=await axios.post(exchangeUrl,{num},await getConfig())
      if(rs.code!==1000){
        console.warn(rs)
        return {
          status:0
        }
      }else{
        return {
          status:1,
          data:rs.data
        }
      }
    },

    async verify(cb) {
      if (!this.myCode) {
        console.warn('未设置激活码')
        return false
      }
      let serialHash = await window.getSerialNum()
      axios.post(verifyUrl, {
        serialHash: serialHash,
        key: this.myCode
      }).then(rs => {
        if (rs.code !== 1000) {
          // this.myCode = ''
          console.warn('返回失败', rs)
          cb(false)
        } else {
          console.info('验证通过')
          cb(true)
        }
      })

    }
  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: localStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
