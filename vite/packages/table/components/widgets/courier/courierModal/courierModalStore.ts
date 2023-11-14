import { defineStore,storeToRefs } from 'pinia';
import dbStorage from '../../../../store/dbStorage'
import { courierStore } from '../../../../apps/ecommerce/courier'

// @ts-ignore
export const courierModalStore = defineStore('courierModal',{
 state:()=>({
  smallSortList:[], // 组件小尺寸下的数据
  courierLists:[{code:'自动识别',label:'自动识别', orderNum:'',phoneLastNum:''}]
 }),

 actions:{
  updateSmallSortList(data:any){
    this.smallSortList = data
  },

  // 新增更多的快递信息
  addNewCourierInfo(){
    this.courierLists.push({currentDetail:''})
  },

  // 删除不需要的输入框
  removeNewCourierInfo(index:any){
    // console.log('查看index',index);
    // console.log('查看数据长度',this.courierLists.length === 1);
    if(this.courierLists.length === 1){
      return
    }else{
      this.courierLists.splice(index,1)
    }

  },

  updateNewCourierInfo(data:any,index:any){
    // console.log('查看数据',data,index);
    this.courierLists.splice(index, 1 , data)
    // console.log('查看替换后的数据',this.courierLists);

  },
 },

 persist:{
  enabled: true,
  strategies: [{
    // 自定义存储的 key，默认是 store.$id
    // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
    storage: dbStorage,
    paths: ['sortList','smallSortList','courierLists']
    // state 中的字段名，按组打包储存
  }]
}
})
