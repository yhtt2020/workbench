import ShortcutIndex from './page/Index.vue'
import SchemeList from './page/SchemeList.vue'
import ShortcutKey from './page/ShortcutKey.vue'
import ShareKey from "./page/ShareKey.vue"
import SchemeDetail from './page/SchemeDetail.vue'
import Settings from './page/Settings.vue'
import EditApp from './page/EditApp.vue'


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
