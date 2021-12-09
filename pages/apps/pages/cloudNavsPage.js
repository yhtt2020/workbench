const cloudNavsTpl=`
<div style="width: 100%">
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <template>
        <div>
          <a-page-header style="border: none;" title="云端个人导航列表" sub-title="我的全部云端导航列表">
          </a-page-header>
          <br />
        </div>
      </template>
    </a-layout-header>
    <a-layout-content>
      <template>
        <div style="background-color: white; padding: 20px;" class="group-apps">
          <CloudNavsComp :Clouds="myClouds"></CloudNavsComp>
        </div>
      </template>
    </a-layout-content>
  </a-layout>
</div>
`

const CloudNavsComp = require('../comp/cloudNavsComp.js')

module.exports = Vue.component('cloud-navs-page', {
  name: 'cloud-navs-page',
  template: cloudNavsTpl,
  component: {CloudNavsComp},
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.myClouds = []
      await vm.load(vm);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.load(this);
  },
  data () {
    return {
      myClouds:[]
    }
  },
  computed: {

  },
  mounted () {

  },
  beforeCreate () {

  },
  methods: {
    async load(vm) {
      await this.$store.dispatch('getAppUserNavs')
      vm.myClouds = vm.$store.getters.getAppUserNavs
    }
  }
})
