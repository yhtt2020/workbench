import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import _ from 'lodash-es'
import {nanoid} from "nanoid";

// @ts-ignore
export const noticeStore = defineStore('notice',{
  state:() =>({
    notice:{
      sessionApp:[  // 左侧应用图标
        {
          id:'all',
          icon:'appstore',
          image:'',
          alias:'all',
          title:'全部消息通知'
        },
        {
          id:'IM',
          icon:'',
          image:'/icons/IM.png',
          alias:'teamChat',
          title:'社群沟通'
        }
      ],
      messageContent:[], // 右侧消息通知内容
    },

    noticeSettings:{
      enable:true,  // 开启消息通知
      enablePlay:true, // 开启消息提示语开关
      messagePlay:false, // 消息接收提示语播放
      noticePlay:false, // 通知接收提示语播放
      show:false, // 工作台页面顶部消息图标显示
    },

  }),

  actions:{
    showNoticeEntry(){  // 显示消息通知入口
      this.noticeSettings.show = true
    },
    hideNoticeEntry(){  // 隐藏消息通知入口
      this.noticeSettings.show = false
    },
    setNoticeOnOff(val:boolean){  // 设置消息通知是否开启
      this.noticeSettings.enable = val
    },
    setMessagePrompt(val:boolean){  // 设置消息通知提示语开关
      this.noticeSettings.enablePlay = val
    },
    setMessagePlay(){ // 设置消息提示语
      this.noticeSettings.messagePlay = true
    },
    setNoticePlay(){  // 设置通知提示语
      this.noticeSettings.noticePlay = true
    },

    // 获取所有聊天数据
    async loadNoticeDB(){
      const result = await tsbApi.db.allDocs('notice')
      const sortReuslt = result.rows.sort((a,b)=>{
        return b.doc.content.time - a.doc.content.time
      })
      this.notice.messageContent = sortReuslt
    },

    async putIMChatData(val:object,type:string) {  // 将聊天消息数据进行db数据库存储

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
