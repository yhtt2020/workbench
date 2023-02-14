<template>
  <ul class="side-panel common-panel" style="
  width: 6em;position: fixed;top: calc((100vh - 32em)/2)">
    <li class="active">
      <PanelButton :active="tab==='home'" @click="goTab('','home')" icon="#icon-shouye1" title="主页"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='apps'" @click="goTab('apps')" icon="#icon-yingyongzhongxin" title="应用"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='music'"  @click="goTab('music')" iconStyle="width:2.5em;height:2.5em;margin-top:-0.4em;" icon="#icon-yinle1" title="音乐"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='todo'" icon="#icon-daibanshixiang" title="待办"></PanelButton>
    </li>
    <li>
      <PanelButton :active="tab==='data'" icon="#icon-iconfontpaixingbang" title="数据"></PanelButton>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SidePanel',
  data(){
    return {
      tab:'home'
    }
  },
  methods:{
    goTab(tab,name){
      if(!name){
        name=tab
      }
      this.tab=name
      this.$router.push({
        path:'/'+tab
      })
    }
  }
}
</script>

<style scoped lang="scss">
.item{
  margin: 8px;
}
</style>
