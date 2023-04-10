<template>
  <a-config-provider :locale="locale">
    <div class="a-container" :class="{ dark: settings.darkMod }">
      <router-view></router-view>
    </div>
    <Barrage></Barrage>
  </a-config-provider>
  <a-modal v-model:visible="visible" centered @ok="handleOk" @cancel="handleOk">
    <template #modalRender="{}">
      <div
        style="
          height: 14.7em;
          background: #2e2e2e;
          padding: 1em;
          text-align: center;
          border-radius: 2em;
          margin-top: 5em;
        "
        v-if="clockEvent[0]"
      >
        <div style="font-size: 3em; margin-top: 0.5em">
          {{ clockEvent[0].dateValue.hours }}:{{
            clockEvent[0].dateValue.minutes
          }}
        </div>
        <div
          style="
            font-size: 1.5em;
            margin-top: 0.5em;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ clockEvent[0].eventValue }}
        </div>
      </div>
    </template>
  </a-modal>
  <audio ref="clock" src="/sound/clock.mp3"  ></audio>
</template>

<script lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "./store/card"
import {appStore} from "./store";
import Barrage from "./components/comp/Barrage.vue";
import {weatherStore} from "./store/weather";
import {codeStore} from "./store/code";
import {appsStore} from "./store/apps";
import {app} from "electron";
import {Modal}from 'ant-design-vue'
const {appModel} =window.$models
let startX,
  startY,
  moveEndX,
  moveEndY,
  X,
  Y = 0;
const distX = 80; //滑动感知最小距离
const distY = 80; //滑动感知最小距离
export default {
  components: {Barrage},
  data() {
    return {
      touchDownRoutes: ["home", "lock"], //支持下滑的页面的白名单
      touchUpRoutes: ["home", "lock"], //支持下滑的页面的白名单
      locale: zhCN,
      visible: false,
      dialogVisible: false,
    };
  },
  async mounted() {
    //还原数据
    setTimeout(()=>{
      let recoverPath=require('path').join(window.globalArgs['user-data-dir'],'temp.json')
      if(require('fs').existsSync(recoverPath)){
        let json= require('fs').readFileSync(recoverPath,'utf-8')
        let j=JSON.parse(json)
        Object.keys(j).forEach(key=>{
          localStorage.setItem(key,j[key])
        })
        require('fs').rmSync(recoverPath)
        localStorage.setItem('tipInfo','1')
        location.reload()
        console.log('检测到存在待回复的json文件')
      }
      if(localStorage.getItem('tipInfo')){
        localStorage.removeItem('tipInfo')
        Modal.info({content:'已为您迁移数据，目前可正常使用。'})
      }
    },3000)


    window.restore=()=>{this.settings.zoomFactor=100,window.location.reload()}
    if(!this.settings.zoomFactor){
      this.settings.zoomFactor=100
    }
    await tsbApi.window.setZoomFactor(+this.settings.zoomFactor/100)//根据设置进行缩放比的强制调整
    ipc.on('updateRunningApps', async (event, args) => {
      this.runningApps = args.runningApps
      this.runningAppsInfo = {}
      for (const app of args.runningApps) {
        this.runningAppsInfo[app] = await appModel.get({nanoid: app})
        console.log(await appModel.get({nanoid: app}))
        this.runningAppsInfo[app].windowId = args.windows[args.runningApps.indexOf(app)]
        ipc.send('getAppRunningInfo', {nanoid: app})
      }
    })
    ipc.on('updateRunningInfo',  (event, args) =>{
      let app = this.runningAppsInfo[args.nanoid]
      app.capture = args.info.capture + '?t=' + Date.now()
      app.memoryUsage = args.info.memoryUsage
    })
    // if (!this.myCode) {
    //   //注释此处的代码跳过激活码验证
    //   this.$router.push('/code')
    //   return
    // }
    this.verify(rs => {
      if (!rs) {
        this.$router.push('/code')
        return
      }
    })
    if (!this.init) {
      console.log(this.settings)
      this.$router.push('/wizard')
      return
    }
    document.body.classList.add('lg')
    this.reset()//重置部分状态
    this.sortClock()
    // this.getUserInfo()
    window.updateMusicStatusHandler = this.updateMusic;

    if (this.settings.darkMod) {
      document.body.style.background = "#191919";
    }
    this.bindTouchEvents();
    this.reloadAll(); //刷新全部天气
    //this.$router.push({name:'sensor'})
  },

  computed: {
    ...mapWritableState(cardStore, ["customComponents", "clockEvent", "appDate","clockFlag"]),
    ...mapWritableState(appStore, ['settings', 'routeUpdateTime', 'userInfo', 'init']),
    ...mapWritableState(codeStore, ['myCode']),
    ...mapWritableState(appsStore, ['runningApps', 'runningAppsInfo']),
  },
  methods: {
    ...mapActions(appStore, ['setMusic', 'reset']),
    ...mapActions(weatherStore, ['reloadAll']),
    ...mapActions(cardStore, ['sortClock']),
    ...mapActions(codeStore, ['verify']),
    bindTouchEvents() {
      $(".a-container").on("touchstart", (e) => {
        startX = e.originalEvent.changedTouches[0].pageX,
          startY = e.originalEvent.changedTouches[0].pageY;
      });
      $(".a-container").on("touchend", (e) => {
        moveEndX = e.originalEvent.changedTouches[0].pageX,
          moveEndY = e.originalEvent.changedTouches[0].pageY,
          X = moveEndX - startX,
          Y = moveEndY - startY;

        if (X > distX) {
          console.log("向右滑", distX);
          //e.preventDefault();
        } else if (X < -distX) {
          console.log("向左滑", distX);
          //e.preventDefault();
        } else if (Y > distY && startY <= 50) {
          if (this.touchDownRoutes.indexOf(this.$route.name) > -1) {
            ipc.send('openGlobalSearch')
            e.preventDefault();
          }
        } else if (Y < -distY) {
          if (this.touchUpRoutes.indexOf(this.$route.name) > -1) {
            this.$router.push({name: 'status'})
            e.preventDefault();
          }
          //e.preventDefault();
        } else {
          console.log("just touch");
        }
      });
    },
    updateMusic(music) {
      this.setMusic(music);
    },
    ...mapActions(cardStore, ["removeClock"]),
    // async getUserInfo() {
    //   let rs = await tsbApi.user.get()
    //   if (rs.status === 1) {
    //     console.log(rs.data.user_info)
    //     this.userInfo=rs.data.user_info
    //   }
    // }
    handleOk() {
      this.visible = false;
      this.removeClock(0);
      this.$refs.clock.pause();
    },


  }, watch: {
    "appDate.minutes": {
      handler(newVal, oldVal) {
        try {
          if (
            this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
            this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
          ) {
            this.visible = true;
            setTimeout(()=>{ this.$refs.clock.play();},1000)
          }
        } catch (err) {

        }
      },
      immediate: true,
    },
    "clockFlag": {
      handler(newVal, oldVal) {
        try {
          if (
            this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
            this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
          ) {
            this.visible = true;
            setTimeout(()=>{ this.$refs.clock.play();},1000)
          }else{
            this.visible = false;
            this.$refs.clock.pause()
          }
        } catch (err) {

        }
      },
      immediate: true,
    },
  },
};
</script>

<style>
@import "./assets/common.css";

.a-container {
  width: 100%;
}
</style>
