<template>
  <a-config-provider :locale="locale">
  <div class="a-container " :class="{dark:settings.darkMod}"  >
     <router-view></router-view>


  </div>
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {mapActions,mapWritableState} from 'pinia'

import  { appStore } from './store'

export default {
  components:{
  },
  async mounted() {
    if(this.settings.darkMod){
      document.body.style.background='rgb(50,50,50)'
    }

  },
  computed:{
    ...mapWritableState(appStore,['settings','routeUpdateTime'])
  },
  methods:{
    ...mapActions(appStore,[]),
  },
  data(){
    return {
      locale:zhCN
    }
  }
}
</script>

<style>
@import './assets/common.css';
.a-container{
   width: 100%;
}
</style>
