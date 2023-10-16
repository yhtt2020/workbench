import ShortcutIndex from './page/Index.vue'
import SchemeList from './components/SchemeList.vue'
import ShortcutKey from './page/ShortcutKey.vue'
import ShareKey from "./page/EditScheme.vue"
import SchemeDetail from './page/SchemeDetail.vue'
import Settings from './page/Settings.vue'
import EditApp from './page/EditApp.vue'
import CreativeMarket from './page/CreativeMarket.vue'

export default {
  path: '/shortcutKey',
  name: 'shortcutIndex',
  component: ShortcutIndex,
  redirect:'/schemeIndex',
  meta:{
    tab1:'work',
    tab2:'shortcut'
  },
  children: [
    {
      path: '',
      name: 'shortcut',
      component: ShortcutKey,
      meta:{
        tab1:'work',
        tab2:'shortcut'
      }
    },
    {
      path: '',
      name: 'shortcutStore',
      component: CreativeMarket,
      meta:{
        tab1:'work',
        tab2:'shortcut',
        tab3:'store'
      }
    },
    {
      path:'/editApp',
      name:'editApp',
      component: EditApp,
      meta:{
        tab1:'work',
        tab2:'shortcut'
      }
    },
    {
      path: '/schemeIndex',
      name: 'schemeIndex',
      component: SchemeList,
      meta:{
        tab1:'work',
        tab2:'shortcut',
        tab3:'schemeIndex'
      }
    },
    {
      path: '/schemeList',
      name: 'schemeList',
      component: SchemeList,
      meta:{
        tab1:'work',
        tab2:'shortcut',
        tab3:'exeName_{exeName}'
      }
    },
    {
      path: '/shareKey',
      name: 'shareKey',
      component: ShareKey,
      meta:{
        tab1:'work',
        tab2:'shortcut'
      }
    },
    {
      path: '/schemeDetail',
      name: 'schemeDetail',
      component: SchemeDetail,
      meta:{
        tab1:'work',
        tab2:'shortcut'
      }
    }, {
      path: '/settings',
      name: 'shortcutKeySettings',
      component: Settings,
      meta:{
        tab1:'work',
        tab2:'shortcut'
      }
    }
  ]
}
