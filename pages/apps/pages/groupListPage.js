groupListTpl=`
<div style="width: 100%">
  <template v-if=" uid > 0">
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
            <GroupListComp :myGroups="myGroups" v-if="this.myGroups.length > 0"></GroupListComp>
            <template v-else>
              <a-empty :description="false"/>
            </template>
          </div>
        </template>
      </a-layout-content>
    </a-layout>
  </template>
  <template v-else>
    <a-result status="403" title="需云端登录" sub-title="前往登录，解锁团队云端功能。">
      <template #extra>
        <a-button type="primary" @click="Login">
          前往登录
        </a-button>
      </template>
    </a-result>
  </template>
</div>
  `
const GroupListComp = require('../comp/groupListComp.js')
const { api } = require('../../../server-config')
const { ipcRenderer: ipc } = require('electron')

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
      uid: Number,
      myGroups:[]
    }
  },
  computed: {

  },
  async mounted () {
    await this.$store.dispatch('getCurrentUser')
    this.uid = this.$store.getters.getCurrentUser.value.uid
  },
  beforeCreate () {

  },
  methods: {
    async load(vm) {
      await this.$store.dispatch('getMyGroups')
      vm.myGroups = vm.$store.getters.getMyGroups
    },
    Login() {
      //location.href = api.getUrl(api.API_URL.user.login)
      ipc.send('addTab',{url:api.getUrl(api.API_URL.user.login)})
    }
  }
})
