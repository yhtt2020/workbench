import Lock from '../page/Lock.vue'
import Power from '../page/Power.vue'
import Wizard from '../page/Wizard.vue'
import main from './main'

//设置
import Splash from '../page/Splash.vue'
//import index from './index'
// 快捷键
import CreativeMarket from "../apps/shortcutKey/CreativeMarket.vue"
import MarketList from "../apps/shortcutKey/MarketList.vue"

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
    path: '/power',
    name: 'power',
    component: Power

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
  }
]

export default routes
