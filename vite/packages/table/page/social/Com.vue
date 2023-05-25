<template>
  <div class="ml-3" style="width: 98%;height: 100%">
    <div style="width: 200px" >
      <HorizontalPanel :navList="comList" v-model:selectType="currentTab" :height="44"
                       class="mt-3"></HorizontalPanel>
    </div>
    <vueCustomScrollbar v-if="currentTab.name==='com'" :settings="scrollbarSettings"
                        style="height:100%;padding: 15px;white-space: nowrap;width: 100%;overflow: hidden;display: flex">
      <div class="card mr-3"
           style="height: 92%;overflow: hidden ;width: 310px;vertical-align: top;display: flex;flex-direction: column">
        <div class="line-title">
          <HorizontalPanel v-if="Number(this.myTeamNo)>0" :navList="channelList" v-model:select-type="currentChannel"></HorizontalPanel>
          <div v-if="currentChannel.name==='all'">
            <span class="ml-2 mt-2" style="font-size: 14px">全网弹幕频道</span>
            <span class="mt-2" style="float: right;font-weight: normal;font-size: 0.8em">
         <icon icon="yonghu"/>
        在线：{{ online || '-' }} 人
      </span>
          </div>
          <div class="pt-2" v-else>
            <span class="ml-2" style="font-size: 14px;vertical-align: text-bottom">小队弹幕频道</span>
            <span  style="float: right;font-weight: normal;font-size: 0.8em">
              <a-avatar :size="20" class="mr-2" :src="myTeam.avatar"></a-avatar>{{myTeam.name}}

      </span>
          </div>
        </div>
        <div class="mb-3" style="flex:1;height: 0;display: flex;">
          <div>
            <vueCustomScrollbar :settings="scrollbarSettingsBarrage"
                                style="height:100%">
              <a-row class="mb-3" v-if="!hideAdmin" :gutter="[10,10]">
                <a-col :span="4">
                  <a-avatar :size="36" src="/icons/logo128.png"></a-avatar>
                </a-col>
                <a-col :span="20">
                  <div class="barrage-name">
                    弹幕管理员
                  </div>
                  <div class="barrage-content">
                    欢迎使用想天工作台弹幕功能，请文明发言。
                  </div>
                </a-col>
              </a-row>
              <a-row class="mb-5" :gutter="[10,15]">


                <template v-for="barrage in barrages">
                  <a-col :span="4">
                    <a-avatar :size="36" :src="barrage.avatar"></a-avatar>
                  </a-col>
                  <a-col :span="20">
                    <div class="barrage-name">
                      <strong>{{ barrage.nickname }}</strong> · {{ barrage.create_time_text }}
                    </div>
                    <div class="barrage-content">
                      {{ barrage.content }}
                    </div>
                    <div class="barrage-time">

                    </div>
                  </a-col>
                </template>
              </a-row>
            </vueCustomScrollbar>
          </div>
        </div>
        <div>

          <a-input-group compact>

            <a-input style="width:calc(100% - 60px)" @keyup.enter="postBarrage" v-model:value="postContent"
                     :placeholder="'发送至'+currentChannel.title+'频道'">
              <template #addonBefore>
                <span>{{ currentChannel.title }}</span>
              </template>
            </a-input>
            <a-button @click="postBarrage" type="primary">发送</a-button>
          </a-input-group>
        </div>

      </div>
      <div style="width: 280px" class="mr-3">
        <SingIn :customIndex="1" :customData="{}"></SingIn>
      </div>
      <div class="mr-3" style="display:inline-block ;width: 300px;white-space: pre-wrap;vertical-align: top">
        <div class="card mb-3" style="width: 300px">
          <div>
            反馈问题？提交Bug？进入想天浏览器官方版块。
            <div class="pointer p-1 mt-2" @click="goUrl('https://s.apps.vip/forum?id=3')">
              <a-avatar class="mr-2"
                        src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"></a-avatar>
              想天工作台
              <a-button size="small" @click="checkUpdate" style="float: right" type="primary">访问社区</a-button>
            </div>
          </div>
        </div>


      </div>


    </vueCustomScrollbar>
    <vue-custom-scrollbar v-else :settings="scrollbarSettings"
                          style="height: 90%;padding: 15px;white-space: nowrap;width: 100%;overflow: hidden">
      <div class="mr-3" style="width: 300px;display: inline-block;white-space: pre-wrap;vertical-align: top">
        <div class="card mb-3" style="width: 300px">
          <div>
            当前版本：<br>

            <div
              class="bg-indigo-500 w-1/8 inline-block px-4 py-1 text-white text-center font-extrabold rounded-full mt-3 mr-5 ml-5">
              {{ appVersion }}
            </div>
            反馈问题请附版本号

            <a-button class="mt-3" block type="primary" @click="checkUpdate">检查更新</a-button>
          </div>
        </div>
        <div class="card mb-3" style="width: 300px">
          <div class="line-title">
            成为开发者：
          </div>
          <div class="line">我们欢迎每一位前端开发者、独立软件开发者、主题设计师、浏览器插件开发者入驻。我们将对早期开发者提供各项支持与流量奖励。
            <div class="mt-5">
              <a-row :gutter="10">
                <a-col :span="12">
                  <a-button @click="openTab('https://www.yuque.com/tswork/mqon1y/hugtrbdiax9863ug')" type="primary"
                            block>开发者入驻
                  </a-button>
                </a-col>
                <a-col :span="12">
                  <a-button @click="openTab('https://www.yuque.com/tswork/mqon1y/ldt3ll8lqoedpo07')" block>前端实习
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </div>
      <div style="height: 100%;display: inline-block">
        <div class="line font-bold text-white">更新日志：</div>
        <vuuri v-model="updateLog" style="height: 100%">
          <template #item="{ item }">
            <div class="card mb-3 " style="width: 400px;background: rgba(13,62,227,0.8);color:white;height: auto">
              <div class="line-title">
                {{ item.name }} 更新内容
              </div>
              <div class="line">
                <div v-for="(li,index) in item.list">
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
import SingIn from '../../components/homeWidgets/SignIn.vue'
import { teamStore } from '../../store/team'
import { mapState ,mapActions } from 'pinia'

