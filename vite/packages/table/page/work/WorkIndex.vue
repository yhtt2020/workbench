<template>
  <div class="flex flex-row ml-1" style="height: 100%;width: 100%">
<SecondPanel @changeTab="changeTab" v-if="!fullScreen"  :menus="tabs"></SecondPanel>
  <div class="flex-1 ml-2 content-view mb-2" style="padding-top: 1em;height: 99%;display: flex;flex-direction: column;width: 0">
    <router-view></router-view>
  </div>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import SecondPanel from "../../components/SecondPanel.vue";
import {mapWritableState} from "pinia";
import {appStore} from "../../store";

export default defineComponent({
  name: "WorkIndex",
  components: {SecondPanel},
  computed:{
    ...mapWritableState(appStore,['fullScreen'])
  },
  data(){
    return {
      tabs:[
        {
          title:'桌面',
          name:'desk',
          icon:'desktop',
          route:{
            name:'workDesk'
          }
        },
        {
          title:'AI助手',
          name:'ai',
          icon:'CPU',
          route:{
            name:'ai'
          }
        },
        {
          title:'快捷键',
          name:'shortcut',
          icon:'jianpan-xianxing',
          route:{
            name:'shortcut'
          }
        },
        {
          title:'剪切板',
          name:'clipboard',
          icon:'xiangmu',
          route:{
            name:'clipboard'
          }
        }
      ]
    }
  },
  methods:{
    changeTab(args) {
      this.$router.push(args.menu.route)
      this.tab = args.index
    },
  }
})
</script>



<style scoped lang="scss">

</style>
