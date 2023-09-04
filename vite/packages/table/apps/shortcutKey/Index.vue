<script lang="ts">
import {defineComponent} from 'vue'
import XtButton from "../../ui/libs/Button/index.vue";
import {SettingFilled} from "@ant-design/icons-vue";

const appMap = [
  {
    exeName: 'electron.exe',
    alias: 'Electron调试程序',
    company:'想天软件',
    icon:'https://files.getquicker.net/_icons/C6BA2B955AED4FCBD1A380D29935A284925DDB3D.png',
    id: 'qq.exe'
  },
  {
    exeName: '想天工作台.exe',
    alias: '想天工作台',
    company:'想天软件',
    icon:'https://files.getquicker.net/_icons/C6BA2B955AED4FCBD1A380D29935A284925DDB3D.png',
    id: 'qq.exe'
  },
  {
    exeName: 'QQ.exe',
    alias: 'QQ',
    company:'腾讯',
    icon:'https://files.getquicker.net/_icons/C6BA2B955AED4FCBD1A380D29935A284925DDB3D.png',
    id: 'qq.exe'
  },
  {
    exeName: 'DingTalk.exe',
    alias: '钉钉',
    company:'阿里',
    icon:'https://files.getquicker.net/_icons/B603BADD00B2814D061195B05941E5F1AA903BA0.png',
    id: 'explorer.exe'
  },
  {
    exeName: 'msedge.exe',
    alias: 'Edge浏览器',
    company:'微软',
    icon:'https://files.getquicker.net/_icons/F910EB0222185C4FAF20680B18E989B628B557FD.png',
    id: 'explorer.exe'
  },
  {
    exeName: 'explorer.exe',
    alias: '资源管理器',
    company:'微软',
    id: 'explorer.exe',
    icon:'https://files.getquicker.net/_icons/C10C3344B5B24AD43833A3F5614B5690DF274F4D.png'
  },
  {
    exeName: ['webstorm64.exe','webstorm.exe'],
    alias: 'WebStorm',
    company:'idea',
    icon: 'https://files.getquicker.net/_icons/8CA38E5B25AEF1F7B980CCC72CE0D063FC0254A8.png',
    id: 'webstorm'
  },
  {
    exeName: 'Docker Desktop.exe',
    alias: 'Docker桌面版',
    icon: 'docker',
    company:'',
    id: 'dockerDesktop'
  }
]

const win32 = window.$models.win32
export default defineComponent({
  name: "Index",
  components: {SettingFilled, XtButton},
  data() {
    return {
      apps: [],//应用清单
      watchDog: {},//监听狗
      currentWindow: {},//当前窗口
      selectTab:'',
      menuList: [
        {
          icon: "shop",
          // img: "/icons/bg.png",
          callBack: () => {
            this.selectTab = "Chat";
          },
        },
        // {
        //   slot: "test",
        //   callBack: () => {
        //     this.createChatVisible = true;
        //   },
        // },
        {
          flag: true,
          icon: "tianjia2",
          // img: "/img/task/star.png",

          callBack: () => {
            this.createChatVisible = true;
          },
        },
        {
          flag: true,
          icon: "setting",
          callBack: () => {
            this.setVisible = true;
          },
        },
      ],
    }
  },
  mounted() {
    this.watchDog = win32.WatchWindowForeground(async (newPoint, oidPoint, Handle) => {
      let {rect, pid, MianPid, title} = Handle
      console.log({rect, pid, MianPid, title})
      let found = this.apps.findIndex(app => {
        return app.pid === pid
      })
      if (found > -1) {
        this.apps.splice(found, 1)
      }
      let path = win32.getProcessidFilePath(pid)
      let exeName = require('path').basename(path)
      let software=this.getRepApp(exeName)
      this.apps.unshift({
        pid: pid,
        title: title,
        path: path,
        lastFocus:Date.now(),
        exeName,
        inRep:!!software,
        software
      })
      this.currentWindow = Handle
    })
  }, unmounted() {
    this.watchDog.quit()
  },
  methods:{
    getRepApp(exeName){
     return appMap.find(app=>{
       if(typeof app.exeName=='string'){
         return app.exeName===exeName
       }else{
         return app.exeName.includes(exeName)
       }

      })
    }
  }
})
</script>

<template>
  <div class="flex h-full xt-bg rounded-lg py-2" style="">
    <xt-left-menu :list="menuList" last="1" end="2">
      <!--  -->
      <template #test>
        <setting-filled />
      </template>
    </xt-left-menu>
    <div class="xt-bg xt-text p-10 rounded-lg">
    <div  class="mb-2 s-bg rounded-md p-2" v-for="app in apps ">
      {{ app.exeName }} - {{ app.pid }} - {{ app.title }}

      <div class="xt-text-2">
        {{ app.path }}
      </div>
      <div>{{ app.lastFocus }}</div>
      <div class="xt-bg-2 p-2 rounded-md my-1" v-if="app.inRep">
        <a-avatar shape="square" :src="app.software.icon"></a-avatar>
        {{app.software.alias}}

      </div>
      <div v-else>
        此应用未入库，只有入库的应用才可以使用快捷键方案
        <xt-button type="theme">登记入库</xt-button>
      </div>
    </div>
  </div>
  </div>



  <RouterView></RouterView>
</template>

<style scoped lang="scss">

</style>
