import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import { NotificationManager } from "../js/common/sessionNotice";
import _ from 'lodash-es'

// @ts-ignore
export const noticeStore = defineStore('notice',{
  state:() =>({
    messageNotice:{
      session:[
        {
          id:0,
          name:'系统',
          alias:'system',
          icon:'appstore',
          url:'',
          delId:0,
        },
        {
          id:1,
          name:'ChatGpt',
          alias:'ChatGpt',
          icon:'',
          url:'/icons/bg5.png',
          delId:0,
        },
        {
          id:2,
          name:'Time machine',
          alias:'时光机',
          icon:'',
          url:'/icons/bg3.png',
          delId:0,
        },
        {
          id:3,
          name:'AI ChatGpt',
          alias:'AI ChatGpt',
          icon:'',
          url:'/icons/bg4.png',
          delId:0,
        },
        {
          id:4,
          name:'yuque',
          alias:'语雀',
          icon:'',
          url:'/icons/bg2.png',
          delId:0,
        },
        {
          id:5,
          name:'Apis',
          alias:'小蜜蜂',
          icon:'',
          url:'/icons/bg.png',
          delId:0,
        },
        {
          id:6,
          name:'system',
          alias:'系统',
          icon:'',
          url:'/icons/logo128.png',
          delId:0,
        }
      ],
      notice:[
        {
          id:0,
          noticeList:[
            {
              id:1,
              title:'',
              from:{
                username:'Victor Ruiz',
                avatarUrl:'https://up.apps.vip/avatar/006.png',
              },
              content:'礼物：小恶魔头像框挂件',
              time: Date.now(),
             
            },
            {
              id:2,
              title:'社区公告',
              content:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
              time:Date.now(),
            },
            {
              id:3,
              title:'消息标题，支持显示特殊内容比如用户头像',
              content:'这是消息正文部分，根据业务需要显示具体内容',
              time:Date.now(),
            }
          ],
          noticeIcon:'/icons/logo128.png'
        },
        {
          id:1,
          noticeList:[
            {
              id:0,
              title:'',
              content:'永久免费用于学习和测试,无任何套路,底下输入框输入就能直接用',
              time:1690428344,
            }
          ],
          noticeIcon:'',
        },
        {
          id:2,
          noticeList:[
            {
              id:0,
              title:'',
              content:'永久免费用于学习和测试,无任何套路,底下输入框输入就能直接用',
              time:1690266344,
            }
          ],
          noticeIcon:'',
        }
      ]
    },
    noticeEnable:false  // 是否开启消息通知
  }),
  actions:{

    setNotificationOnOff(value){  // 设置消息通知开关
      this.noticeEnable = value
    },

    delAllNotification(index){  // 删除所有消息通知 
      this.messageNotice.notice[index].noticeList = []
      const notice = new NotificationManager()
      notice.removeAllNotifications()
    },
    
    getNotificationData(index,value){  // 将发送出去的消息通知进行存储
      console.log('检查::>>',index,value);
      const checkIndex  = _.findIndex(this.messageNotice.notice[index].noticeList,function(o: any){
        return o.id === value.id
      })
      if(checkIndex === -1){
        this.messageNotice.notice[index].noticeList.push(value)
      }else{
        return
      }
      console.log(this.messageNotice.notice[index].noticeList);
      
    },
    
    delNotification(id: string | number,delId: any){  // 删除单个消息通知
      const index = _.findIndex(this.messageNotice.notice[id].noticeList,function(o){ return o.id === delId })
      this.messageNotice.notice[id].noticeList.splice(index,1)
    },
    

  },
  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths:['messageNotice','noticeEnable'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})