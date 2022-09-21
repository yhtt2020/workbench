<template>
<div class="box">
  <div class="header flex justify-between align-center" style="width: 100%;height: 45px">
    <span style="color:#f3f3f3;font-size: 16px;margin-left: 10px">快捷面板</span>
    <div hidden class="flex justify-between align-center" style="margin-right: 10px">
      <div style="width: 90px;height: 22px;border-radius: 6px;background-color: #4f4f4f;line-height: 22px;text-align: center;color: #f3f3f3">点击箭头切换</div>
      <left-outlined />
      <right-outlined />
    </div>
  </div>
  <div>
    <Home></Home>
  </div>
</div>
</template>

<script lang="ts">
let { ipcMain } = require('electron')
let { ipcRenderer } = require('electron')
import Home from './page/Home.vue';
import { defineComponent } from 'vue'
import {
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Home,
    LeftOutlined,
    RightOutlined
  },
  mounted() {

  }
})
</script>

<style>
body{
  background-color: rgba(0,0,0,0);
  user-select:none;
}
.box{
    width: 400px;
    height: 580px;
    background-color: #323232;
    border-radius: 10px;

}
</style>
