import ShortcutIndex from './page/Index.vue'
import SchemeList from './page/SchemeList.vue'
import ShortcutKey from './page/ShortcutKey.vue'
import ShareKey from "./page/ShareKey.vue"
import SchemeDetail from './page/SchemeDetail.vue'
export default {
  path: '/shortcutKey',
  name: 'shortcutIndex',
  component: ShortcutIndex,
  children: [
    {
      path:'',
      name:'shortcut',
      component: ShortcutKey,
    },
    {
      path: '',
      name: 'schemeList',
      component: SchemeList,
    },
    {
      path:'/shareKey',
      name:'shareKey',
      component: ShareKey
    },
    {
      path:'/schemeDetail',
      name:'schemeDetail',
      component: SchemeDetail
    }
  ]
}
