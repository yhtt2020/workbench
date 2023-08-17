import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import _ from 'lodash-es'

// @ts-ignore
export const noticeStore = defineStore('notice',{
  state:() =>({
    notice:{
      
    },
    noticeEnable:false, // 开启消息通知弹窗

    // notice:{
    //   session:[
    //     {
    //       name:'系统',alias:'system',icon:'appstore',url:'',
    //     },
    //   ],
    //   message:[
    //     {
    //       noticeList:[
    //         {
    //           title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
    //           time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:null,
    //           level:'low',
    //         },
    //         {
    //           title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
    //           time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:null,
    //           level:'normal',
    //         },
    //         {
    //           title:'',body:'礼物：小恶魔头像框挂件',
    //           time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
    //           level:'normal',
    //         },
    //         {
    //           title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
    //           time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:null,
    //           level:'low',
    //         },
    //         {
    //           title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
    //           time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:null,
    //           level:'normal',
    //         },
    //         {
    //           title:'',body:'礼物：小恶魔头像框挂件',
    //           time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
    //           level:'normal',
    //         },
    //         {
    //           title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
    //           time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:null,
    //           level:'low',
    //         },
    //         {
    //           title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
    //           time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:null,
    //           level:'normal',
    //         },
    //         {
    //           title:'',body:'礼物：小恶魔头像框挂件',
    //           time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
    //           from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
    //           level:'normal',
    //         }
    //       ],
    //     },
    //   ],
    //   noticeIcon:'/icons/logo128.png'
    // },
    // noticeEnable:false,
    // moreEnable:false,
  }),

  actions:{

    
    // setNoticeOnOff(val:boolean){  // 设置消息通知是否开启  
    //   this.noticeEnable = val
    // },

    // deleteAllNotice(){  // 删除对应消息通知应用的使用消息数据  
    //   for(let i=0;i<this.notice.session.length;i++){
    //     this.notice.message[i].noticeList = []
    //   }
    // },
    
    // setMoreNotice(value:boolean){  // 判断更多消息是否打开显示 
    //   this.moreEnable = value
    // },
    
    // deleteNotice(index: any,delId: any){  // 删除单个消息通知
    //   this.notice.message[index].noticeList.splice(delId,1)
    // },

    // addNotifications(index: any,value: any){
    //   this.notice.message[index].noticeList.push(value)
    // },

  },

  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths:['notice','noticeEnable'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})