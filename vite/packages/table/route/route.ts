import Lock from '../page/Lock.vue'
import Wizard from '../page/Wizard.vue'
import main from './main'

//设置
import Splash from '../page/Splash.vue'
//import index from './index'
// 快捷键
import CreativeMarket from "../apps/shortcutKey/page/CreativeMarket.vue"
import MarketList from "../apps/shortcutKey/page/MarketList.vue";

// 社群邀请流程
import InviteProcess from '../page/chat/page/process/inviteProcess.vue';
import NextProcess from '../page/chat/page/process/NextProcess.vue';
import Shared from "../page/Shared.vue";
import Home from '../page/Home.vue'
import {usePlat} from "../permission/usePlat";
let routes = [
  ...main,
  //...index,
  {
    path:'/s/:code/:password?',
    name:'Shared',
    component: Shared,
  },
  {
    path: '/lock',
    name: 'lock',
    component: Lock,
    children: [
    ]
  },
  {
    path:'/',
    name:'start',
    component: Splash
  },
  {
    path:'/splash',
    name:'splash',
    component: Splash
  },


  {
    path:'/wizard',
    name:'wizard',
    component: Wizard
  },

  {
    path:'/creativeMarket',
    name:'creativeMarket',
    component: CreativeMarket,
    // children: [
    //   {
    //     path:'/marketList',
    //     name:'marketList',
    //     component: MarketList
    //   },
    // ]
  },

  {
    path:'/process',
    name:'process',
    component:InviteProcess,
  },
  {
    path:'/nextProcess',
    name:'nextProcess',
    component:NextProcess,
  }
]
// if(!usePlat('client')){
//   console.log('进行修正')
//   let main=routes.findIndex(item=>{
//     if(item.path==='/'){
//       return true
//     }
//   })
//   routes[main].path='/'
//   routes[main].name='start'
//   routes[main].component=Home
//   console.log(routes,'修正后')
// }
export default routes
