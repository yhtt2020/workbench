<template>
  <div class="team-module">
    <div v-if='!isOffline' @click="toggleTeam" class="common-panel s-bg pointer "
    style="margin-left: 0;padding:0.6em !important;color:var(--primary-text);background: var(--primary-bg);">
    <emoji style="width: 52px;height:52px" icon="glassface"></emoji>
    </div>
    <div class="team-box" v-if="openTeam">
      <div v-for="t in teamList" :key="t.title" class="team-item" @click="jump(t.type,t)">
        <a-avatar :src="t.img" :size="40"></a-avatar>
        <span>{{ t.title }}</span>
      </div>
        <div class="team-item" @click="openTask()">
          <a-avatar src="/img/task/star.png" :size="40"></a-avatar>
          <span>任务中心</span>
        </div>
    </div>
  </div>
  <TeamTip :key="teamKey" v-model:visible="showTeamTip"></TeamTip>
  <MyProp :showMyProp="showMyProp" @closeMyProp="closeMyProp"></MyProp>
</template>

<script>
import TeamTip from '../TeamTip.vue'
import { mapWritableState, mapActions } from 'pinia'
import { teamStore } from '../../store/team'
import MyProp from '../team/MyProp.vue'
import Emoji from '../comp/Emoji.vue'
import { taskStore } from '../../apps/task/store'
import { offlineStore } from '../../js/common/offline'
export default {
  name: "Team",
  components: {
    Emoji,
    TeamTip,
    MyProp
  },
  props: {

  },
  data() {
    return {
      teamList: [
        {
          img: '/img/bottomPanel/my.png',
          title: '我的',
          route: {
            name: 'socialMy'
          },
          type: 'route'
        },
        {
          img: '/img/bottomPanel/team.png',
          title: '小队',
          type: 'team'
        },
        {
          img: '/img/bottomPanel/rank.png',
          title: '榜单',
          route: {
            name: 'rank'
          },
          type: 'route'
        },
        {
          img: '/img/bottomPanel/prop.png',
          title: '我的道具',
          type: 'prop'
        },
        {
          img: '/img/bottomPanel/market.png',
          title: '道具商城',
          route: {
            name: 'prop'
          },
          type: 'route'
        },
      ],
      //显示小组提示
      showTeamTip: false,
      openTeam: false,
      showMyProp: false
    }
  },
  computed: {
    ...mapWritableState(teamStore, ['team', 'teamVisible']),
    ...mapWritableState(taskStore, ['isTaskDrawer']),
    ...mapWritableState(offlineStore, ['isOffline']),
  },
  methods: {
    ...mapActions(teamStore, ['updateMy']),
    openTask() {
      this.isTaskDrawer = true
    },
    async jump(type,val){
      switch(type){
        case 'route':
          this.$router.push(val.route)
          break;
        case 'team':
          await this.updateMy(0)
          if (this.team.status === false) {
            this.teamKey = Date.now()
            this.showTeamTip = true
          } else {
            this.teamVisible = !this.teamVisible
          }
          break;
         case 'prop':
          this.showMyProp = true
          break;
      }
      this.openTeam = false
    },
    toggleTeam () {
      this.openTeam = !this.openTeam
    },
    closeMyProp(val){
      this.showMyProp = val
    }
  },
}
</script>

<style lang="scss" scoped>
.team-module{
  position: relative;
  .team-box{
    position: absolute;
    top: -200px;
    right: 10px;
    border-radius: 12px;
    width: 288px;
    height: 200px;
    z-index: 999;
    background: var(--main-mask-bg);
    // background: rgba(26,26,26,0.65);
    backdrop-filter: blur(8px);
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
    border-radius: 12px;
    display: flex;
    flex-wrap: wrap;
    padding: 12px 6px;
    .team-item{
      width: 80px;
      height: 80px;
      border-radius: 12px;
      margin: 0 6px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0 6px;
      cursor: pointer;
      color: var(--primary-text);
    }
    .team-item:hover{
      background: rgba(80,139,254,0.20);
    }
  }
}

</style>
