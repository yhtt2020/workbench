import Lock from '../page/Lock.vue'
import Power from '../page/Power.vue'
import Wizard from '../page/Wizard.vue'
import main from './main'
//应用
import TomatoStart from '../page/app/tomato/TomatoStart.vue'
import Tomato from '../page/app/tomato/Tomato.vue'
//设置
import Splash from '../page/Splash.vue'
//import index from './index'
// 快捷键
import ShareKey from "../page/shortcutKey/ShareKey.vue"
import CreativeMarket from "../page/shortcutKey/CreativeMarket.vue"
import SoftwareNavigation from "../page/shortcutKey/MarketList.vue"

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
    path: '/TomatoStart',
    name: 'tomatoStart',
    component: TomatoStart
  },
  {
    path: '/Tomato',
    name: 'tomato',
    component: Tomato
  },
  {
    path:'/wizard',
    name:'wizard',
    component: Wizard
  },
  {
    path:'/shareKey',
    name:'shareKey',
    component: ShareKey
  },
  {
    path:'/creativeMarket',
    name:'creativeMarket',
    component: CreativeMarket,
    children: [
      {
        path:'',
        name:'softwareNavigation',
        component: SoftwareNavigation
      },
    ]
  }
]

export default routes
