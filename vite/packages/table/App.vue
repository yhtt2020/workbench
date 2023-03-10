<template>
  <a-config-provider :locale="locale">
    <div class="a-container" :class="{ dark: settings.darkMod }">
      <router-view></router-view>
    </div>
    <Barrage></Barrage>
  </a-config-provider>
  <a-modal v-model:visible="visible" @ok="handleOk" @cancel="handleOk">
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
    </template></a-modal
  >
</template>

<script lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { mapActions, mapWritableState } from "pinia";

import { appStore, tableStore } from "./store";
import Barrage from "./components/comp/Barrage.vue";
import { weatherStore } from "./store/weather";

let startX,
  startY,
  moveEndX,
  moveEndY,
  X,
  Y = 0;
const distX = 80; //滑动感知最小距离
const distY = 80; //滑动感知最小距离
export default {
  components: { Barrage },
  data() {
    return {
      touchDownRoutes: ["home", "lock"], //支持下滑的页面的白名单
      touchUpRoutes: ["home", "lock"], //支持下滑的页面的白名单
      locale: zhCN,
      visible: false,
    };
  },
  async mounted() {
    this.reset(); //重置部分状态
    // this.getUserInfo()
    window.updateMusicStatusHandler = this.updateMusic;

    if (this.settings.darkMod) {
      document.body.style.background = "rgb(50,50,50)";
    }
    this.bindTouchEvents();
    this.reloadAll(); //刷新全部天气
  },

  computed: {
    ...mapWritableState(tableStore, [
      "customComponents",
      "clockEvent",
      "appDate",
    ]),
    ...mapWritableState(appStore, ["settings", "routeUpdateTime", "userInfo"]),
  },
  watch: {
    "appDate.minutes": {
      handler(newVal, oldVal) {
        try {
          if (
            this.appDate.minutes === this.clockEvent[0].dateValue.minutes &&
            this.appDate.hours === this.clockEvent[0].dateValue.hours
          ) {
            this.visible = true;
          }
        } catch (err) {
          console.log(err);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapActions(appStore, ["setMusic", "reset"]),
    ...mapActions(weatherStore, ["reloadAll"]),
    ...mapActions(tableStore, ["removeClock"]),
    handleOk() {
      this.visible = false;
      this.removeClock(0);
      console.log(123);
    },
    bindTouchEvents() {
      $(".a-container").on("touchstart", (e) => {
        (startX = e.originalEvent.changedTouches[0].pageX),
          (startY = e.originalEvent.changedTouches[0].pageY);
      });
      $(".a-container").on("touchend", (e) => {
        (moveEndX = e.originalEvent.changedTouches[0].pageX),
          (moveEndY = e.originalEvent.changedTouches[0].pageY),
          (X = moveEndX - startX),
          (Y = moveEndY - startY);

        if (X > distX) {
          console.log("向右滑", distX);
          //e.preventDefault();
        } else if (X < -distX) {
          console.log("向左滑", distX);
          //e.preventDefault();
        } else if (Y > distY && startY <= 50) {
          if (this.touchDownRoutes.indexOf(this.$route.name) > -1) {
            ipc.send("openGlobalSearch");
            e.preventDefault();
          }
        } else if (Y < -distY) {
          if (this.touchUpRoutes.indexOf(this.$route.name) > -1) {
            this.$router.push({ name: "status" });
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
    ...mapActions(appStore, []),
    // async getUserInfo() {
    //   let rs = await tsbApi.user.get()
    //   if (rs.status === 1) {
    //     console.log(rs.data.user_info)
    //     this.userInfo=rs.data.user_info
    //   }
    // }
  },
};
</script>

<style>
@import "./assets/common.css";

.a-container {
  width: 100%;
}
</style>
