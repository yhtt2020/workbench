<template>
  <div class="card" style="height: 14em;margin-bottom: 1em" >
    <a-row>
      <a-col>
        <Icon style="width:5em;height:5em;margin-right:10px;vertical-align: middle" icon="fanqie"></Icon>
      </a-col>
      <a-col style="text-align: center">
        <div style="font-size: 1.5em;font-weight: bold">番茄钟</div>
        <div style="font-size: 1.5em">今日番茄：0</div>
      </a-col>
    </a-row>
    <a-row style="margin-top: 0.5em;text-align: center">
      <div class="btn" @click="start" style="font-size: 1.3em;font-weight: bold;margin-top: .4em;width: 12em"> 开始一个番茄</div>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  methods:{
    start(){
      this.$router.push('/tomatoStart')
    }
  }
}
</script>

<style scoped lang="scss">
.btn{
  margin: auto;
  &:hover{
    background: #676767;
    font-weight: bold;
    cursor: pointer;
   }
  border-radius: 6px;
  padding: 1em;
  display: inline-block;
  border: 1px solid #363636;
  background: #494949;
}
</style>
