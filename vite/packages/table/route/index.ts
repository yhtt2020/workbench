import BarrageSetting from '../page/settings/BarrageSetting.vue'
import Deck from '../page/Deck.vue'
import Setting from '../page/Setting.vue'
import Weather from '../page/app/Weather.vue'
import Watch from '../page/app/watch/Index.vue'
import Social from '../page/Social.vue'
import Com from '../page/social/Com.vue'
import SocialMy from '../page/social/My.vue'
import Invite from '../page/social/Invite.vue'
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
import CPUIndex from '../page/app/CPUIndex.vue'
import Gallery from '../page/Gallery.vue'
import Bing from '../page/gallery/Bing.vue'
import Wallheaven from '../page/gallery/Wallheaven.vue'
import PickingPaper from '../page/gallery/Picking.vue'
import Lively from '../page/gallery/Lively.vue'
import PapersSetting from '../page/gallery/Setting.vue'
import My from '../page/gallery/My.vue'

export default [{
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
      children: []
    },
    {
      path: '/watch',
      name: 'watch',
      component: Watch
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/social',
      name: 'social',
      component: Social,
      children: [
        {
          path: '',
          name: 'com',
          component: Com,
        },
        {
          path: '/my',
          name: 'socialMy',
          component: SocialMy,
        },
        {
          path: '/invite',
          name: 'invite',
          component: Invite,
        }
      ]
    },
    {
      path: '/apps',
      name: 'apps',
      component: Apps

    },
    {
      path: '/barrage',
      name: 'barrageSetting',
      component: BarrageSetting
    },
    {
      path: '/music',
      name: 'music',
      component: Music
    },
    {
      path: '/weather',
      name: 'weather',
      component: Weather
    },
    {
      path: '/deck',
      component: Deck
    }, {
      path: '/status',
      name: 'status',
      component: Status
    },
    {
      path: '/sensor',
      name: 'sensor',
      component: Sensor
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,

    },
    {
      path: '/basicSetting',
      name: 'basicSetting',
      component: BasicSetting,
      children: [
        {
          path: '',
          name: 'key',
          component: Key
        },
        {
          path: '/browser',
          name: 'browser',
          component: Browser
        },
      ]
    },
    {
      path: "/setting",
      name: "addCardSetting",
      component: SetupCard,
    }, {
      path: "/CPUIndex",
      name: 'CPUIndex',
      component: CPUIndex
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: Gallery,
      children: [
        {
          path: '',
          name: 'my',
          component: My
        },
        {
          path: '',
          name: 'bing',
          component: Bing
        },
        {
          path: '',
          name: 'wallheaven',
          component: Wallheaven
        },
        {
          path: '',
          name: 'PickingPaper',
          component: PickingPaper
        },
        {
          path: '',
          name: 'lively',
          component: Lively
        },
        {
          path: '',
          name: 'papersSetting',
          component: PapersSetting
        },

      ]
    }
  ]
}
]
