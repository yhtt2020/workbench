<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {defineComponent, ref} from "vue";

export default defineComponent({
  setup() {
    const activeKey = ref('Privacy')
    return {
      activeKey
    }
  }
})
</script>

<template>
  <div style="background:#F0F1F3">
    <a-tabs
      v-model:activeKey="activeKey"
      tabPosition="left"
      style="height: 100vh "
    >
      <a-tab-pane key="Privacy" tab="隐私设置">


      </a-tab-pane>
      <a-tab-pane key="Appearance" tab="外观">dd</a-tab-pane>
      <a-tab-pane key="Feature" tab="功能">dd</a-tab-pane>
      <a-tab-pane key="SearchEngine" tab="搜索引擎">dd</a-tab-pane>
      <a-tab-pane key="Operation" tab="操作">dd</a-tab-pane>

    </a-tabs>
  </div>
</template>
currentTab
<style>
</style>
