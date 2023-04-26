<template>
  <a-row class="mt-5" style="width: 100%;">
    <a-col :xxl="6" :xl="8" :lg="12" v-for="team in list">
      <div class="m-3 s-bg rounded-xl p-1 pointer" @click="onAction(team)">
        <a-row :gutter="10">
          <a-col :span="8" class="text-center">
            <a-avatar :src="team.avatar" class="m-5 rounded-xl" shape="square" :size="55"></a-avatar>
          </a-col>
          <a-col :span="16" class="">
            <div class="mt-5 truncate">
              <OnlineTag></OnlineTag>
              <span class="font-bold text-md ">{{ team.name }}</span>
            </div>
            <div class="flex mt-0">
              <div class="bg-mask m-1 px-1.5 py-0.5 rounded-md"># {{ team.no }}</div>
              <div class="bg-mask m-1 px-1.5 py-0.5   rounded-md">1级</div>
              <div class="bg-mask m-1 px-1.5  py-0.5  rounded-md">排名：-</div>
            </div>


          </a-col>
        </a-row>
        <div class="m-5 ml-6 mt-1 mb-3">
          <a-row :gutter="40">
            <a-col :span="4">
              <a-avatar v-if="team.leaderInfo" style="border: 1px solid rgba(255,255,255,0.73)"
                        :src="team.leaderInfo.data.userInfo.avatar"></a-avatar>
            </a-col>
            <a-col :span="4" v-for="member in team.members.data">
              <a-avatar v-if="member.userInfo" :src="member.userInfo.avatar"></a-avatar>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-col>
  </a-row>
</template>
<script>

import OnlineTag from '../small/OnlineTag.vue'

export default {
  name: 'TeamList',
  components: { OnlineTag },
  props: ['list'],
  emits: ['showAction'],
  data () {
    return {}
  },
  methods: {
    onAction (team) {
      this.$emit('showAction', { team })
    }
  },
  async mounted () {

  }
}
</script>

<style scoped>

</style>
