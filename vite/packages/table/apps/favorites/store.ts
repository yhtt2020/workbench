import {defineStore} from "pinia";
import dbStorage from "../../store/dbStorage";
import {cardStore} from '../../store/card';
import {mapActions, mapState, mapWritableState} from "pinia";
import {useToast} from "vue-toastification";
import { message } from 'ant-design-vue'
const toast = useToast()
// @ts-ignore
export const favoStore = defineStore("favoStore", {
  state: () => ({
    // 浏览器打开方式
    browserType: 'system',
    isFavorites: false,
    // 收藏夹数据 解绑后清空 
    chromeList: [],
    edgeList: [],
    // 将收藏夹数据打散存入 最近添加
    allList: [],
    folderList: [
      {
        name: '我的收藏',
        type: 'favo',
        num: 0,
        rename: null,
      }
    ],
    // 序列
    folderIndex: null,
    browserList: {
      chrome: true,
      edge: true,
    },
    updateTime: null,
    searchValue: '',
    folderIcons: []

  }),
  actions: {
    

    

  },
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      paths: ['allList', 'folderList', 'browserList', 'updateTime', 'browserType', 'folderIndex']
      // state 中的字段名，按组打包储存
    }]
  }
})
