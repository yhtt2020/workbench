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
  <div class="a-container">
    <router-view></router-view>
  </div>
  </a-config-provider>
</template>

<style>
.a-container{
   width: 100%;
}
</style>
