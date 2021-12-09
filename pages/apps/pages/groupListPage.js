groupListTpl=`
<div style="width: 100%">
  <a-layout>
    <a-layout-header style="background: #fff; padding: 0">
      <template>
        <div>
          <a-page-header style="border: none;" title="团队导航" sub-title="我的全部团队">
          </a-page-header>
          <br />
        </div>
      </template>
    </a-layout-header>
    <a-layout-content>
      <template>
        <div style="background-color: white; padding: 20px;" class="group-apps">
          <GroupListComp :myGroups="myGroups"></GroupListComp>
        </div>
      </template>
    </a-layout-content>
  </a-layout>
</div>
  `
const GroupListComp = require('../comp/groupListComp.js')

module.exports = Vue.component('group-list-page', {
  name: 'group-list-page',
  template: groupListTpl,
  component: {GroupListComp},
  beforeRouteEnter(to, from, next) {
    next(async vm => {
      vm.myGroups = []
      await vm.load(vm);
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.load(this);
  },
  data () {
    return {
      myGroups:[]
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
      await this.$store.dispatch('getMyGroups')
      vm.myGroups = vm.$store.getters.getMyGroups
    }

  }
})
