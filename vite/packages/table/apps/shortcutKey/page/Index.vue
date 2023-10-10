<script lang="ts">
import {defineComponent} from 'vue'
import XtButton from "../../../ui/libs/Button/index.vue";
import {SettingFilled} from "@ant-design/icons-vue";
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import {appStore} from "../../../store";

const winappIcon = '/icons/winapp.png'
import '../static/style.scss'

const appMap = [
  {
    exeName: 'electron.exe',
    alias: 'Electron调试程序',
    company: '想天软件',
    icon: winappIcon,
    id: 'qq.exe'
  },
  {
    exeName: 'QQ.exe',
    alias: 'QQ',
    company: '腾讯',
    icon: 'https://files.getquicker.net/_icons/C6BA2B955AED4FCBD1A380D29935A284925DDB3D.png',
    id: 'qq.exe'
  },
  {
    exeName: 'DingTalk.exe',
    alias: '钉钉',
    company: '阿里',
    icon: 'https://files.getquicker.net/_icons/B603BADD00B2814D061195B05941E5F1AA903BA0.png',
    id: 'explorer.exe'
  },
  {
    exeName: 'msedge.exe',
    alias: 'Edge浏览器',
    company: '微软',
    icon: 'https://files.getquicker.net/_icons/F910EB0222185C4FAF20680B18E989B628B557FD.png',
    id: 'explorer.exe'
  },
  {
    exeName: 'explorer.exe',
    alias: '资源管理器',
    company: '微软',
    id: 'explorer.exe',
    icon: 'https://files.getquicker.net/_icons/C10C3344B5B24AD43833A3F5614B5690DF274F4D.png'
  },
  {
    exeName: ['webstorm64.exe', 'webstorm.exe'],
    alias: 'WebStorm',
    company: 'idea',
    icon: 'https://files.getquicker.net/_icons/8CA38E5B25AEF1F7B980CCC72CE0D063FC0254A8.png',
    id: 'webstorm'
  },

]

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
      menuList: [

        // {
        //   slot: "test",
        //   callBack: () => {
        //     this.createChatVisible = true;
        //   },
        // },

      ],
    }
  },
  computed: {
    ...mapWritableState(keyStore, ['sessionList', 'executedApps', 'currentApp', 'settings']),
    ...mapWritableState(appStore, ['fullScreen']),
    leftMenu() {
      const startMenu = [
        {
          id: 'list',
          icon: "liebiao",
          title: '我的快捷键',
          // img: "/icons/bg.png",
          callBack: (id: 'create',) => {
            this.selectTab = "Chat";
            this.$router.push({name:'schemeList'})
          },
        },
        // {
        //   id: 'shop',
        //   icon: "shop",
        //   title: '创意市场',
        //   // img: "/icons/bg.png",
        //   callBack: () => {
        //     this.selectTab = "Chat";
        //   },
        // },

      ]
      const endMenu = [
        {
          full: true,
        },
        {
          flag: true,
          icon: "tianjia2",
          id: 'create',
          title: '创建快捷键方案',
          // img: "/img/task/star.png",

          callBack: () => {
            this.createChatVisible = true;
          },
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
      this.syncSessionList((app)=>{
        this.$router.push({
          name: 'schemeList',
          params: {
            exeName: app.exeName
          }
        })
      })

      console.log(this.sessionList)
      return [
        ...startMenu,
        ...this.sessionList,
        ...endMenu
      ]
    }
  },
  mounted() {
    this.watchDog = win32.WatchWindowForeground(async (newPoint, oidPoint, Handle) => {
      let {rect, pid, MianPid, title} = Handle
      console.log({rect, pid, MianPid, title})
      let found = this.executedApps.findIndex(app => {
        return app.pid === pid
      })

      if (found > -1) {
        this.executedApps.splice(found, 1)
      }
      let path = win32.getProcessidFilePath(pid)
      let exeName = require('path').basename(path)
      let software = await this.getRepApp(exeName, path)
      if (software.id === 'unknown') {
        software.alias = exeName
      }
      let currentApp = {
        pid: pid,
        title: title,
        path: path,
        lastFocus: Date.now(),
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
    ...mapActions(keyStore, ['getCustomApp','syncSessionList']),
    async getRepApp(exeName, filePath) {
      let found = appMap.find(app => {
        if (typeof app.exeName == 'string') {
          return app.exeName === exeName
        } else {
          return app.exeName.includes(exeName)
        }
      })

      console.log('找到',found)
      if (!found) {
        console.log('接下来要请求')
        return await this.getCustomApp(exeName, filePath)
      }else{
        return found
      }
    }
  }
}
</script>

<template>
  <div :class="{'rounded-lg':!fullScreen}"
       class="flex h-full w-full   py-2" style="">
    <div class="w-full">
      <xt-left-menu v-model:index="currentIndex" :list="leftMenu" last="1" end="3" class="w-full">
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

            <keep-alive >
              <RouterView></RouterView>
            </keep-alive>

          </div>
          <div class="h-full" style="flex:1;height:0" v-else>
            <RouterView></RouterView>
          </div>
          <div class=" p-2  " style="border-top: 1px solid  var(--divider);margin-left: -12px">
            <strong>常用快捷功能开关：</strong>
            <a-switch v-model:checked="settings.enableAutoChange"></a-switch>
            自动切换方案
            &nbsp;&nbsp;
            <a-switch v-model:checked="settings.enableAutoEnter"></a-switch>
            自动进入
          </div>
        </div>
      </xt-left-menu>
    </div>


  </div>

</template>

<style scoped lang="scss">

</style>
