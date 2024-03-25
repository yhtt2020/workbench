<template>
  <div
    style="
      display: flex;
      height: 100vh;
      text-align: center;
      align-content: center;
      align-items: center;
      background: #333;
      justify-content: center;
    "
    class="drag"
  >
    <!-- 加载动画 -->
    <div v-if="launching" style="margin: auto">
      <div class="mb-5 animate-bounce">
        <a-avatar
          :size="60"
          src="https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?imageMogr2/crop/260x260/gravity/center"
        ></a-avatar>
      </div>
      <div style="font-size: 1.2em">
        <svg
          style="vertical-align: text-bottom"
          class="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        欢迎回来，又是元气满满的一天！
      </div>
    </div>
    <!-- 加载完成 -->
    <div v-else style="background: #333; width: 100vw; height: auto" class="">
      <div
        class="p-10 rounded-lg no-drag s-bg"
        style="width: 600px; margin: auto"
      >
        <h3 style="text-align: center; font-size: 1.5em">
          <a-avatar
            style="vertical-align: top"
            src="/icons/logo128.png"
          ></a-avatar>
          天天工作台
        </h3>
        <div class="mb-10 ml-40 text-center text-md">
          —— 划时代的副屏效率神器
        </div>
        <!-- 未登录 -->
        <div v-if="!userInfo">
          <div class="mb-5 xt-text" style="font-size: 16px">
            由于本产品功能需要借助网络，如您不希望登录，则可使用离线模式，此模式下，依赖于网络的功能将被隐藏。<br />
            <strong>请登录后使用。</strong>
          </div>
          <div class="mb-10 xt-text-2">
            如遇网络问题，请检查系统代理或耐心等待。
          </div>
          <a-row :gutter="10" class="w-full">
            <a-col flex="1">
              <xt-button
                size="mini"
                style="width: 100%"
                type="theme"
                @click="login"
                >登录账号</xt-button
              >
            </a-col>
            <a-col flex="1">
              <xt-button size="mini" style="width: 100%" @click="onGuest"
                >游客模式</xt-button
              >
            </a-col>
            <a-col flex="150px" v-if="netError">
              <xt-button style="width: 100%" @click="getUserInfo"
                >重试</xt-button
              >
            </a-col>
          </a-row>
        </div>
        <!-- 已登录 -->
        <div class="text-center" v-else>
          <div class="inline-block mt-3 mb-3">
            <div>
              <a-avatar :size="68" :src="userInfo.avatar"></a-avatar>
            </div>
            <div class="mt-4 text-lg">你好，{{ userInfo.nickname }}</div>
          </div>
        </div>
        <div class="flex">
          <a-button
            block
            v-if="userInfo"
            type="primary"
            size="large"
            class="m-3"
            @click="goDirect"
            >开始使用</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { message, Modal } from "ant-design-vue";
