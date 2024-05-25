import {defineStore} from "pinia";
import {apiGet, apiPost} from "../../js/axios/request";

export const incomeStore = defineStore('incomeStore', {
  state: () => ({
    useMode: 'modal',

  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        // 自定义存储的 key，默认是 store.$id
        // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
        storage: localStorage,
        // state 中的字段名，按组打包储存
      },
    ],
  }
})
