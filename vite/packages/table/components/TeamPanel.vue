<template>
  <div class="flex s-bg rounded-xl" :style="{height:showDetail?'100%':'auto'}" style="overflow: hidden">
    <transition name="fade">
      <div v-if="showDetail && teamDetail"
           style="width:300px;height: 100%;background: rgba(0,0,0,0.09);position: relative">
        <div @click="closeDetail" class="p-2 rounded-md inline-block m-2 pointer bg-mask"
             style="position:absolute;right:0;width: 2.8em;text-align: center;z-index: 99">
          <Icon icon="guanbi" style="font-size: 1.2em"></Icon>
        </div>
        <a-row :gutter="20">
          <a-col>
            <a-avatar class="mt-3 ml-3" :size="50" shape="square" :src="team.avatar"></a-avatar>
          </a-col>
          <a-col>
            <div class="mt-3 mb-1 font-bold truncate">{{ team.name }}</div>
            <div class="rounded-md px-2 bg-mask inline-block font-bold"># {{ team.no }}</div>
          </a-col>
        </a-row>
        <div class="bg-mask rounded-xl m-3 p-3" style="line-height: 2">
          升级效率：<strong>{{ effect }} %</strong>
          <icon icon="tishi-xianxing"></icon>
          暂未开放加速<br>
          小队等级：1级<br>
          全网排名：-<br>
          升级剩余时长：-<br>
          累计在线时长：-
        </div>
        <div class="bg-mask p-3 m-3 rounded-xl">
          <icon icon="tishi-xianxing"></icon>
          小队功能正在开发中，暂时还未开放组队升级加速，敬请期待。显示升级效率为理论加速值，功能上线后即可生效。
        </div>
        <div style="position: absolute;bottom: 0">
          <a-row class="m-5">
            <a-col>
              <div class="rounded-xl bg-mask px-6 py-3 pointer " @click="exit">
                <icon icon="guanbi2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                退出小队
              </div>
            </a-col>
            <a-col>
            </a-col>
          </a-row>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showDetail && userDetail"
           style="width:300px;height: 100%;background: rgba(0,0,0,0.09);position: relative">
        <div @click="closeDetail" class="p-2 rounded-md inline-block m-2 pointer bg-mask"
             style="position:absolute;right:0;width: 2.8em;text-align: center;z-index: 99">
          <Icon icon="guanbi" style="font-size: 1.2em"></Icon>
        </div>
        <vue-custom-scrollbar :settings="outerSettings"
                              style="position:relative;height:calc(100% - 60px);  ">
          <div class="mb-10">
            <UserDetail :key="userInfoKey" :userInfo="showUserInfo"></UserDetail>
          </div>
        </vue-custom-scrollbar>

        <div style="position: absolute;bottom: 0;left: 15px">
          <a-row class="m-5 mb-2" :gutter="10">
            <a-col>
              <div class="rounded-xl bg-mask px-6 py-3 pointer " @click="exit">
                <icon icon="tianjia2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                加为好友
              </div>
            </a-col>
            <a-col>
              <a-col>
                <div class="rounded-xl bg-mask px-6 py-3 pointer " @click="exit">
                  <icon icon="shanchu" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                  移出小队
                </div>
              </a-col>
            </a-col>
          </a-row>
        </div>
      </div>

    </transition>
    <div class="common-panel  flex" style="width: 80px;flex-direction: column">
      <div v-if="!teamDetail" @click="showTeamDetail" class="p-2 pt-2 p-3 truncate font-large text-center pointer"
           style="font-size: 1.1em">
        <div>
          <a-avatar :size="50" shape="square" :src="team.avatar"></a-avatar>
        </div>
      </div>
      <div v-if="teamDetail" class="text-center">小队成员</div>
      <a-divider style="margin-top: 10px;margin-bottom: 10px"></a-divider>
      <vue-custom-scrollbar :settings="outerSettings"
                            style="position:relative;height:100%;  ">
        <div @click="showUserDetail(teamLeader.userInfo)" :class="{'active':this.showUserInfo===teamLeader.userInfo}" class="text-center mb-5 mt-5 pointer pt-2"
             v-if="teamLeader.userInfo">
          <a-avatar :size="50" :src="teamLeader.userInfo.avatar"></a-avatar>
          <div v-if="showDetail" class="p-2 truncate" :title="teamLeader.userInfo.nickname">
            {{ teamLeader.userInfo.nickname }}
          </div>
        </div>
        <div @click="showUserDetail(user.userInfo)" class="text-center  mb-5 pointer  pt-2" :class="{'active':this.showUserInfo===user.userInfo}"  v-for="user in teamMembers">
          <a-avatar :size="50" :src="user.userInfo.avatar"></a-avatar>
          <div v-if="showDetail" class="p-2 truncate" :title=" user.userInfo.nickname">{{
              user.userInfo.nickname
            }}
          </div>
        </div>
        <div class="text-center pb-2" title="邀请"
             v-if="team.leader===userInfo.uid && team.member_count < team.member_limit">
          <a-avatar :size="50">
            <PlusOutlined/>
          </a-avatar>
        </div>
      </vue-custom-scrollbar>
    </div>
  </div>

</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { teamStore } from '../store/team'
import { mapWritableState, mapActions, mapState } from 'pinia'
import { appStore } from '../store'
import { Modal } from 'ant-design-vue'
import UserDetail from './team/UserDetail.vue'

export default {
  name: 'TeamPanel',
  components: { UserDetail, PlusOutlined },
  computed: {
    ...mapWritableState(teamStore, ['team', 'teamVisible', 'teamLeader', 'teamMembers']),
    ...mapState(appStore, ['userInfo']),
    effect () {
      return (this.team.member_count - 1) * 5 + 100
    }
  },
  data () {
    return {
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      userDetail: false,
      showDetail: false,
      teamDetail: false,
      showUid: 0,
      showUserInfo: {},
      timer: null,//用于定期刷新队伍信息
      userInfoKey:Date.now()
    }
  },
  mounted () {
    if (this.team.status) {
      this.updateTeamShip(this.team.no).then()
      this.timer = setInterval(() => {
        console.info('定期更新小队信息')
        this.updateTeamShip(this.team.no)
      }, 30000)
    }
  },
  unmounted () {
    clearInterval(this.timer)
  },

  methods: {
    ...mapActions(teamStore, ['updateTeamShip']),
    showUserDetail (userInfo) {
      this.showUid = userInfo.uid
      this.showUserInfo = userInfo
      this.userInfoKey=Date.now()
      this.teamDetail = false
      setTimeout(() => {
        this.userDetail = true
        this.showDetail = true
      },0)
    },
    closeDetail () {
      this.userDetail = false

      this.teamDetail = false
      this.showDetail = false
      this.showUserInfo={}
    },
    showTeamDetail () {
      this.userDetail = false
      setTimeout(() => {
        this.teamDetail = true
        this.showDetail = true
      })

    },
    cleanTeam () {
      this.teamVisible = false
      this.team = {
        status: false
      }
    },
    exit () {
      Modal.info({
        content: '此操作暂不支持',
        centered: true,

      })
      // this.team = {
      //   status: false
      // }
      // this.teamVisible = false
    }
  }

}
</script>

<style scoped lang="scss">
:deep(.bg-mask) {
  background: rgba(0, 0, 0, 0.2);
}
.active{
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;

}
</style>
