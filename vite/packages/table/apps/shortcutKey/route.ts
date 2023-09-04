import ShortcutIndex from './Index.vue'
import SchemeList from './page/SchemeList.vue'
import ShortcutKey from './ShortcutKey.vue'
import ShareKey from "./page/ShareKey.vue"
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
  ]
}
