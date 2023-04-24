<template>
  <div class="flex s-bg rounded-xl" :style="{height:showDetail?'100%':'auto'}" style="overflow: hidden">
    <transition name="fade">
      <div v-if="showDetail" style="width:250px;height: 100%;background: rgba(0,0,0,0.09)">
        <div @click="toggleDetail" class="p-2 rounded-md inline-block m-2 pointer" style="background: rgba(0,0,0,0.17);position:absolute;"><Icon icon="guanbi" style="font-size: 1.2em"></Icon></div>
        <div class="line mt-5 text-center">
          <a-avatar :size="50" shape="square" :src="team.avatar"></a-avatar>
          <div class="mt-3">{{ team.name }}</div>
        </div>
      </div>
    </transition>
    <div class="common-panel  " style="width: 80px">
      <div v-if="!showDetail"  @click="toggleDetail" class="p-2 pt-2 p-3 truncate font-large text-center pointer" style="font-size: 1.1em">
        <div class="mb-2">
          <a-avatar :size="50" shape="square" :src="team.avatar"></a-avatar>
        </div>
<!--        <div  class="truncate">-->
<!--          {{ team.name }}-->
<!--        </div>-->
      </div>
      <div v-if="showDetail" class="text-center">小队成员</div>
      <a-divider  style="margin-top: 10px;margin-bottom: 10px"></a-divider>
      <div class="text-center mb-5 mt-5" v-if="teamLeader.userInfo">
        <a-avatar :size="50" :src="teamLeader.userInfo.avatar"></a-avatar>
        <div v-if="showDetail" class="p-2 truncate">{{ teamLeader.userInfo.nickname }}</div>
      </div>
      <div class="text-center  mb-5 " v-for="user in teamMembers">
        <a-avatar :size="50" :src="user.userInfo.avatar"></a-avatar>
      <div v-if="showDetail" class="p-2 truncate">{{ user.userInfo.nickname }}</div>
      </div>
      <div class="text-center pb-2" v-if="team.leader===userInfo.uid">
        <a-avatar :size="50">
          <PlusOutlined/>
        </a-avatar>
      </div>
    </div>
  </div>

</template>

<script>
import { PlusOutlined } from '@ant-design/icons-vue'
import { teamStore } from '../store/team'
import { mapWritableState, mapActions, mapState } from 'pinia'
import { appStore } from '../store'

export default {
  name: 'TeamPanel',
  components: { PlusOutlined },
  computed: {
    ...mapWritableState(teamStore, ['team', 'teamVisible', 'teamLeader', 'teamMembers']),
    ...mapState(appStore, ['userInfo'])

  },
  data () {
    return {
      showDetail: false
    }
  },
  mounted () {
    this.updateTeamShip(this.team.no).then()
  },
  methods: {
    ...mapActions(teamStore, ['updateTeamShip']),
    toggleDetail () {
      this.showDetail = !this.showDetail
    },
    cleanTeam () {
      this.teamVisible = false
      this.team = {
        status: false
      }
    }
  }

}
</script>

<style scoped>

</style>
