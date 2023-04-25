<template>

  <a-row>
    <a-col>
      <HorizontalPanel :navList="teamNavList" v-model:selectType="teamType"></HorizontalPanel>
    </a-col>
  </a-row>
  <div style="width: 100%" class="">
    <TeamList @showAction="showAction" :list="list"></TeamList>
  </div>


  <a-drawer placement="right" v-model:visible="actionVisible">

  </a-drawer>

</template>

<script>


import HorizontalPanel from '../../components/HorizontalPanel.vue'
import TeamList from '../../components/team/TeamList.vue'

export default {
  name: 'Hall',
  components: { TeamList, HorizontalPanel },
  data () {
    return {
      selectTeam:{},
      actionVisible: false,
      list: [{
        name: '疯狂蜜蜂团',
        no: '8888',
        members: [
          {
            avatar: 'ddd'
          },
          {
            avatar: 'ddd'
          }, {
            avatar: 'ddd'
          }
        ]
      },
        {
          name: '疯狂蜜蜂团',
          no: '8888',
          members: [
            {
              avatar: 'ddd'
            },
            {
              avatar: 'ddd'
            }, {
              avatar: 'ddd'
            }
          ]
        },
        {
          name: '疯狂蜜蜂团',
          no: '8888',
          members: [
            {
              avatar: 'ddd'
            },
            {
              avatar: 'ddd'
            }, {
              avatar: 'ddd'
            }
          ]
        },
        {
          name: '疯狂蜜蜂团',
          no: '8888',
          members: [
            {
              avatar: 'ddd'
            },
            {
              avatar: 'ddd'
            }, {
              avatar: 'ddd'
            }
          ]
        },
        {
          name: '疯狂蜜蜂团',
          no: '8888',
          members: [
            {
              avatar: 'ddd'
            },
            {
              avatar: 'ddd'
            }, {
              avatar: 'ddd'
            }
          ]
        }],
      teamNavList: [{ title: '活跃小队', name: 'active' }, { title: '全网排名', name: 'other' }],
      teamType: { title: '全网排名', name: 'rank' },
    }
  },
  methods: {
    showAction(team){
      this.selectTeam=team
      this.actionVisible=true
    }
  }
}
</script>

<style scoped>

</style>
