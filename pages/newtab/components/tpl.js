const tplTpl = `
<div>
</div>
  `
Vue.component('tpl', {
  template: tplTpl,
  name: 'tpl',
  props: [],
  components: {},
  data () {
    return {
      mySearch: [],
    }
  },
  computed: {},
  mounted () {

  },
  methods: {
    chooseSearch (id, index) {
    }
  }
  ,
  destroyed () {
  }
})
