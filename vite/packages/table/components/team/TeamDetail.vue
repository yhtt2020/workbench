<template>
  <div class="bg-mask rounded-lg m-3 p-3"
       style="line-height: 2;background: var(--primary-bg);color: var(--primary-text)">
    升级效率：<strong style="color: #48ef48" class="mr-3">{{ effect }} % </strong> <span v-if="online-1>0">{{
      online - 1
    }} 位队友在线 *5%</span><span v-else>无队友在线</span>
    <br>
    <a-row>
      <a-col>
        小队等级：{{ team.rankInfo.grade.level }}级
      </a-col>
      <a-col>
        <LevelIcon style="margin-top: -2px;margin-left: 5px" :level="team.rankInfo.grade.level"></LevelIcon>
      </a-col>
    </a-row>
    全网排名：{{ team.rankInfo.no }}<br>
    升级剩余时长：{{ parseHours(getRemain(team.rankInfo.grade.level, team.rankInfo.onlineInfo.total_time), 1) }} 小时<br>
    累计在线时长：{{ parseHours(team.rankInfo.onlineInfo.total_time, 1) }} 小时<br>
    小队人数上限：{{ team.member_limit }}<br>
    <a-divider></a-divider>
    加入方式：{{ team.join_type === 0 ? '公开加入' : '其他' }}<br>

    成立时间：{{ team.createTime }}
    <div @click="receiveTeamEarnings"
         class="btn-active mt-4 h-12 flex justify-center cursor-pointer rounded-md  items-center text-white text-white"
         style="background: rgba(80,139,254, 1);font-size: 16px;font-weight: 400;">
      <Icon icon="thunderbolt"></Icon>
      <span>领取加速收益</span>
    </div>

  </div>

  <div style="position: absolute;bottom: 0;margin-left:34px;color: var(--primary-text);">
    <a-row class="m-5" :gutter="16">
      <a-col>
        <div v-if="teamLeader.userInfo.uid!==userInfo.uid" @click="quit"
             class="rounded-lg bg-mask px-6 py-3 pointer xt-bg-2">
          <icon icon="guanbi2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
          退出小队
        </div>
        <div v-else @click="dismiss" class="rounded-lg bg-mask px-6 py-3 pointer xt-bg-2" style="">
          <icon icon="guanbi2" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
          解散小队
        </div>
      </a-col>
      <a-col>
        <div class="rounded-lg bg-mask px-6 py-3 pointer xt-bg-2" @click="goHall" style="">
          <icon icon="team" style="font-size: 1.3em;vertical-align: text-bottom"></icon>
          小队大厅
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import LevelIcon from '../small/LevelIcon.vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { appStore } from '../../store'
import { message, Modal } from 'ant-design-vue'
import { teamStore } from '../../store/team'
import grade from '../../js/common/grade'

export default {
  name: 'TeamDetail',
  components: { LevelIcon },
  props: ['team', 'teamLeader', 'online', 'effect'],
  computed: {
    ...mapState(appStore, ['userInfo']),
    ...mapWritableState(teamStore, ['team'])
  },
  mounted () {
    this.updateTeam(this.team.no, false, true)
  },
  methods: {
    ...mapActions(teamStore, ['updateTeamShip', 'quitByNo', 'updateMy', 'closeTeam', 'updateTeam', 'cleanTeam', 'disbandByNo']),
    parseHours (minutes, fixed = 0) {
      return (minutes / 60).toFixed(fixed)
    },
    getRemain: grade.getRemain,

    async dismiss () {
      Modal.confirm({
        content: '您确定要解散团队？此操作不可撤销。此操作将清退小队全部队员，且未领取的小队收益将被清空。建议先提醒小队成员领取后再解散。',
        okText: '解散团队',
        centered: true,
        onOk: async () => {
          let rs = await this.disbandByNo(this.team.no)
          if (rs.code === 1000) {
            if (rs.data.status) {
              this.updateMy().then()
              await this.closeTeam()
              message.success('解散成功。')
              return
            }
          }
          message.error('解散小队失败。')
        }
      })
    },
    goHall () {
      this.$router.push({ name: 'hall' })
      this.$emit('closeDetail')
    },
    receiveTeamEarnings () {
      this.$emit('onReceiveTeamEarnings')
    },
    quit () {
      Modal.confirm({
        content: '退出小队后，您将无法再为小队做出贡献，但是历史贡献记录将被保留，以便您回到队伍后继承。',
        centered: true,
        okText: '退出',
        onOk: async () => {
          let rs = await this.quitByNo(this.team.no)
          if (rs.code === 1000) {
            if (rs.data.status) {
              this.updateMy().then()
              await this.closeTeam()
              Modal.info({ content: '退出小队成功', centered: true })
            } else {
              await this.closeTeam()
              this.updateMy().then()
              Modal.error({ content: '退出小队失败', centered: true })
            }
          } else {
            this.updateMy().then()
            await this.closeTeam()
            Modal.error({ content: '退出小队意外失败', centered: true })
          }
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
