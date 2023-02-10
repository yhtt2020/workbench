<template>
  <div class="bottom-panel" style="position: fixed;width: 100vw;padding:10px">
    <a-row :gutter="10">
      <a-col :span="2">
        <a-row class="common-panel" style="width:5em" >
          <PanelButton icon="#icon-shezhi" title="我的"></PanelButton>
        </a-row>
      </a-col>
      <a-col :span="2">
        <a-row class="common-panel" style="width:5em">
          <PanelButton icon="#icon-shezhi" title="设置"></PanelButton>
        </a-row>
      </a-col>
      <a-col  :span="4" class="common-panel">
        <a-row>
          <a-col :span="12">
            <PanelButton icon="#icon-suoding" title="锁屏"></PanelButton>
          </a-col>
          <a-col  :span="12">
            <PanelButton icon="#icon-yidongwenjianjia" title="传文件"></PanelButton>
          </a-col>
        </a-row>
      </a-col>
      <a-col  :span="4" class="common-panel">
        <a-row >
          <a-col  :span="12">
            <PanelButton icon="#icon-suoding" title="动态"></PanelButton>
          </a-col>
          <a-col  :span="12">
            <PanelButton icon="#icon-yidongwenjianjia" title="邮件"></PanelButton>
          </a-col>
        </a-row>
      </a-col>
      <a-col  :span="4">
        <a-row class="common-panel">
          <span class="status-text">专注中</span>
        </a-row>
      </a-col>


      <a-col  :span="4">
        <a-row class="common-panel" style="width:10em" >
          <a-col><PanelButton icon="#icon-xiaoxi" title="消息"></PanelButton></a-col>
          <a-col> <PanelButton icon="#icon-tishi-xianxing" title="通知"></PanelButton></a-col>
        </a-row>

      </a-col>
      <a-col  :span="2">
        <a-row class="common-panel" style="width:5em" >
          <a-col>
            <PanelButton icon="#icon-tuichu" title="电源"></PanelButton>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>

</template>

<script>
import PanelButton from './PanelButton.vue'

export default {
  name: 'BottomPanel',
  components: { PanelButton }
}
</script>

<style scoped>

.status-text {
  font-size: 1.5em;
  line-height: 3em;
  height: 3em;
  width: 6em;
  text-align: center;
}
</style>
