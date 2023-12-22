<template>
  <div class="ml-3" style="width: 98%;height: 100%">
    <vue-custom-scrollbar :settings="scrollbarSettings"
                          style="height: 100%;padding: 15px;white-space: nowrap;width: 100%;overflow: hidden">
      <div style="height: 100%;display: inline-block;">
        <div class="mr-3" style="width: 300px;display: inline-block;white-space: pre-wrap;vertical-align: top">
          <div style="width: 280px" class="mr-3">
            <SingIn :customIndex="1" :customData="{}" :rightIcon="false"></SingIn>
          </div>

        </div>
        <div class="mr-3" style="display:inline-block ;width: 300px;white-space: pre-wrap;vertical-align: top;">
          <div class="card mb-3"
               style="width: 300px;white-space: pre-wrap; background: var(--primary-bg); color: var(--primary-text)">
            <div>
              当前版本：<br>

              <div
                class="bg-indigo-500 w-1/8 inline-block px-4 py-1 text-white text-center font-extrabold rounded-full mt-3 mr-5 ml-5">
                {{ appVersion }}
              </div>
              反馈问题请附版本号

              <a-button class="mt-3" block type="primary" @click="checkUpdate" style="color:var(--active-text)">检查更新
              </a-button>
            </div>
          </div>
<!--          <div class="card mb-3"-->
<!--               style="width: 300px;background: var(&#45;&#45;primary-bg);color: var(&#45;&#45;primary-text);box-shadow: 0px 0px 10px 0px rgb(0 0 0 / 50%);">-->
<!--            <div>-->
<!--              反馈问题？提交Bug？进入想天浏览器官方版块。-->
<!--              <div class="pointer p-1 mt-2" @click="goUrl('https://s.apps.vip/forum?id=3')">-->
<!--                <a-avatar class="mr-2"-->
<!--                          src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"></a-avatar>-->
<!--                天天工作台-->
<!--                <a-button size="small" @click="checkUpdate" style="float: right" type="primary">访问社区</a-button>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
          <div class="card mb-3" style="width: 300px;background: var(--primary-bg); color: var(--primary-text)">
            <div class="line-title">
              成为开发者：
            </div>
            <div class="line">我们欢迎每一位前端开发者、独立软件开发者、主题设计师、浏览器插件开发者入驻。我们将对早期开发者提供各项支持与流量奖励。
              <div class="mt-5">
                <a-row :gutter="10">
                  <a-col :span="12">
                    <a-button style="color:var(--active-text)"
                              @click="openTab('https://www.yuque.com/tswork/mqon1y/hugtrbdiax9863ug')" type="primary"
                              block>开发者入驻
                    </a-button>
                  </a-col>
                  <a-col :span="12">
                    <a-button class="xt-bg-2 xt-text"
                              @click="openTab('https://www.yuque.com/tswork/mqon1y/ldt3ll8lqoedpo07')" block>前端实习
                    </a-button>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>

        </div>


      </div>
      <div style="height: 100%;display: inline-block;">
        <div class="line font-bold text-white" style="color: var(--primary-text)">更新日志：</div>
        <vuuri :options="{
          layout:{
             horizontal: true,
          }
        }"  v-model="updateLog" style="height: 100%">
          <template #item="{ item }">
            <div class="card " style="width: 400px; color:white;height: auto">
              <div class="line-title">
                {{ item.name }} 更新内容
              </div>
              <div class="line">
                <div class="line-text" v-for="(li, index) in item.list">
                  {{ index + 1 }}.{{ li }}
                </div>
              </div>
              <div class="text-right">
                更新日期： {{ item.date }}
              </div>
            </div>
          </template>
        </vuuri>

      </div>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import GradePanel from '../../components/comp/GradePanel.vue'
import { message } from 'ant-design-vue'
import axios from 'axios'
import { Server } from '../../consts'
import vuuri from '../../components/vuuriHome/Vuuri.vue'
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import VueCustomScrollbar from '../../../../src/components/vue-scrollbar.vue'
import SingIn from '../../components/widgets/SignIn.vue'
import { teamStore } from '../../store/team'
import { mapState, mapActions } from 'pinia'
import browser from '../../js/common/browser'
import { appStore } from '../../store'
import FrameAvatar from '../../components/avatar/FrameAvatar.vue'

export default {
  name: 'Com',
  components: { FrameAvatar, SingIn, VueCustomScrollbar, HorizontalPanel, GradePanel, vuuri },
  data () {
    return {

      currentTab: { name: 'com' },
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true
      },
      online: 0,
      appVersion: '',
      updateLog: [],
    }
  },
  computed: {
    ...mapState(teamStore, ['my', 'myTeamNo', 'myTeam']),
  },
  mounted () {
    this.appVersion = tsbApi.runtime.appVersion
    axios.get('https://a.apps.vip/download/updateLog.json?t=' + Date.now()).then(data => {
      this.updateLog = data.data
    })
  },
  methods: {
    ...mapActions(appStore, ['showUserCard']),

    ...mapActions(teamStore, ['updateMy']),
    checkUpdate () {
      ipc.send('checkUpdate')
    },
    openTab (url) {
      browser.openInInner(url)
    },
    async getOnline () {
      axios.get(Server.baseUrl + '/app/open/usageStats/online').then((rs) => {
        if (rs.data.code === 1000) {
          this.online = rs.data.data
        }
      })
    },
    goUrl (url) {
      browser.openInInner(url)
    },
  }
}
</script>

<style scoped>
.card {
  background:var(--active-bg);
}
.line-text{
  word-break: break-all;
  white-space: pre-wrap;
}
</style>
