<template>
  <div class="s-bg rounded-lg mr-2" style="text-align: center;padding-top: 3em;display: flex;flex-direction: column;height: 100%;justify-content: center">
    <BackBtn class="ml-2"></BackBtn>

    <div style="margin-top: -4em" >
      <Icon style="width:8em;height:8em;margin-right:10px;vertical-align: middle" icon="fanqie"></Icon>
    <p style="font-size: 2.5em;padding-top: 1em" class="xt-text">每天获得番茄，保持专注</p>
      <div style="margin-top: 2em">
        <div class="btn rounded-full xt-active-bg xt-active-text" @click="start" style="font-size: 3em;padding: 0.4em 1.5em">开始新番茄</div>
      </div>
    </div>
  </div>
</template>

<script>
import BackBtn from '../../../components/comp/BackBtn.vue'
export default {
  name: 'TomatoStart',
  components:{
    BackBtn
  },
  methods:{
    start(){
      this.$router.push({
        name:'tomato'
      })
    }
  }
}
</script>

<style scoped>

</style>
