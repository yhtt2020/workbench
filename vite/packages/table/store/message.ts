import {defineStore} from "pinia";
import dbStorage from "./dbStorage";
import {Server,sUrl} from '../consts'
import {getConfig} from "../js/axios/serverApi";
import axios from 'axios'
const url={
  messageIndex:sUrl('/app/com/message/messageIndex'),
  getNewFollower:sUrl('/app/com/message/newFollower'),
  getSystemNotice:sUrl('/app/com/message/systemNotice'),
  getCustomNotice:sUrl('/app/com/message/messageNotice'),
  getPush:sUrl('/app/com/message/push'),
  getSupport:sUrl('/app/com/message/support'),
  getComment:sUrl('/app/com/message/commentMessage'),
  getMentions:sUrl('/app/com/message/mentions')
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
    systemNotice:[],
    //自定义消息
    customNotice:[],
    //推送
    push:[],

    //评论消息
    comment:[],
    //点赞
    support:[],
    //@消息
    mention:[]

  }),
  actions:{
    async getMessageIndex() {
      try{
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
      }catch (e) {
        console.warn('消息获取错误',e)
      }

    },
    async getNewFollower(){
      let messageResponse = await axios.post(url.getNewFollower, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.newFollower=comReturn
        }
      }
    },
    //获得系统消息
    async getSystemNotice(){
      let messageResponse = await axios.post(url.getSystemNotice, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.systemNotice=comReturn
        }
      }
    },
    //获得自定义消息
    async getCustomNotice(){
      let messageResponse = await axios.post(url.getCustomNotice, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.customNotice=comReturn
        }
      }
    },
    //获得push消息
    async getPush(){
      let messageResponse = await axios.post(url.getPush, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.push=comReturn
        }
      }
    },


    //获得点赞消息
    async getSupport(){
      let messageResponse = await axios.post(url.getSupport, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.support=comReturn
        }
      }
    },
    //获得@消息
    async getMention(){
      let messageResponse = await axios.post(url.getMentions, {},
        await getConfig())
      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.mention=comReturn.list
        }
      }
    },
    //获得评论
    async getComment(){
      let messageResponse = await axios.post(url.getComment, {},
        await getConfig())

      if(messageResponse.data.code===1000){
        if(messageResponse.data.data.code===200){
          const comReturn=messageResponse.data.data.data
          this.comment=comReturn
        }
      }
    },
    async getInteract(){
       this.getComment().then()
       this.getSupport().then()
       this.getMention().then()
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
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
