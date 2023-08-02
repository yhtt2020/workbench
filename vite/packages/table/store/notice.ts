import { defineStore } from "pinia";
import dbStorage from "./dbStorage";
import _ from 'lodash-es'

// @ts-ignore
export const noticeStore = defineStore('notice',{
  state:() =>({
    notice:{
      session:[
        {
          name:'系统',alias:'system',icon:'appstore',url:'',
        },
        {
          name:'ChatGpt',alias:'ChatGpt',icon:'', url:'/icons/bg5.png',
        },
        {
          name:'Time machine',alias:'时光机',icon:'',url:'/icons/bg3.png',
        },
        {
          name:'AI ChatGpt',alias:'AI ChatGpt',icon:'', url:'/icons/bg4.png',
        },
      ],
      message:[
        {
          noticeList:[
            {
              title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
              time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'low',
            },
            {
              title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
              time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'normal',
            },
            {
              title:'',body:'礼物：小恶魔头像框挂件',
              time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
              level:'normal',
            }
          ],
          noticeIcon:'/icons/logo128.png'
        },
        {
          noticeList:[
            {
              title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
              time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'low',
            },
            {
              title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
              time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'normal',
            },
            {
              title:'',body:'礼物：小恶魔头像框挂件',
              time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
              level:'normal',
            }
          ]
        },
        {
          noticeList:[
            {
              title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
              time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'low',
            },
            {
              title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
              time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'normal',
            },
            {
              title:'',body:'礼物：小恶魔头像框挂件',
              time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
              level:'normal',
            }
          ]
        },
        {
          noticeList:[
            {
              title:'社区公告',body:'尊敬的用户，由于系统升级，社区App将于明天进行维护，届时您可能暂时无法使用部分功能。给您带来的不便，敬请谅解。',
              time:1690879556,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'low',
            },
            {
              title:'消息标题，支持显示特殊内容比如用户头像',body:'这是消息正文部分，根据业务需要显示具体内容',
              time:1690879558,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:null,
              level:'normal',
            },
            {
              title:'',body:'礼物：小恶魔头像框挂件',
              time:1690879560,subtitle:'',icon:'/icons/logo128.png',imageUrl:'/icons/logo128.png',
              from:{ username:'Victor Ruiz',avatarUrl:'https://up.apps.vip/avatar/006.png',},
              level:'normal',
            }
          ]
        },
      ],
    },
    noticeEnable:false,
  }),

  actions:{
    setNoticeOnOff(val:boolean){  // 设置消息通知是否开启  
      this.noticeEnable = val
    },

    deleteAllNotice(index:number){  // 删除对应消息通知应用的使用消息数据  
      this.notice.message[index].noticeList = []
    },

    addNoticesData(index:number,value:object){  // 将消息通知新增到列表中 
      this.notice.message[index].noticeList.push(value)
    },
    
    deleteNotice(index: any,delIndex: any){ // 删除单个消息通知     
      this.notice.message[index].noticeList.splice(delIndex,1)
    }

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