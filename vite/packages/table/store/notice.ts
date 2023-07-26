import { defineStore } from "pinia";
import dbStorage from "./dbStorage";

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
          del_id:0,
        },
        {
          id:1,
          name:'ChatGpt',
          alias:'ChatGpt',
          icon:'',
          url:'/icons/bg5.png',
          del_id:0,
        },
        {
          id:2,
          name:'Time machine',
          alias:'时光机',
          icon:'',
          url:'/icons/bg3.png',
          del_id:0,
        },
        {
          id:3,
          name:'AI ChatGpt',
          alias:'AI ChatGpt',
          icon:'',
          url:'/icons/bg4.png',
          del_id:0,
        },
        {
          id:4,
          name:'yuque',
          alias:'语雀',
          icon:'',
          url:'/icons/bg2.png',
          del_id:0,
        },
        {
          id:5,
          name:'Apis',
          alias:'小蜜蜂',
          icon:'',
          url:'/icons/bg.png',
          del_id:0,
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
              
            }
          ],
          noticeIcon:'',
        }
      ]
    },
  }),
  actions:{

  },
  persist:{
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      paths:['messageNotice'],
      storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})