import { appStore } from "../store";
import { mapWritableState, mapActions } from "pinia";
import { codeStore } from "../store/code";
import { cardStore } from "../store/card";
import { deckStore } from "../apps/deck/store";
import { paperStore } from "../store/paper";
import { weatherStore } from "../store/weather";
import { screenStore } from "../store/screen";
import { isMain } from "../js/common/screenUtils";
import { teamStore } from "../store/team";
import { steamUserStore } from "../store/steamUser";
import { captureStore } from "../store/capture";
import { navStore } from "../store/nav";
import { clipboardStore } from "../apps/clipboard/store";
import { browserStore } from "../store/browser";
import { controlStore } from "../components/desk/navigationBar/hook/controlStore";
// import { chatStore } from "../store/chat";
import taskStore from "../page/app/todo/stores/task";
import cache from "../components/card/hooks/cache";
import { offlineStore } from "../js/common/offline";
import { useWidgetStore } from "../components/card/store";
// import { clockStore } from '../components/widgets/clock/hooks/clockStore';
import { useLogin } from "../permission/user/useLogin";
export default {
  name: "Code",
  data() {
    return {
      loginVisible: false,
      showTip: false,
      loading: false,
      netError: false,
      code: "",
      launching: true,
      storeReadyTimer: null,
      launched: false,
      modal: null,
      timeoutHandler: null,
      version: window.$useEnv() ? "" : tsbApi.runtime.appVersion,
      // 超时定时器
      timeout: null,
    };
  },
  async mounted() {
    Promise.all([
      // 这个没走db 单独处理
      controlStore(),
      browserStore().bindIPC(),
      this.bindIPC(),
      //启动检测项的store，必须已经载入的项目，如果这边不写，就不确保必须载入完成
      //注意，此处的第二个参数，必须和此store同名，尤其注意有些命名里带了store的
      await captureStore(),
      await this.initStore(appStore, "appStore"),
      await this.initStore(codeStore, "code"),
      await this.initStore(cardStore, "cardStore"),
      await this.initStore(weatherStore, "weather"),
      await this.initStore(paperStore, "paper"),
      await this.initStore(deckStore, "deck"),
      await this.initStore(screenStore, "screen"),
      await this.initStore(teamStore, "teamStore"),
      await this.initStore(navStore, "nav"),
      await this.initStore(taskStore, "task"),
      await this.initStore(useWidgetStore, "useWidgetStore"),
      await this.initStore(offlineStore, "offlineStore"),
      await this.initStore(clipboardStore, "clipboardStore"),
    ]);
    // 新增一个定时器 用于异常情况清空loading
    this.timeout = setTimeout(() => {
      this.launching = false;
    }, 5000);

    setTimeout(() => {
      this.storeReadyTimer = setInterval(() => {
        let haventOk = Object.keys(window.loadedStore).filter((key) => {
          let check = !window.loadedStore[key];
          if (window.loadedStore[key] === false) return check;
        });
        //已经全部搞定
        if (haventOk.length <= 0) {
          console.log("确认完成加载 :>> ");
          clearInterval(this.storeReadyTimer);
          this.afterLaunch();
        }
      }, 500);
    }, 100);
    // this.bindUserInfoResponse();
    // this.getUserInfo();
    this.sortClock();
  },
  computed: {
    ...mapWritableState(codeStore, ["myCode", "serialHash"]),
    ...mapWritableState(appStore, [
      "aided",
      "settings",
      "routeUpdateTime",
      "userInfo",
      "init",
      "lvInfo",
      "backgroundImage",
      "style",
      "visibleWeb",
    ]),
    ...mapWritableState(navStore, [
      "sideNavigationList",
      "footNavigationList",
      "rightNavigationList",
    ]),
    // ...mapWritableState(offlineStore, ['isOffline']),
  },
  methods: {
    ...mapActions(cardStore, ["sortClock", "sortCountdown"]),
    ...mapActions(screenStore, ["bindMainIPC", "bindSubIPC", "onTableStarted"]),
    ...mapActions(codeStore, ["active", "getSerialHash", "verify"]),
    ...mapActions(appStore, [
      "getUserInfo",
      "setUser",
      "enterAided",
      "ensureShake",
      "finishWizard",
    ]),
    ...mapActions(steamUserStore, ["bindClientEvents"]),
    ...mapActions(captureStore, ["bindCaptureIPC"]),
    async bindIPC() {
      if (isMain()) {
        this.bindMainIPC();
      } else {
        this.bindSubIPC();
      }
    },

    // 感觉不需要
    goDirect() {
      if (this.$useEnv()) {
        this.$router.replace({ name: "home" });
        return;
      }
      this.$router.replace({ name: "wizard" });
      localStorage.setItem("wizarded", '1');
    },
    enter() {
      clearTimeout(this.timeoutHandler); //清理掉超时提示
      // chatStore().login();
      if (localStorage.getItem("wizarded")) {
        const currentRoute = appStore().currentRoute;
        if (currentRoute) {
          if (["lock", "power", "splash"].includes(currentRoute.name) || true) {
            //阻止lock、power页面的自动跳转
            this.$router.replace({ name: "home" });
          } else {
            // 处理分屏情况下默认跳转到wizard的问题
            if (currentRoute.name == "wizard" && !isMain()) {
              this.$router.replace({ name: "home" });
            } else {
              this.$router.replace(currentRoute);
            }
          }
        } else {
          this.$router.replace({ name: "home" });
        }
      } else {
        // 处理分屏情况下默认读取不到存储的问题
        if (!isMain()) {
          const currentRoute = appStore().currentRoute;
          if (currentRoute.name == "wizard" || currentRoute.name == "splash") {
            this.$router.replace({ name: "home" });
          } else {
            this.$router.replace(currentRoute);
          }
        }
      }
    },
    // 大概不需要了
    bindUserInfoResponse() {
      if (window.$useEnv()) return;

      ipc.removeAllListeners("userInfo");
      ipc.on("userInfo", async (event, args) => {
        if (args.data.uid === -2) {
          this.netError = true;
          message.error({
            content: "网络错误，请重试",
            key: "net",
          });
        }
        this.tipped = false;
        this.loading = false;
        if (args.data.uid <= 0) {
          // 网络异常 或者 游客模式 下 会卡在当前状态
          window.loadedStore["userInfo"] = true;
          return;
        }

        const userInfo = args.data;
        console.log("ipc", userInfo);
        let lvInfo = this.lvInfo;
        lvInfo.lv = userInfo.onlineGradeExtra.lv;
        // 当前等级的区间
        let current = this.gradeTableGenerate(64)[lvInfo.lv];
        // 下一等级的区间
        let section = this.gradeTableGenerate(64)[lvInfo.lv + 1];
        let remain = section[0] * 60 - userInfo.onlineGradeExtra.minutes;
        lvInfo.remainHour = Math.floor(remain / 60);
        lvInfo.remainMinute = remain - Math.floor(remain / 60) * 60;
        lvInfo.minute = userInfo.onlineGradeExtra.minutes;
        lvInfo.percentage =
          ((lvInfo.minute - current[0] * 60) /
            ((current[1] - current[0]) * 60)) *
          100;
        //this.lvInfo = lvInfo
        window.loadedStore["userInfo"] = true;
        this.setUser(userInfo);
        if (this.$route.name === "splash") {
          this.enter();
        }
      });
    },
    async initStore(store, name) {
      // loadedStore 不存在初始化对象
      if (!window.loadedStore) {
        window.loadedStore = {};
      }

      console.log("name :>> ", name);
      // console.log('window.loadedStore[name] :>> ', window.loadedStore[name]);

      if (typeof window.loadedStore[name] === "undefined") {
        window.loadedStore[name] = false;
      }
      let res = await store();
      return res;
    },

    async afterLaunch() {
      // web端登录拦截
      if (this.$useEnv("web")) {
        this.loginOk();
        return;
      }
      /**
       * 开始初始化
       * 具体执行不知道 不用管
       */

      if (this.aided) {
        message.warn(
          "当前应用正运行在辅助模式下，无法被聚焦。如需退出，请到【设置】界面关闭。"
        );
        this.enterAided();
      }
      this.bindCaptureIPC();

      this.bindClientEvents();

      clipboardStore().prepare();
      clipboardStore().start();

      //执行分屏的启动操作
      this.onTableStarted().then();
      if (!this.settings.zoomFactor) {
        this.settings.zoomFactor = 100;
      }

      this.ensureShake(false); //确认摇一摇功能状态
      await tsbApi.window.setZoomFactor(+this.settings.zoomFactor / 100); //根据设置进行缩放比的强制调整
      tsbApi.window.setSkipTaskbar(!this.settings.showInTaskBar);
      /**
       * 初始化完成
       */
      this.loginOk();
    },
    login() {
      useLogin(() => {
        this.loginOk();
      });
    },

    loginOk() {
      // 完成引导并登录
      console.log("this.userInfo  :>> ", this.userInfo);
      if (this.userInfo && this.init) {
        this.enter();
        return;
      }
      // 首次web端引导
      if (!this.init && this.$useEnv("web")) {
        this.finishWizard();
        this.visibleWeb = true;
        return;
      }
      // 首次客户端引导
      if (!this.init && isMain()) {
        this.$router.replace({ name: "wizard" });
        return;
      }

      // 未登录
      this.launching = false;
    },
    onGuest() {
      this.$router.replace({ name: "home" });
      if (!this.init && this.$useEnv("web")) {
        this.finishWizard();
        this.visibleWeb = true;
      }
      cache.set("isGuest", true);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
};
</script>

<style>
.ant-modal-body {
  -webkit-app-region: no-drag;
}
</style>
