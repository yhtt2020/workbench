import { defineStore } from "pinia";
import dbStorage from "../../../store/dbStorage";

//@ts-ignore
export const noticeStore = defineStore('notice',{
 state:()=>({
    detailList:[]
 }),
 
 actions:{
  // 获取db数据库中的数据
  getNoticeList(){
    console.log('读取存储数据');

  },

  // 将忽略的消息通知进行数据库存储
  putNoticeData(data:any,type:any){
    if(type === 'system'){
     console.log('存储系统通知数据',data);
    }else{
     console.log('存储聊天消息数据',data);
    }
  },




 },


 persist:{
  enabled: true,
  strategies: [{
   // 自定义存储的 key，默认是 store.$id
   // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
   paths:[],
   storage: dbStorage,
   // state 中的字段名，按组打包储存
  }]
}
})

