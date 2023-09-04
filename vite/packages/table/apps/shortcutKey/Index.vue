<script lang="ts">
import {defineComponent} from 'vue'
import XtButton from "../../ui/libs/Button/index.vue";
import {SettingFilled} from "@ant-design/icons-vue";
import {mapWritableState} from "pinia";
import {keyStore} from "./store";
import {appStore} from "../../store";
const winappIcon='/icons/winapp.png'
import './static/style.scss'
const appMap = [
  {
    exeName: '',
    alias: '未知应用',
    icon: winappIcon,
    company: '',
    id: 'unknown'
  },
  {
    exeName: 'electron.exe',
    alias: 'Electron调试程序',
    company: '想天软件',
    icon: winappIcon,
    id: 'qq.exe'
  },
  {
    exeName: '想天工作台.exe',
    alias: '想天工作台',
    company: '想天软件',
    icon: 'https://files.getquicker.net/_icons/C6BA2B955AED4FCBD1A380D29935A284925DDB3D.png',
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
  {
    exeName: 'Docker Desktop.exe',
    alias: 'Docker桌面版',
    icon: 'docker',
    company: '',
    id: 'dockerDesktop'
  },

]

const win32 = window.$models.win32
export default defineComponent({
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
    ...mapWritableState(keyStore, ['sessionList', 'executedApps','currentApp','settings']),
    ...mapWritableState(appStore,['fullScreen']),
    leftMenu() {
      const startMenu = [
        {
          id: 'list',
          icon: "liebiao",
          title: '我的快捷键',
          // img: "/icons/bg.png",
          callBack: (id: 'create',) => {
            this.selectTab = "Chat";
          },
        },
        {
          id: 'shop',
          icon: "shop",
          title: '创意市场',
          // img: "/icons/bg.png",
          callBack: () => {
            this.selectTab = "Chat";
          },
        },

      ]
      const endMenu = [
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
            this.setVisible = true;
          },
        },
      ]
      this.sessionList = this.executedApps.map(app => {
        return {
          img: app.software.icon,
          title: app.software.alias,
          id: app.exeName,
          noBg:true,
          callBack: () => {
            this.currentApp = app
            this.$router.push({
              name:'schemeList',
              params:{
                exeName:app.exeName
              }
            })
          }
        }
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
      let software = this.getRepApp(exeName)
      if(software.id==='unknown'){
        software.alias=exeName
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
    console.log(this.currentApp,'dd')
    this.currentIndex=this.currentApp.exeName
  }, unmounted() {
    this.watchDog.quit()
  },
  methods: {
    getRepApp(exeName) {
      let found = appMap.find(app => {
        if (typeof app.exeName == 'string') {
          return app.exeName === exeName
        } else {
          return app.exeName.includes(exeName)
        }
      })
      if (!found) {
        return appMap[0]
      } else {
        return found
      }
    }
  }
})
</script>

<template>
  <div :class="{'rounded-lg':!fullScreen}"
    class="flex h-full xt-bg  py-2" style="">
    <div>
      <xt-left-menu v-model:index="currentIndex" :list="leftMenu" last="2" end="2">
        <!--  -->
        <template #test>
          <setting-filled/>
        </template>
      </xt-left-menu>
    </div>
    <div class=" xt-text h-full rounded-lg flex-1 flex flex-col">
      <a-row class="h-full" v-if="currentApp">


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

      </a-row>
      <div class=" p-2  " style="border-top: 1px solid  var(--divider);margin-left: -12px">
        <strong>常用快捷功能开关：</strong>
        <a-switch v-model:checked="settings.enableAutoChange"> </a-switch> 自动切换方案
        &nbsp;&nbsp;
        <a-switch  v-model:checked="settings.enableAutoEnter"> </a-switch> 自动进入
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
