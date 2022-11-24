<template>
  <a-config-provider :locale="locale">
  <div class="a-container" style="display:none !important;">
    <router-view></router-view>
  </div>
  <!-- 密码库解锁组件 -->
  <PasswordBank />
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import PasswordBank from './page/PasswordBank.vue';
export default {
  components:{
    PasswordBank
  },
  data(){
    return {
      locale:zhCN
    }
  }
}
</script>

<style>
.a-container{
   width: 100%;
}
</style>
