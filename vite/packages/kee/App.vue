<template>
  <a-config-provider :locale="locale">
  <div class="a-container" >
    <router-view></router-view>
  </div>
  <!-- 
     密码库解锁组件 
     这里由于是静态页面先暂时隐藏掉
  -->
  <PasswordBank style="display:none !important;"/>
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
