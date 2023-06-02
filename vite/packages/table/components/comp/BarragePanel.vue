<template>
  <div class="px-3 py-2" style="display: flex;flex-direction: column;height: 100%">
    <div><HorizontalPanel  :height="44" :navList="channelList" v-model:select-type="currentChannel"></HorizontalPanel>
    </div>
    <div style="flex: 1;height:0;padding-top: 10px"><TeamBarrage :loading="loading" :key="key" :barrages="barrages"></TeamBarrage></div>
    <div class="mt-2"><BarrageSender @loadAllBarrages="loadAllBarrages" @loadTeamBarrage="loadTeamBarrage" :currentChannel="currentChannel"></BarrageSender></div>
  </div>
</template>

<script>
import BarrageSender from './BarrageSender.vue'
import TeamBarrage from './TeamBarrage.vue'
import HorizontalPanel from '../HorizontalPanel.vue'
import { mapActions, mapState } from 'pinia'
import { teamStore } from '../../store/team'

export default {
  name: 'BarragePanel',
  components: { HorizontalPanel, TeamBarrage, BarrageSender },
  props:['channels','defaultChannel'],
  data(){
    return {
      loading:false,
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
      barragesAll: [],
      barragesTeam: [],
      key:Date.now()
    }
  },
  mounted () {
    this.loading=true
    this.CONST = tsbApi.barrage.CONST
    if(this.defaultChannel==='team'){
      this.channelList=this.channelList.reverse()
      this.currentChannel={name:'team',title:'小队'}
    }
    this.loadAllBarrages().then()
    this.loadTeamBarrage().then(()=>{
      this.loading =false
    })
  },
  watch:{
    currentChannel:{
      handler(){
        this.loading=true
        this.key=Date.now()
      }
    }
  },
  computed:{
    ...mapState(teamStore, ['my','myTeamNo','myTeam']),
    barrages () {
      if (this.currentChannel.name === 'all') {
        return this.barragesAll
      } else {
        return this.barragesTeam
      }
    }
  },
  methods:{
    ...mapActions(teamStore,['updateMy']),
    async loadAllBarrages () {
      this.loading=true
      tsbApi.barrage.getList(this.CONST.CHANNEL.PUBLIC, 'table').then(rs => {
        this.loading=false
        if (rs.status) {
          rs.data.forEach(item => {
            item.create_time_text = tsbApi.util.friendlyDate(item.create_time)
          })
          this.barragesAll = rs.data

        }
      })
    },
    async loadTeamBarrage () {
      await this.updateMy()
      if (this.myTeamNo) {
        this.loading=true
        tsbApi.barrage.getList(this.CONST.CHANNEL.TEAM, this.myTeamNo).then(rs => {
          this.loading=false
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
  }
}
</script>

<style scoped>

</style>
