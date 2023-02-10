<template>
  <a-config-provider :locale="locale">
  <div class="a-container" >
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
    window.ipc = window.$models.ipc
    window.kdbxModel = window.$models.kdbxModel
    window.passwordModel = window.$models.passwordModel
    this.loadDbList()
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
.a-container{
   width: 100%;
}
</style>
