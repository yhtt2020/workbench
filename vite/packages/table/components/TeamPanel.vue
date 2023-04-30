<template>
  <div :class="{'fix':showDetail}" class="flex s-bg rounded-xl" :style="{height:showDetail?'100%':'auto'}"
       style="overflow: hidden">
    <transition name="fade">
      <div v-if="earningsShow" class="p-4"  style="width:300px;height: 100%;background: rgba(0,0,0,0.09);position: relative">
        <TeamDevote :teamLeader="teamLeader" :teamMembers="teamMembers" :team="team"></TeamDevote>
      </div>
    </transition>
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
          升级效率：<strong style="color: #48ef48" class="mr-3">{{ effect }} % </strong>  <span v-if="online-1>0">{{ online - 1 }} 位队友在线 *5%</span><span v-else>无队友在线</span>
          <br>
          <a-row>
            <a-col>
              小队等级：1级
            </a-col>
            <a-col>
              <LevelIcon style="margin-top: -2px;margin-left: 5px" :level="1"></LevelIcon>
            </a-col>
          </a-row>
          全网排名：-<br>
          升级剩余时长：-<br>
          累计在线时长：-
          <div @click="receiveTeamEarnings" class="btn-active mt-4 h-12 flex justify-center cursor-pointer rounded-md  items-center text-white text-white" style="background: rgba(80,139,254, 1);font-size: 16px;font-weight: 400;">
            <Icon icon="thunderbolt"></Icon>
            <span>领取加速收益</span>
          </div>
        </div>

        <div class="bg-mask p-3 m-3 rounded-xl">
          <icon icon="tishi-xianxing"></icon>
          小队功能正在开发中，暂时还未开放组队升级加速，敬请期待。显示升级效率为理论加速值，功能上线后即可生效。
        </div>
        <div style="position: absolute;bottom: 0;margin-left:20px">
          <a-row class="m-5" :gutter="10">
            <a-col>
              <div v-if="teamLeader.userInfo.uid!==userInfo.uid" @click="quit"
                   class="rounded-xl bg-mask px-6 py-3 pointer ">
                <icon icon="guanbi2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                退出小队
              </div>
              <div v-else @click="dismiss" class="rounded-xl bg-mask px-6 py-3 pointer ">
                <icon icon="guanbi2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                解散小队
              </div>
            </a-col>
            <a-col>
              <div class="rounded-xl bg-mask px-6 py-3 pointer " @click="goHall">
                <icon icon="team" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                小队大厅
              </div>
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
            <UserDetail :memberInfo="showUserMemberInfo" :key="userInfoKey" :userInfo="showUserInfo"></UserDetail>
          </div>
        </vue-custom-scrollbar>

        <div style="position: absolute;bottom: 0;left: 15px">
          <a-row class="m-5 mb-2" :gutter="10">
            <a-col v-if="this.showUserInfo.uid!==userInfo.uid" >
              <div class="rounded-xl bg-mask px-6 py-3 pointer " @click="exit">
                <icon icon="tianjia2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
                加为好友
              </div>
            </a-col>
            <a-col>
              <a-col>
                <div class="rounded-xl bg-mask px-6 py-3 pointer " v-if="teamLeader.userInfo.uid===userInfo.uid && this.showUserInfo.uid!==userInfo.uid"
                     @click="exit">
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
      <div v-if="!teamDetail" @click="showTeamDetail" class="p-2 pt-2 pb-5 p-3 truncate font-large text-center pointer"
           style="font-size: 1.1em">
        <div class="mb-3">
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
import TeamDevote from "./team/TeamDevote.vue";
export default {
  name: 'TeamPanel',
  components: {TeamDevote, LevelIcon, UserAvatar, UserDetail, PlusOutlined,HorizontalPanel },
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
      if(online<=1){
        //防止用户数量穿透
        online=1
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
      teamDetail: false,
      showUid: 0,
      showUserInfo: {},
      showUserMemberInfo: {},//成员信息
      timer: null,//用于定期刷新队伍信息
      userInfoKey: Date.now(),
      earningsShow:false,


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
    ...mapActions(teamStore, ['updateTeamShip', 'quitByNo','updateMy','closeTeam']),
    goHall () {
      this.closeDetail()
      this.$router.push({ name: 'hall' })
    },
    showUserDetail (userInfo, memberInfo) {
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
    quit () {
      Modal.confirm({
        content: '退出小队后，您将无法再为小队做出贡献，但是历史贡献记录将被保留，以便您回到队伍后继承。',
        centered: true,
        okText: '退出',
        onOk: async () => {
          let rs = await this.quitByNo(this.team.no)
          if (rs.code === 1000) {
            if(rs.data.status){
              this.cleanTeam()
              this.updateMy().then()
              Modal.info({ content: '退出小队成功',centered:true })
            }else{
              this.closeTeam()
              this.updateMy().then()

              Modal.error({content:'退出小队失败',centered:true})
            }

          }else{
            this.updateMy().then()
            this.closeTeam()
            Modal.error({content:'退出小队意外失败',centered:true})
          }
        }

      })
    },
    exit () {

      // this.team = {
      //   status: false
      // }
      // this.teamVisible = false
    },
    // 点击领取收益弹出事件
    receiveTeamEarnings(){
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
.btn-active:active{
  filter: brightness(0.8);
  background: rgba(80,139,254, 0.8);
}
.nav-list-container{
  background: rgba(255, 255, 255, 0.2) !important;
  border-radius: 8px !important;
}
.nav-list-container ::v-deep .s-item{
  border-radius: 6px !important;
}
.ant-divider-horizontal{
  margin: 16px 0 16px 0 !important;
}

.receive-active:active{
  filter: brightness(0.8);
  background: rgba(0,0,0,0.40);
}
::v-deep .ant-avatar-image{
  position: relative;
  top:-5px;
}
</style>
