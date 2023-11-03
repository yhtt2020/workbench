import { defineStore } from 'pinia';
import dbStorage from '../../../../store/dbStorage'

// @ts-ignore
export const courierModalStore = defineStore('courierModal',{
 state:()=>({
  sortList:[], // 组件大尺寸下的数据
  smallSortList:[], // 组件小尺寸下的数据
 }),

 actions:{
  updateSortList(data:any){
    this.sortList = data
  },
  updateSmallSortList(data:any){
    this.smallSortList = data
  }

 },
 
 persist:{
  enabled: true,
  strategies: [{
    // 自定义存储的 key，默认是 store.$id
    // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
    storage: dbStorage,
    paths: ['sortList','smallSortList']
    // state 中的字段名，按组打包储存
  }]
}
})