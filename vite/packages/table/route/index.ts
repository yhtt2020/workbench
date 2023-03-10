import BarrageSetting from '../page/settings/BarrageSetting.vue'
import Deck from '../page/Deck.vue'
import Setting from '../page/Setting.vue'
import Weather from '../page/app/Weather.vue'
import BiliIndex from '../page/app/bili/Index.vue'
import LevelDetail from '../page/LevelDetail.vue'
import BasicSetting from '../page/settings/Basic.vue'
import Key from '../page/settings/Key.vue'
import Apps from '../page/Apps.vue'
import AppFrame from '../page/AppFrame.vue'
import Music from '../page/Music.vue'
import Status from '../page/Status.vue'
import Index from '../page/Index.vue'
import Home from '../page/Home.vue'
import Browser from '../page/settings/Browser.vue'
export default   [{
  path: '',
  name: 'index',
  component: Index,
  children: [
    {
      path: '',
      name: 'home',
      component: Home,
    },
    {
      path: '/app',
      name: 'app',
      component: AppFrame,
      children:[

      ]
    },
    {
      path:'/bili',
      name:'bili',
      component: BiliIndex
    },
    {
      path:'/levelDetail',
      name:'levelDetail',
      component: LevelDetail
    },
    {
      path: '/apps',
      name: 'apps',
      component: Apps

    },
    {
      path:'/barrage',
      name:'barrageSetting',
      component: BarrageSetting
    },
    {
      path: '/music',
      name: 'music',
      component: Music
    },
    {
      path:'/weather',
      name:'weather',
      component: Weather
    },
    {
      path:'/deck',
      component: Deck
    },{
      path:'/status',
      name:'status',
      component: Status
    },
    {
      path:'/setting',
      name:'setting',
      component: Setting,

    },
    {
      path:'/basicSetting',
      name:'basicSetting',
      component: BasicSetting,
      children: [
        {
          path:'',
          name:'key',
          component:Key
        },
        {
          path:'/browser',
          name:'browser',
          component:Browser
        },
      ]
    }
  ]
}]
