<template>
    <!-- Your Drag-and-Drop Application -->

  <div style="z-index:9999" v-if="settings.down.enable" v-for="item of settings.down.count" :key="item"
       :class="settings.down.type + 'flake'"></div>
  <a-config-provider :locale="locale" >
    <div class="a-container " :class="{ dark: settings ? settings.darkMod : '', 'horse_run': this.settings.houserun }">
      <DndProvider :backend="HTML5Backend">
        <router-view></router-view>
      </DndProvider>
    </div>
    <Barrage></Barrage>
  </a-config-provider>
  <!-- <a-modal v-model:visible="visible" centered @ok="handleOk" @cancel="handleOk">
    <template #modalRender="{}">
      <div style="
          height: 14.7em;
          background: #2e2e2e;
          padding: 1em;
          text-align: center;
          border-radius: 2em;
          margin-top: 5em;
        " v-if="clockEvent[0]">
        <div style="font-size: 3em; margin-top: 0.5em">
          {{ clockEvent[0].dateValue.hours }}:{{
            clockEvent[0].dateValue.minutes
          }}
        </div>
        <div style="
            font-size: 1.5em;
            margin-top: 0.5em;
            overflow: hidden;
            text-overflow: ellipsis;
          ">
          {{ clockEvent[0].eventValue }}
        </div>
      </div>
    </template>
  </a-modal> -->
  <audio ref="clock" src="/sound/clock.mp3"></audio>
  <audio id="shakeAudio" ref="shake" :src="'/sound/'+settings.shake.audio"></audio>
  <template v-if="settings.transparent">
<!--    <div class="fixed inset-0 video-container " style="background: #00000000">-->
<!--    </div>-->
  </template>
  <template v-else>
    <div class="fixed inset-0 video-container " v-if="backgroundImage.runpath">
      <video class="fullscreen-video" playsinline="" autoplay="" muted="" loop="" ref="backgroundVideo">
        <source :src="videoPath" type="video/mp4" id="bgVid">
      </video>

    </div>
    <div v-else-if="backgroundImage.path " class="fixed bg-image inset-0 video-container ">
      <img id="wallpaper" style="object-fit: cover;width: 100%;height: 100%" :src="backgroundImage.path">
    </div>

    <div v-else-if="backgroundColor.color" class="fixed bg-image inset-0 video-container ">
      <div class="w-full h-full " :style="{backgroundColor:`${backgroundColor.color}`}"></div>
    </div>

    <div v-else>
      <!-- 修改默认壁纸 -->
      <div class="fixed inset-0  none-bg default-bg" style="z-index: -1">
      </div>
    </div>
  </template>

  <div class="fixed inset-0 background-img-blur-light" style="z-index: -1"></div>

  <div v-if="taggingScreen" class="px-10 rounded-lg"
       style="pointer-events:none;background: rgba(51,51,51,0.9);font-size: 8em;position: fixed;right: 10px;bottom: 10px;z-index: 999;">
    {{ screenDetail.title || '主屏' }}
  </div>

  <Modal style="z-index:999" v-model:visible="userCardVisible" v-if="userCardVisible" animationName="b-t"
         :blurFlag="true">
    <slot>
      <UserCard :key="userCardUid" :uid="userCardUid" :userInfo="userCardUserInfo"></UserCard>
    </slot>
  </Modal>
  <Modal v-model:visible="frameStoreVisible" v-if="frameStoreVisible" animationName="b-t"
         :blurFlag="true">
    <slot>
    <div class="mr-3 card half" style="padding:0;width: 370px;background: var(--primary-bg);max-height: 550px;height: 550px;z-index: 9999999;position: relative;overflow: hidden">
      <FrameStoreWidget></FrameStoreWidget>
    </div>
    </slot>
  </Modal>



</template>

<script lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import {mapActions, mapWritableState} from "pinia";
import {cardStore} from "./store/card"
import {appStore} from "./store";
import Barrage from "./components/comp/Barrage.vue";
import {codeStore} from "./store/code";
import {appsStore} from "./store/apps";
import {steamUserStore} from "./store/steamUser";
import {screenStore} from './store/screen'

