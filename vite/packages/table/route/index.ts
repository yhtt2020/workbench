import BarrageSetting from '../page/settings/BarrageSetting.vue'
import Deck from '../page/Deck.vue'
import Setting from '../page/Setting.vue'
import Weather from '../page/app/Weather.vue'
import Watch from '../page/app/watch/Index.vue'
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
import AddCard from "../page/app/card/AddCard.vue"
import SetupCard from "../page/app/card/SetupCard.vue"
import Sensor from '../page/Sensor.vue'
import Dashboard from '../page/app/watch/Dashboard.vue'
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
      path:'/watch',
      name:'watch',
      component: Watch
    },
    {
      path:'/dashboard',
      name:'dashboard',
      component: Dashboard
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
      path:'/sensor',
      name:'sensor',
      component: Sensor
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
    },
  ]
}, {
  path: "/addCard",
  name: "addCard",
  component: AddCard,
},
  {
    path: "/setting",
    name: "addCardSetting",
    component: SetupCard,
  },
]
