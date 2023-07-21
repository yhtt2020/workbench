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
          url:''
        },
        {
          id:1,
          name:'ChatGpt',
          alias:'ChatGpt',
          icon:'',
          url:'/icons/bg5.png'
        },
        {
          id:2,
        }
      ],
      notice:[
        {
          id:0,
          system:[
            {
              id:1,
              title:'',
              content:'礼物：小恶魔头像框挂件',
              time: Date.now(),
              from:[
               {
                username:'Victor Ruiz',
                avatar:'https://up.apps.vip/avatar/006.png',
               }
              ],
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
          ]
          
        },
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