<script lang="ts">
import {defineComponent} from 'vue'
import XtButton from "../../../ui/libs/Button/index.vue";
import {SettingFilled} from "@ant-design/icons-vue";
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import {appStore} from "../../../store";

import '../static/style.scss'


const win32 = window.$models.win32
export default {
  name: "Index",
  components: {SettingFilled, XtButton},
  data() {
    return {

      currentIndex: '',
      watchDog: {},//监听狗
      currentWindow: {},//当前窗口
      selectTab: '',
      menuList: [],
      key:Date.now()
    }
  },
  watch:{

  },
  computed: {
    ...mapWritableState(keyStore, ['sessionList', 'executedApps', 'currentApp', 'settings']),
    ...mapWritableState(appStore, ['fullScreen']),
    leftMenu() {
      var startMenu = [
        {
          id: 'list',
          icon: "liebiao",
          title: '全部快捷键方案',
          tab: 'schemeIndex',
          // img: "/icons/bg.png",
          callBack: (id: 'create',) => {
            this.$router.push({name: 'schemeIndex'})
          },
        },
        {
          id: 'store',
          icon: "shop",
          title: '创意市场',
          // img: "/icons/bg.png",
          tab:'store',
          callBack: () => {
            this.$router.push({name: 'shortcutStore'})
          },
        },
      ]
      // 离线模式隐藏 创意市场
      if (window.$isOffline) {
        startMenu = startMenu.filter(i=>{
          return i.tab != 'store'
        })
      }
      
      const endMenu = [
        {
          full: true,
        },
        {
          flag: true,
          id: 'setting',
          icon: "setting",
          callBack: () => {
            this.$router.push({
              name: 'shortcutKeySettings'
            })
          },
        },
      ]
      this.syncSessionList((app) => {
        this.$router.push({
          name: 'schemeList',
          params: {
            exeName: app.exeName
          }
        })
      })
      return [
        ...startMenu,
        ...this.sessionList.filter(item => {
          return !item.hide
        }),
        ...endMenu
      ]
    }
  },
  mounted() {
    this.watchDog = win32.WatchWindowForeground(async (newPoint, oidPoint, Handle) => {
      let {rect, pid, MianPid, title} = Handle
      let path = win32.getProcessidFilePath(pid)
      let exeName = require('path').basename(path)
      this.executedApps=this.executedApps.filter(item=>{
        return item.exeName!==exeName
      })


      let software = await this.getRepApp(exeName, path)
      if (software.id === 'unknown') {
        software.alias = exeName
      }
      let currentApp = {
        pid: pid,
        title: title,
        path: path,
        lastFocus: Date.now(),
        hide:software.hide,
        exeName,
        inRep: software.id !== 'unknown',
        software
      }
      this.executedApps.unshift(currentApp)
      this.currentApp = currentApp

    })
    this.currentIndex = this.currentApp.exeName
  }, unmounted() {
    this.watchDog.quit()
  },
  methods: {
    ...mapActions(keyStore, ['getCustomApp', 'syncSessionList', 'getRepApp']),

  }
}
</script>

<template>
  <div :class="{'rounded-lg':!fullScreen}"
       class="flex h-full w-full   py-2" style="">
    <div class="w-full">
      <xt-left-menu v-model:index="currentIndex" :list="leftMenu" last="2" end="2" class="w-full">
        <!--  -->
        <template #test>
          <setting-filled/>
        </template>
        <div class=" xt-text h-full rounded-lg flex-1 flex flex-col">
          <div class="h-full" style="flex:1;height:0" v-if="currentApp">


            <!--          <div   class="mb-2 s-bg rounded-md p-2" v-for="app in executedApps ">-->
            <!--            {{ app.exeName }} - {{ app.pid }} - {{ app.title }}-->

            <!--            <div class="xt-text-2">-->
            <!--              {{ app.path }}-->
            <!--            </div>-->
            <!--            <div>{{ app.lastFocus }}</div>-->
            <!--            <div class="xt-bg-2 p-2 rounded-md my-1" v-if="app.inRep">-->
            <!--              <a-avatar shape="square" :src="app.software.icon"></a-avatar>-->
            <!--              {{app.software.alias}}-->

            <!--            </div>-->
            <!--            <div v-else>-->
            <!--              此应用未入库，只有入库的应用才可以使用快捷键方案-->
            <!--              <xt-button type="theme">登记入库</xt-button>-->
            <!--            </div>-->
            <!--          </div>-->

            <keep-alive>
              <RouterView></RouterView>
            </keep-alive>

          </div>
          <div class="h-full" style="flex:1;height:0" v-else>
            <RouterView :key="key"></RouterView>
          </div>

        </div>
      </xt-left-menu>
    </div>


  </div>

</template>

<style scoped lang="scss">

</style>
