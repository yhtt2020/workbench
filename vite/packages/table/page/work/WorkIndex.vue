<template>
  <div
    :class="{'ml-1':!fullScreen}"
    class="flex flex-row" style="height: 100%;width: 100%">
<SecondPanel @changeTab="changeTab" v-if="!fullScreen"  :menus="tabs"></SecondPanel>
  <div
    :class="{'ml-2':!fullScreen,'height':fullScreen?'100%':'99%','padding-top':fullScreen?'0':'1em'}"
    class="flex-1 content-view " style="display: flex;flex-direction: column;width: 0">
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
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
  created() {
    const prevRoute = this.$router.currentRoute.value.matched.slice(-2)[0]
    if (prevRoute && prevRoute.meta.keepAlive ) {
      this.$router.replace(prevRoute.name)
    }
  },
  data(){
    return {
      tabs:[
        {
          title:'桌面',
          name:'desk',
          icon:'desktop',
          tab:'workDesk',
          route:{
            name:'workDesk'
          }
        },
        {
          title:'AI助手',
          name:'ai',
          tab:'ai',
          icon:'CPU',
          route:{
            name:'ai'
          }
        },
        {
          title:'快捷键',
          name:'shortcut',
          icon:'jianpan-xianxing',
          tab:'shortcut',
          route:{
            name:'schemeIndex'
          }
        },
        {
          title:'快捷指令',
          name:'deck',
          tab:'deck',
          icon:'jianpan-xianxing',
          route:{
            name:'deck'
          }
        },
        {
          title:'剪切板',
          name:'clipboard',
          icon:'xiangmu',
          route:{
            name:'clipboard'
          }
        },
        {
          title:'待办',
          name:'todo',
          icon:'check-square',
          route:{
            name:'todo'
          }
        },
        {
          title:'番茄钟',
          name:'tomato',
          icon:'naozhong',
          route:{
            name:'tomatoStart'
          }
        },
        // {
        //   title:'便签(开发)',
        //   name:'note',
        //   icon:'check-square',
        //   route:{
        //     name:'note'
        //   }
        // }
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
