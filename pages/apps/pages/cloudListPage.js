const cloudListTpl=`
<div style="width: 100%">
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <template>
        <div>
          <a-page-header style="border: none;" title="云端列表" sub-title="我的全部云端导航列表">
          </a-page-header>
          <br />
        </div>
      </template>
    </a-layout-header>
    <a-layout-content>
      <template>
        <div style="background-color: white; padding: 20px;" class="group-apps">
          <clouds :myClouds="myClouds"></clouds>
        </div>
      </template>
    </a-layout-content>
  </a-layout>
</div>
`

require('../comp/clouds.js')

module.exports = Vue.component('cloud-list-page', {
  name: 'cloud-list-page',
  template: cloudListTpl,
  component: {clouds:"clouds"},
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
