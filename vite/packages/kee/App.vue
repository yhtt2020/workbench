<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
export default {
  data(){
    return {
      locale:zhCN
    }
  }
}
</script>

<template>
  <a-config-provider :locale="locale">
  <div >
    <router-view></router-view>
  </div>
  </a-config-provider>
</template>

<style>
</style>
