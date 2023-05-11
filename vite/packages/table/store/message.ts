import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {Server,sUrl} from '../consts'
import {getConfig} from "../js/axios/serverApi";
import axios from 'axios'
const url={
  messageIndex:sUrl('/app/com/messageIndex'),
  getNewFollower:sUrl('/app/com/newFollower'),
  getSystemNotice:sUrl('/app/com/systemNotice')
}


// @ts-ignore
export const messageStore = defineStore("messageStore", {
  state: () => ({
    messageIndex:[],
    //点赞数
    supportCount:0,
    //回复数
    replyCount:0,
    //聊天消息数
    imCount:0,
    //关注数
    followCount:0,
    totalCount:0,
    //新关注
    newFollower:[],
    //系统消息
    systemNotice:[]
  }),
  actions:{
    async getMessageIndex() {
      let messageResponse = await axios.post(url.messageIndex, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.supportCount=comReturn.support_count
          this.replyCount=comReturn.reply_count
          this.imCount=comReturn.im_count
          this.followCount=comReturn.follow_count
          this.totalCount=this.supportCount+this.replyCount+this.imCount+this.followCount
        }
      }
    },
    async getNewFollower(){
      let messageResponse = await axios.post(url.getNewFollower, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.newFollower=comReturn
          console.log(comReturn,'获得消息')
        }
      }
    },
    async getSystemNotice(){
      let messageResponse = await axios.post(url.getSystemNotice, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.systemNotice=comReturn
          console.log(comReturn,'获得消息')
        }
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [{

      /**
       *  myPapers: [],//我的壁纸收藏
       *     activePapers: [],//当前激活的壁纸
       *     playingPaper: null,//播放中的壁纸
       *     settings: DEFAULT_PAPERS_SETTINGS,
       *
       *
       *     lockTimeout: 1800,//锁屏延迟，默认改为半小时
       */
      paths:['messageIndex'],
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
