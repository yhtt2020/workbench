

import Lock from '../page/Lock.vue'
import Power from '../page/Power.vue'

import Gallery from '../page/Gallery.vue'
import Wizard from '../page/Wizard.vue'




//应用
import TomatoStart from '../page/app/tomato/TomatoStart.vue'
import Tomato from '../page/app/tomato/Tomato.vue'

import My from '../page/gallery/My.vue'


//设置

import Bing from '../page/gallery/Bing.vue'
import Lively from '../page/gallery/Lively.vue'
import Wallheaven from '../page/gallery/Wallheaven.vue'
import PapersSetting from '../page/gallery/Setting.vue'
import PickingPaper from '../page/gallery/Picking.vue'
import index from './index'

const routes = [
  ...index,
  {
    path: '/lock',
    name: 'lock',
    component: Lock,
    children: [

    ]
  },
  {
    path: '/gallery',
    name: 'gallery',
    component: Gallery,
    children: [
      {
        path:'/bing',
        name:'bing',
        component:Bing
      },
      {
        path:'/lively',
        name:'lively',
        component: Lively
      },
      {
        path:'/wallheaven',
        name:'wallheaven',
        component: Wallheaven
      },
      {
        path:'/my',
        name:'my',
        component: My
      },
      {
        path:'/setting',
        name:'papersSetting',
        component: PapersSetting
      },
      {
        path:'/picking',
        name:'PickingPaper',
        component:PickingPaper
      }
    ]
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
    component: Wizard
  }


]

export default routes
