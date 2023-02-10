<template>
  <div class="card" >
    <div class="title"><Icon icon="#icon-rili" style="height: 1.2em;width: 1.2em;margin-right: 0.5em"></Icon>工作日历</div>
    <div style="font-size:1.4em;margin-bottom: 1em;margin-top: 1em">2月9日 周四</div>
    <div style="font-size:1.4em;margin-bottom: 0.5em">即将到来</div>
    <a-row style="font-size: 1.2em;line-height: 2.2em">
      <a-col :span="12"><Icon icon="#icon-jieriyingxiao" ></Icon> 清明节</a-col>
      <a-col :span="12">4月5日~4月5日</a-col>
      <a-col :span="12"><Icon icon="#icon-jieriyingxiao" ></Icon> 劳动节</a-col>
      <a-col :span="12">4月29日~5月3日</a-col>
      <a-col :span="12"><Icon icon="#icon-aixin" ></Icon> 结婚纪念日</a-col>
      <a-col :span="12">7月4日</a-col>
      <a-col :span="12"><Icon icon="#icon-jieriyingxiao" ></Icon> 中秋节</a-col>
      <a-col :span="12">8月14日</a-col>
      <a-col :span="12"><Icon icon="#icon-jieriyingxiao" ></Icon> 国庆节</a-col>
      <a-col :span="12">9月30日~10月6日</a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Calendar'
}
</script>

<style scoped>

</style>
