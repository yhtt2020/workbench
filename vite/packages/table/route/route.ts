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

const routes = [
  ...main,
  //...index,
  {
    path: '/lock',
    name: 'lock',
    component: Lock,
    children: [
    ]
  },
  {
    path:'',
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

export default routes
