const cloudNavsTpl=`
<div style="width: 100%">
  <template v-if=" this.$store.getters.getCurrentUser.value.uid > 0">
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
            <CloudNavsComp :Clouds="myClouds" v-if="this.myClouds.length > 0"></CloudNavsComp>
            <template v-else>
              <a-empty :description="false"/>
            </template>
          </div>
        </template>
      </a-layout-content>
    </a-layout>
  </template>
  <template v-else>
    <a-result status="403" title="需云端登录" sub-title="前往登录，解锁个人云端功能。">
      <template #extra>
        <a-button type="primary" @click="Login">
          前往登录
        </a-button>
      </template>
    </a-result>
  </template>
</div>
`

const CloudNavsComp = require('../comp/cloudNavsComp.js')
const { api } = require('../../../server-config')

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
  async mounted () {
    await this.$store.dispatch('getCurrentUser')
  },
  beforeCreate () {

  },
  methods: {
    async load(vm) {
      await this.$store.dispatch('getAppUserNavs')
      vm.myClouds = vm.$store.getters.getAppUserNavs
    },
    Login() {
      //location.href = api.getUrl(api.API_URL.user.login)
      window.open(api.getUrl(api.API_URL.user.login))
    }
  }
})
