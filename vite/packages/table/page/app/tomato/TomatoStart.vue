<template>
  <div class="main" style="text-align: center;padding-top: 3em">
    <BackBtn></BackBtn>

    <div>
      <Icon style="width:8em;height:8em;margin-right:10px;vertical-align: middle" icon="#icon-fanqie"></Icon>
    <p style="font-size: 2.5em;padding-top: 1em">每天获得番茄，保持专注</p>
      <div style="margin-top: 8em">
        <div class="btn" @click="start" style="font-size: 3em;padding: 0.4em 1.5em">开始新番茄</div>
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
      this.$router.push('/tomato')
    }
  }
}
</script>

<style scoped>

</style>
