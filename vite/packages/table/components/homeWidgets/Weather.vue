<template>
  <div class="card" style="height: 14em;margin-bottom: 1em" >
    <a-row>
      <a-col>
        <Icon style="width:5em;height:5em;margin-right:10px;vertical-align: middle" icon="#icon-icon_qingtian"></Icon>
      </a-col>
      <a-col style="text-align: center">
        <div style="font-size: 1.5em;font-weight: bold">2月9日 周四 </div>
        <div style="font-size: 1.5em">晴 9℃</div>
      </a-col>
    </a-row>
    <a-row style="margin-top:2em">
      <a-col :span="12" style="text-align: center">
        <div style="font-size: 1.2em;font-weight: bold">明天 </div>
        <div style="font-size: 1.2em">多云 9℃~15℃</div>
      </a-col>
      <a-col :span="12" style="text-align: center">
        <div style="font-size: 1.2em;font-weight: bold">后天 </div>
        <div style="font-size: 1.2em">多云 9℃~15℃</div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Weather'
}
</script>

<style scoped>

</style>
