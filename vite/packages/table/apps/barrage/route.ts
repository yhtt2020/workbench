import BarrageIndex from './page/Index.vue'
import Barrage from './page/Barrage.vue'
export default {
  path: '/barrage',
  name: 'barrageIndex',
  component: BarrageIndex,
  children: [
    {
      path: '/',
      name: 'barrage',
      component: Barrage,
      meta:{
        tab1:'community',
        tab2:'barrage'
      }
    }
  ]
}
