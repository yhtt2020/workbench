import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import _ from 'lodash-es'
import {nanoid} from "nanoid";
import { appStore } from '../store'

// @ts-ignore
export const noticeStore = defineStore('notice',{
  state:() =>({
    notice:{
      messageContent:[], // 右侧消息通知内容
    },

   

  }),

  actions:{
   

    // 获取所有聊天数据
    async loadNoticeDB(){
      const result = await tsbApi.db.allDocs('notice')
      const sortReuslt = result.rows.sort((a,b)=>{
        return b.doc.content.time - a.doc.content.time
      })
      this.notice.messageContent = sortReuslt
    },

    async putIMChatData(val:object,type:string) {  // 将聊天消息数据进行db数据库存储
      console.log('测试::>>',);
      
      await tsbApi.db.put({
        _id:'notice:' + nanoid(10),
        type:`${type}`,
        appType:'IM',
        content:val,
      })

    },


    async removeIMChatData(item:any){  // 聊天消息数据从db数据库中清空
      await tsbApi.db.remove(item.doc)
    },

    async clean(){
      for(let i=0;i<this.notice.messageContent.length;i++){
        await tsbApi.db.remove(this.notice.messageContent[i].doc)
      }
      this.notice.messageContent = []
    }








  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths:['noticeEnable'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