export default {
  name: 'Com',
  components: { SingIn, VueCustomScrollbar, HorizontalPanel, GradePanel, vuuri },
  data () {
    return {
      channelList: [
        {
          title: '全网',
          name: 'all'
        }, {
          title: '小队',
          name: 'team'
        }
      ],
      currentChannel: {
        name: 'all',
        title:'全网'
      },
      comList: [
        { title: '社区', name: 'com' },
        { title: '版本更新', name: 'update' },
      ],
      currentTab: { name: 'com' },
      barragesAll: [],
      barragesTeam: [],
      sendToChannel: {
        name: 'all',
        title: '全网'
      },
      postContent: '',
      scrollbarSettingsBarrage: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
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
    ...mapState(teamStore, ['my','myTeamNo','myTeam']),
    barrages () {
      if (this.currentChannel.name === 'all') {
        return this.barragesAll
      } else {
        return this.barragesTeam
      }
    }
  },
  mounted () {
    this.CONST = tsbApi.barrage.CONST
    this.loadBarrages().then()
    this.loadTeamBarrage().then()
    this.getOnline().then()
    this.appVersion = tsbApi.runtime.appVersion
    axios.get('https://a.apps.vip/download/updateLog.json?t=' + Date.now()).then(data => {
      this.updateLog = data.data
    })
  },
  methods: {
    ...mapActions(teamStore,['updateMy']),
    checkUpdate () {
      ipc.send('checkUpdate')
    },
    openTab (url) {
      ipc.send('addTab', { url: url })
    },
    async loadTeamBarrage () {
      console.log(this.my, 'wode小组')
      await this.updateMy()
      if (this.myTeamNo) {
        console.log(this.myTeamNo,'')
        tsbApi.barrage.getList(this.CONST.CHANNEL.TEAM, this.myTeamNo).then(rs => {
          if (rs.status) {
            rs.data.forEach(item => {
              item.create_time_text = tsbApi.util.friendlyDate(item.create_time)
            })
            this.barragesTeam = rs.data

          }
        })
      } else {
        this.barragesTeam = []
      }
    },
    async loadBarrages () {
      tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, 'table').then(rs => {
        if (rs.status) {
          rs.data.forEach(item => {
            item.create_time_text = tsbApi.util.friendlyDate(item.create_time)
          })
          this.barragesAll = rs.data

        }
      })
    },
    async getOnline () {
      axios.get(Server.baseUrl + '/app/open/usageStats/online').then((rs) => {
        if (rs.data.code === 1000) {
          this.online = rs.data.data
        }
      })
    },
    async postBarrage () {
      if (!this.postContent) {
        message.error('请输入弹幕内容')
        return
      } else {
        let channelType=this.CONST.CHANNEL.PUBLIC
        let pageUrl='table'
        if(this.currentChannel.name!=='all'){
          channelType=this.CONST.CHANNEL.TEAM
          pageUrl=this.myTeamNo
        }

        console.log(channelType,pageUrl)
        let data = {
          channel_type:channelType ,
          content: this.postContent,
          page_url: String(pageUrl),
        }
        console.log('添加 的daa',data)
        let rs = await tsbApi.barrage.add(data)
        if (rs.status) {
          this.postContent = ''
          if (!this.hideAdmin) {
            this.hideAdmin = true
          }
          message.success('弹幕发送成功')
          setTimeout(() => {
           window.loadBarrage().then()
          }, 1000)
        } else {
          console.error(rs)
          message.error('弹幕发送失败，失败原因：' + rs)
        }
      }
    },
    goUrl (url) {
      ipc.send('addTab', { url: url })
    },
  }
}
</script>

<style scoped>
.card {
  background: #252525;
}

.barrage-name {
  font-size: 0.8em;
}

.barrage-content {
  color: white;
  white-space: pre-wrap;
  word-break: break-all;
}

.barrage-time {
  font-size: 0.8em;
}

</style>