import browser from './js/common/browser';
import UserCard from "./components/small/UserCard.vue";
import Modal from './components/Modal.vue'
import {timerStore} from "./store/timer";
import {
  initStyle
} from "./components/card/hooks/styleSwitch/";
import {
  initTheme
} from "./components/card/hooks/themeSwitch/";
import FrameStoreWidget from "./components/team/FrameStoreWidget.vue";

import { DndProvider } from 'vue3-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {notification} from "ant-design-vue";
import { backgroundClip } from "html2canvas/dist/types/css/property-descriptors/background-clip";
notification.config({
  top: '70px',//设置notification默认距离顶部位置
  rtl: false,
});
window.browser = browser
const {appModel} = window.$models
let startX,
  startY,
  moveEndX,
  moveEndY,
  X,
  Y = 0;
const distX = 80; //滑动感知最小距离
const distY = 80; //滑动感知最小距离
export default {
  components: {FrameStoreWidget, Modal, UserCard, Barrage,DndProvider},
  data() {
    return {
      HTML5Backend,
      touchDownRoutes: ["home", "lock"], //支持下滑的页面的白名单
      touchUpRoutes: ["home", "lock"], //支持下滑的页面的白名单
      locale: zhCN,
      visible: false,
      dialogVisible: false,
      videoPath: '',
      frameStoreVisible:false
    };
  },

  async mounted() {
    window.addEventListener('resize',()=>{
      document.body.classList.add('window')
    })
    setTimeout(()=>{
      this.ensureFullScreen()
    },1000)
    initTheme()
    initStyle()
    window.toggleFrameStore=()=>{
      this.frameStoreVisible=!this.frameStoreVisible
      this.userCardVisible=false
    }

    window.addEventListener("keydown", this.KeyDown, true)// 监听按键事件

    window.restore = () => {
      this.settings.zoomFactor = 100
      tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100).then()
    }


    ipc.on('updateRunningApps', async (event, args) => {
      this.runningApps = args.runningApps
      this.runningAppsInfo = {}
      for (const app of args.runningApps) {
        this.runningAppsInfo[app] = await appModel.get({nanoid: app})
        this.runningAppsInfo[app].windowId = args.windows[args.runningApps.indexOf(app)]
        ipc.send('getAppRunningInfo', {nanoid: app})
      }
    })

    ipc.on('updateRunningTableApps', async (event, args) => {
      this.runningTableApps = args.apps
      console.log(args.apps)
    })

    ipc.on('updateRunningInfo', (event, args) => {
      let app = this.runningAppsInfo[args.nanoid]
      app.capture = args.info.capture + '?t=' + Date.now()
      app.memoryUsage = args.info.memoryUsage
    })


    document.body.classList.add('lg')
    this.reset()//重置部分状态
    this.sortClock()
    window.updateMusicStatusHandler = this.updateMusic;

    this.bindTouchEvents();

    const keyCombinationPressed = async (event) => {
        if (event.ctrlKey && event.altKey && event.shiftKey && (event.key === 'r' || event.key === 'R')) {

          this.$bus.emit('resetWindow')
        await  tsbApi.window.setZoomFactor(1)
        }
      };

      window.addEventListener('keydown', keyCombinationPressed);
    //this.$router.push({name:'sensor'})
  },

  computed: {
    ...mapWritableState(cardStore, ["customComponents", "clockEvent", "clockFlag"]),
    ...mapWritableState(timerStore, ["appDate"]),
    ...mapWritableState(appStore, ['userCardVisible','fullScreen', 'userCardUid', 'userCardUserInfo', 'settings', 'routeUpdateTime', 'userInfo', 'init', 'backgroundImage','backgroundColor']),
    ...mapWritableState(codeStore, ['myCode']),
    ...mapWritableState(appsStore, ['runningApps', 'runningAppsInfo', 'runningTableApps']),
    ...mapWritableState(screenStore, ['taggingScreen', 'screenDetail']),
    ...mapWritableState(steamUserStore, ['steamLoginData']),
  },
  methods: {
    ...mapActions(appStore, ['setMusic', 'reset','toggleFullScreen','exitFullScreen','ensureFullScreen']),
    ...mapActions(cardStore, ['sortClock']),
    ...mapActions(codeStore, ['verify']),
    ...mapActions(steamUserStore, ['setUserData', 'setSteamLoginData', 'setGameList', 'addGameDetail', 'onRefreshToken']),
    KeyDown(event) {
      if (event.keyCode === 122) {
        this.toggleFullScreen()
        event.preventDefault()
        event.stopPropagation()
      }
      if(this.fullScreen){
        if(event.keyCode===27){
          this.exitFullScreen()
          event.preventDefault()
          event.stopPropagation()
        }
      }
    },
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
          //取消上滑手势
          // if (this.touchUpRoutes.indexOf(this.$route.name) > -1) {
          //   this.$router.push({name: 'status'})
          //   e.preventDefault();
          // }
          //e.preventDefault();
        } else {
          console.log("just touch");
        }
      });
    },
    updateMusic(music) {
      this.setMusic(music);
    },
    ...mapActions(cardStore, ["removeClock", "sortClock"]),
    handleOk() {
      this.visible = false;
      this.removeClock(0);
      this.$refs.clock.pause();
    },

  },
  watch: {
    'settings.transparent': {
      handler() {
        if (this.settings.transparent) {
          $('body').css('background', 'transparent')
        } else {
          $('body').css('background', 'rgb(25, 25, 25)')
        }
      }
      // document.body.attributes['background']=''
    },
    // "appDate.minutes": {
    //   handler(newVal, oldVal) {
    //     this.sortClock()
    //     try {
    //       if (
    //         this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
    //         this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
    //       ) {
    //         this.visible = true;
    //         setTimeout(() => {
    //           this.$refs.clock.play();
    //         }, 1000)
    //       }
    //     } catch (err) {

    //     }
    //   },
    //   immediate: true,
    // },
    // "clockFlag": {
    //   handler(newVal, oldVal) {
    //     try {
    //       if (
    //         this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
    //         this.appDate.hours === this.clockEvent[0].dateValue.hours && this.clockEvent[0].flag === undefined
    //       ) {
    //         this.visible = true;
    //         setTimeout(() => {
    //           this.$refs.clock.play();
    //         }, 1000)
    //       } else {
    //         this.visible = false;
    //         this.$refs.clock.pause()
    //       }
    //     } catch (err) {

    //     }
    //   },
    //   immediate: true,
    // },
    "userInfo.onlineGradeExtra": {
      handler(newVal, oldVal) {
        window.lv = 1
        if (this.userInfo.onlineGradeExtra) {
          window.lv = this.userInfo.onlineGradeExtra.lv
        }

      },
      immediate: true,
    },
    "backgroundImage": {
      handler() {
        if (this.backgroundImage.runpath) {
          // document.body.style.setProperty('--suspensiondBackGround', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBlur', 50 + 'px');
          // document.body.style.setProperty('--gradient', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBoxShadow', "0px 0px 10px 0px rgba(0,0,0,0.5)");

          document.body.style.backgroundImage = ""
          this.videoPath = this.backgroundImage.runpath
          this.$nextTick(() => {
            this.$refs.backgroundVideo.load()
            this.$refs.backgroundVideo.play()

          })
        } else if (this.backgroundImage.path !== "") {
          // document.body.style.setProperty('--suspensiondBackGround', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBlur', 50 + 'px');
          // document.body.style.setProperty('--gradient', "rgb(26,26,26,.65)");
          // document.body.style.setProperty('--suspensiondBackGroundBoxShadow', "0px 0px 10px 0px rgba(0,0,0,0.5)");

        } else {
          // document.body.style.setProperty('--suspensiondBackGround', "rgb(33, 33, 33)");
          // document.body.style.setProperty('--suspensiondBackGroundBlur', 0 + 'px');
          // document.body.style.setProperty('--gradient', "linear-gradient(-33deg,#333333, #212121)");
          // document.body.style.setProperty('--suspensiondBackGroundBoxShadow', "0px");

          document.body.style.background = '#191919'
        }

      },
      immediate: true,
      deep: true
    },
    "steamLoginData.refreshToken": {
      handler() {
        this.onRefreshToken()
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

.default-bg{
    background-image:url('https://a.apps.vip/icons/defaultBackground.jpg') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;

}
</style>

