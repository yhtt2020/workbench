<template>
  <div class="card" style="margin-bottom: 1em" >
    <a-row>
      <a-col>
        <Icon style="width:3em;height:3em;margin-right:10px;vertical-align: middle" icon="#icon-gupiao"></Icon>
      </a-col>
      <a-col style="text-align: center">
        <div style="font-size: 1.5em;font-weight: bold">自选股</div>

      </a-col>

    </a-row>
    <a-row class="stock" style="margin-bottom: 0.5em">
      <a-col :span="12">
        九安医疗<br>
        002432
      </a-col>
      <a-col :span="12" >
        <span class="up">0.08%</span><br/>
        51.96
      </a-col>

    </a-row>
    <a-row class="stock" style="margin-bottom: 0.5em">
      <a-col :span="12">
        宁德时代<br>
        300750
      </a-col>
      <a-col :span="12" >
        <span class="down">-1.55%</span><br/>
        445.95
      </a-col>

    </a-row>
    <a-row class="stock" style="margin-bottom: 0.5em">
      <a-col :span="12">
        数字政通<br>
        300075
      </a-col>
      <a-col :span="12" >
        <span class="down">-3.34%</span><br/>
        20.53
      </a-col>

    </a-row>
    <a-row class="stock" style="margin-bottom: 0.5em">
      <a-col :span="12">
        涂鸦智能<br>
        TUYA
      </a-col>
      <a-col :span="12" >
        <span class="up">5.02%</span><br/>
        2.93
      </a-col>

    </a-row>
    <a-row class="stock" style="margin-bottom: 0.5em">
      <a-col :span="12">
        中国巨石<br>
        600176
      </a-col>
      <a-col :span="12" >
        <span>0%</span><br/>
       14.86
      </a-col>

    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Stock'
}
</script>

<style scoped>
.stock{
  margin: 0.3em;
  font-size: 1.2em;
  border-bottom: 1px solid #777777;
}
.up{
  color:red
}
.down{
  color:green;
}
</style>
