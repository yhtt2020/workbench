<template>
  <a-row   class="mt-5" style="width: 100%">
    <a-col class="pointer" @click="onAction(team)" :xxl="6" :xl="8" :lg="12" v-for="team in list">
      <div class="m-3 s-bg rounded-xl p-1">
        <a-row :gutter="10">
          <a-col :span="8" class="text-center">
            <a-avatar class="m-5 rounded-xl" shape="square" :size="55"></a-avatar>
          </a-col>
          <a-col>
            <div class="mt-5">

              <div class="inline-block relative" style="width: 20px;vertical-align: middle;">
             <span class="flex absolute h-3 w-3   -mt-1 -mr-1 " style="top: -2px">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
      </span>
              </div>
              <span class="font-bold text-md">{{ team.name }}</span>
            </div>
            <div class="flex mt-3">
              <div class="bg-mask m-1 px-1.5 py-0.5 rounded-md">{{ team.no }}</div>
              <div class="bg-mask m-1 px-1.5 py-0.5   rounded-md">1级</div>
              <div class="bg-mask m-1 px-1.5  py-0.5  rounded-md">排名：-</div>
            </div>


          </a-col>
        </a-row>
        <div class="m-5 mt-2 mb-3">
          <a-row :gutter="40">
            <a-col :span="4" >
              <a-avatar style="border: 1px solid rgba(255,139,54,0.73)" src="leader"></a-avatar>
            </a-col>
            <a-col :span="4" v-for="member in team.members">
              <a-avatar :src="member.avatar"></a-avatar>
            </a-col>
          </a-row>
        </div>

      </div>

    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'TeamList',
  props: ['list'],
  emits: ['showAction'],
  data () {
    return {}
  }, methods: {
    onAction (team) {
      this.$emit('showAction',{team})
    }
  }
}
</script>

<style scoped>

</style>
