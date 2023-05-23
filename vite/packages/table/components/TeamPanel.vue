<template>
  <div :class="{'fix':showDetail}" class="flex s-bg rounded-lg" :style="{height:showDetail?'100%':'auto'}"
       style="overflow: hidden">
    <transition name="fade">
      <div v-if="earningsShow" class="p-4"
           style="width:300px;height: 100%;background: rgba(0,0,0,0.09);position: relative">
        <TeamDevote :teamLeader="teamLeader" :teamMembers="teamMembers" :team="team"></TeamDevote>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showDetail && (teamDetail||showBarrage)"
           style="width:300px;height: 100%;background: rgba(0,0,0,0.09);position: relative;display: flex;flex-direction: column">
        <div @click="closeDetail" class="p-2 rounded-md inline-block m-2 pointer bg-mask"
             style="position:absolute;right:0;width: 2.8em;text-align: center;z-index: 99">
          <Icon icon="guanbi" style="font-size: 1.2em"></Icon>
        </div>
        <a-row class="pointer" @click="showTeamDetail" :gutter="20">
          <a-col>
            <a-avatar class="mt-3 ml-3" :size="50" shape="square" :src="team.avatar"></a-avatar>
          </a-col>
          <a-col>
            <div class="mt-3 mb-1 font-bold truncate">{{ team.name }}</div>
            <div class="rounded-md px-2 bg-mask inline-block font-bold"># {{ team.no }}</div>
          </a-col>
        </a-row>
        <div v-if="showDetail && teamDetail">
          <TeamDetail @onReceiveTeamEarnings="receiveTeamEarnings" :online="online" :effect="effect" :team="team"
                      :teamLeader="teamLeader"></TeamDetail>
        </div>
        <div style="flex: 1;height:0" v-if="showBarrage ">
          <BarragePanel :defaultChannel="'team'"></BarragePanel>
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
            <UserDetail :memberInfo="showUserMemberInfo" :key="userInfoKey" :userInfo="showUserInfo"></UserDetail>
          </div>
        </vue-custom-scrollbar>

        <div style="position: absolute;bottom: 0;left: 15px">
          <a-row class="m-5 mb-2" :gutter="10">
            <a-col v-if="this.showUserInfo.uid!==userInfo.uid">
              <div class="rounded-lg bg-mask px-6 py-3 pointer " @click="exit">
                <icon icon="tianjia2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                加为好友
              </div>
            </a-col>
            <a-col>
              <a-col>
                <div class="rounded-lg bg-mask px-6 py-3 pointer "
                     v-if="Number(teamLeader.userInfo.uid)===Number(userInfo.uid) && Number(this.showUserInfo.uid)!==Number(userInfo.uid)"
                     @click="kick(this.showUserInfo.uid)">
                  <icon icon="shanchu" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                  移出小队
                </div>
              </a-col>
            </a-col>
          </a-row>
        </div>
      </div>
    </transition>


    <div class="common-panel  flex" style="width: 80px;flex-direction: column;padding-bottom: 0">
      <div v-if="!teamDetail" @click="showBarragePanel"
           class="p-2 pt-2 p-3 truncate font-large text-center pointer"
           style="font-size: 1.1em">
        <div>
          <a-avatar :size="50" shape="square" :src="team.avatar"></a-avatar>
        </div>
      </div>
      <div v-if="teamDetail" class="text-center">小队成员</div>
      <a-divider style="margin-top: 10px;margin-bottom: 10px"></a-divider>
      <vue-custom-scrollbar :settings="outerSettings"
                            style="position:relative;height:100%;  ">
        <div @click="showUserDetail(teamLeader.userInfo,teamLeader)"
             :class="{'active':this.showUserInfo===teamLeader.userInfo}" class="text-center mb-3 mt-2 pointer pt-2"
             v-if="teamLeader.userInfo">

          <UserAvatar :online="teamLeader.online" :tag="teamLeader.userInfo.uid===userInfo.uid?'我':'队长'"
                      :avatar="teamLeader.userInfo.avatar"></UserAvatar>

          <div v-if="showDetail" class="p-2 truncate" style="font-size: 0.9em" :title="teamLeader.userInfo.nickname">
            {{ teamLeader.userInfo.nickname }}

          </div>
        </div>
        <div @click="showUserDetail(user.userInfo,user)" class="text-center  mb-3 pointer  pt-2"
             :class="{'active':this.showUserInfo===user.userInfo}" v-for="user in teamMembers">

          <UserAvatar :online="user.online" :avatar="user.userInfo.avatar"
                      :tag="user.userInfo.uid===userInfo.uid?'我':''"></UserAvatar>
          <div v-if="showDetail" class="p-2 pb-0 truncate" style="font-size: 0.9em" :title=" user.userInfo.nickname">{{
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
import UserAvatar from './small/UserAvatar.vue'
import LevelIcon from './small/LevelIcon.vue'
import HorizontalPanel from './HorizontalPanel.vue'
import TeamDevote from './team/TeamDevote.vue'
import TeamDetail from './team/TeamDetail.vue'
import TeamBarrage from './comp/TeamBarrage.vue'
import BarrageSender from './comp/BarrageSender.vue'
import BarragePanel from './comp/BarragePanel.vue'

export default {
  name: 'TeamPanel',
  components: {
    BarragePanel,
    BarrageSender,
    TeamBarrage,
    TeamDetail,
    TeamDevote,
    LevelIcon,
    UserAvatar,
    UserDetail,
    PlusOutlined,
    HorizontalPanel
  },
  computed: {
    ...mapWritableState(teamStore, ['team', 'teamVisible', 'teamLeader', 'teamMembers']),
    ...mapState(appStore, ['userInfo']),
    effect () {
      let online = this.teamLeader.online ? 1 : 0
      this.teamMembers.forEach(member => {
        if (member.online) {
          online++
        }
      })
      if (online <= 1) {
        //防止用户数量穿透
        online = 1
      }
      this.online = online

      return (online - 1) * 5 + 100
    }
  },
  data () {
    return {
      online: 0,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      userDetail: false,
      showDetail: false,
      showBarrage: true,
      teamDetail: false,
      showUid: 0,
      showUserInfo: {},
      showUserMemberInfo: {},//成员信息
      timer: null,//用于定期刷新队伍信息
      userInfoKey: Date.now(),
      earningsShow: false,

    }
  },
  mounted () {
    if (this.team.status) {
      this.updateTeamShip(this.team.no, {
        userCache: 0
      }).then()
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
    ...mapActions(teamStore, ['updateTeamShip', 'quitByNo', 'updateMy', 'closeTeam', 'updateTeam']),

    showBarragePanel () {
      this.userDetail=false
      this.showDetail = true
      this.showBarrage = true
    },
    showUserDetail (userInfo, memberInfo) {
      this.showBarrage=false
      this.showUserMemberInfo = memberInfo
      this.showUid = userInfo.uid
      this.showUserInfo = userInfo
      this.userInfoKey = Date.now()
      this.teamDetail = false
      setTimeout(() => {
        this.userDetail = true
        this.showDetail = true
      }, 0)
    },
    closeDetail () {
      this.userDetail = false
      this.teamDetail = false
      this.showDetail = false
      this.showUserInfo = {}
      this.earningsShow = false
    },
    showTeamDetail () {
      this.showBarrage=false
      this.userDetail = false
      this.updateTeam(this.team.no).then()
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
    /**踢人
     *
     * @param uid
     */
    kick (uid) {
      Modal.confirm({
        content: '将队员移出队伍后，此人将无法再为小队做出贡献，但是历史贡献记录将被保留，其再次加入队伍后可继承。',
        centered: true,
        okText: '请离',
        onOk: async () => {
          let rs = await this.quitByNo(this.team.no, uid)
          if (rs.code === 1000) {
            if (rs.data.status) {
              this.closeDetail()
              this.updateTeamShip(this.team.no).then()
              this.updateMy().then()
              Modal.info({ content: '将队员请离队伍成功', centered: true })
            } else {
              this.updateMy().then()
              Modal.error({ content: '请离失败', centered: true })
            }

          } else {
            this.updateMy().then()
            Modal.error({ content: '请离意外失败', centered: true })
          }
        }
      })
    },
    exit () {
      Modal.info({
        content: '此功能暂未完成',
        centered: true
      })
      // this.team = {
      //   status: false
      // }
      // this.teamVisible = false
    },
    // 点击领取收益弹出事件
    receiveTeamEarnings () {
      this.earningsShow = !this.earningsShow
    },

  }

}
</script>

<style scoped lang="scss">

.active {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;

}

.fix {
  position: fixed;
  max-height: 550px;
  right: 0;
  top: 50%;
  z-index: 99999;
  -webkit-app-region: no-drag;
  transform: translateY(-50%);
}

.btn-active:active {
  filter: brightness(0.8);
  background: rgba(80, 139, 254, 0.8);
}

.nav-list-container {
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}

.nav-list-container ::v-deep .s-item {
  border-radius: 6px !important;
}

.ant-divider-horizontal {
  margin: 16px 0 16px 0 !important;
}

.receive-active:active {
  filter: brightness(0.8);
  background: rgba(0, 0, 0, 0.40);
}

::v-deep .ant-avatar-image {
  position: relative;
  top: -5px;
}
</style>
