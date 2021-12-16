const groupNavsTpl=`
<div style="width: 100%">
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <template>
        <div>
          <a-page-header style="border: none;" title="云端团队导航列表" sub-title="我的云端团队导航列表">
          </a-page-header>
          <br />
        </div>
      </template>
    </a-layout-header>
    <a-layout-content>
      <template>
        <div style="background-color: white; padding: 20px;" class="group-apps">
          <CloudNavsComp :Clouds="groupClouds" v-if="this.groupClouds.length > 0"></CloudNavsComp>
          <template v-else>
            <a-empty :description="false"/>
          </template>
        </div>
      </template>
    </a-layout-content>
  </a-layout>
</div>
`

const CloudNavsComp = require('../comp/cloudNavsComp.js')

module.exports = Vue.component('group-navs-page', {
  name: 'group-navs-page',
  template: groupNavsTpl,
  component: {CloudNavsComp},
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.groupClouds = []
      vm.groupId = Number(to.query.id)
      await vm.load(vm, to.query.id);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    this.groupId = Number(to.query.id)
    await this.load(this, to.query.id);
  },
  data () {
    return {
      groupClouds:[],
      groupId: Number
    }
  },
  computed: {

  },
  mounted () {
  },
  beforeCreate () {

  },
  methods: {
    async load(vm, params) {
      await this.$store.dispatch('getAppGroupNavs', params)
      vm.groupClouds = vm.$store.getters.getAppGroupNavs
    }
  }
})
