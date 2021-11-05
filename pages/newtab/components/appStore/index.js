Vue.component('app-dialog', {
  props: {
    //dialog显示
    adVisible: {
      type: Boolean,
      default: false
    },
    //所有应用数据
    allApps: {
      type: Array,
    }
  },
	template:'#appstore'
})
