<template>
  <div class="music-player-wrapper s-bg m-3" style="
      text-align: center;
      display: flex;
      align-items: center;
      max-width: 98%;
      height: 95%;
      border-radius: 8px;
      margin: auto;
      margin-top: 1em;
      color: var(--primary-text);
      background: var(--primary-bg);
    ">
    <a-row :gutter="[20]" style="width: 100%">
      <a-col :span="showPrompt ? 12 : 24" style="display: flex; align-items: center; justify-content: center">
        <div class="music-player" style="max-width:500px; height: 410px; display: inline-block">
          <div class="pointer" @click="enterMusic">
            <a-avatar :class="{ playing: status.music.playing }" :size="120" :src="status.music.cover"
              style="margin: 16px; border: 3px solid #6b6b6b">点击选歌播放</a-avatar>
          </div>
          <div style="font-size: 1.8em">{{ status.music.title }}</div>
          <div style="font-size: 1.1em;  " class="singer xt-text-2">
            {{ status.music.singer }}
          </div>
          <div style="max-width: 400px; margin: auto" class="player px-3">
            <a-slider v-model:value="status.music.percent" />
          </div>
          <div style="font-size: 1.5em">
            {{ status.music.progress }} / {{ status.music.total }}
          </div>
          <div :style="{ zoom: tab === 'player' ? 1 : 0.5 }" style="text-align: center; margin-top: 0.8em">
            <div style="width: 250px; margin: auto">
              <a-row>
                <a-col @click="doAction('prev')" :span="8" style="padding-top: 1em">
                  <Icon class="player-icon" icon="shangyishou"></Icon>
                </a-col>
                <a-col @click="doAction('pause')" v-if="status.music.playing" :span="8">
                  <Icon class="player-icon" style="font-size: 6em" icon="zanting"></Icon>
                </a-col>
                <a-col @click="doAction('play')" v-else :span="8">
                  <Icon class="player-icon" style="font-size: 6em" icon="bofang"></Icon>
                </a-col>
                <a-col @click="doAction('next')" :span="8" style="padding-top: 1em">
                  <Icon class="player-icon" icon="xiayishou"></Icon>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="12" v-if="showPrompt" style="align-items: center; display: flex">
        <div style="
            background: var(--primary-bg);
            border-radius: 1em;
            display: flex;
            align-items: center;
          ">
          <div v-html="prompt" id="prompt" class="listlyric j-flag" style="color:var(--primary-text)"></div>
        </div>
      </a-col>
    </a-row>
  </div>

  <div @click="togglePrompt" style="position: absolute; right: 3em; top: 43vh; z-index: 99">
    <Icon icon="zimu" style="font-size: 4em;color: var(--primary-text);"></Icon>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { appStore } from "../store";
import SecondPanel from "../components/SecondPanel.vue";
import { SystemApps } from "../consts";
import { message } from "ant-design-vue";

let fs = require("fs");
export default {
  name: "Apps",
  components: { SecondPanel },
  computed: {
    ...mapWritableState(appStore, ["status"]),
  },
  mounted() {
    //确认自启动，如果未启动，则静默启动
    let running = ipc.sendSync("ensureTableApp", {
      app: SystemApps.wyyMusic,
    });
    if (!running) {
      //不再提示 message.info('正在为您在后台启动网易云音乐网页版…')
    }
    //window.updateMusicStatusHandler = this.updateStatus
  },
  data() {
    return {
      scrollTop: 0,
      prompt: "",
      tab: "player",
      currentIndex: "my",
      showPrompt: false,
      menus: [
        {
          title: "我的应用",
          index: "my",
          icon: "",
        },
        {
          title: "轻应用",
          index: "qing",
        },
        {
          title: "应用市场",
          icon: "",
          index: "store",
        },
      ],
    };
  },
  watch: {
    "status.music": function (newValue, oldValue) {
      let status = newValue;
      if (status.prompt) {
        this.prompt = status.prompt;
        this.scrollTop = status.scrollTop;
        if (document.getElementById("prompt")) {
          document.getElementById("prompt").scrollTop = this.scrollTop;
        }
      }
      //document.getElementById('prompt').scrollTop=this.scrollTop
      this.getPercent();
    },
  },
  methods: {
    togglePrompt() {
      if (!this.showPrompt) {
        this.doAction("prompt");
      }
      this.showPrompt = !this.showPrompt;
    },
    enterMusic() {
      this.$router.push({
        name: "app",
        params: SystemApps.wyyMusic,
      });
    },
    doAction(action) {
      require("electron").ipcRenderer.send("wyyAction", { action });
    },

    getPercent() {
      let currentText = this.status.music.progress.split(":");
      let current;
      if (currentText.length === 2) {
        current = new Date(
          "2023/1/1 00:" + currentText[0] + ":" + currentText[1]
        );
      }
      let totalText = this.status.music.total.split(":");
      let total;
      if (totalText.length === 2) {
        total = new Date("2023/1/1 00:" + totalText[0] + ":" + totalText[1]);
      }

      let totalSeconds =
        total.getHours() * 60 * 60 +
        total.getMinutes() * 60 +
        total.getSeconds();
      let currentSeconds =
        current.getHours() * 60 * 60 +
        current.getMinutes() * 60 +
        current.getSeconds();
      this.status.music.percent = (
        (currentSeconds / totalSeconds) *
        100
      ).toFixed(0);
    },

    changeTab(data) {
      this.currentIndex = data.index;
    },
  },
  beforeUnmount() {
    if (!this.status.music.playing) {
      ipc.send("closeTableApp", {
        app: JSON.parse(JSON.stringify(SystemApps.wyyMusic)),
      });
    }
  },
};
</script>
<style>
.ant-slider-track {
  background: #1a1a1a;
}

.ant-slider-track {
  height: 8px;
  border-radius: 100px;
}

.ant-slider-rail {
  height: 8px;
  border-radius: 100px;
}

.ant-slider-handle {
  border-color: #333;
  width: 20px;
  height: 20px;
}

.z-sel {
  color: var(--active-bg) !important;
  font-size: 14px !important;
  -webkit-transition: color 0.7s linear;
  -moz-transition: color 0.7s linear;
  -o-transition: color 0.7s linear;
  transition: color 0.7s linear;
  font-weight: bold;
}

.listlyric p {
  color:var(--secondary-text);
  word-wrap: break-word;
  text-align: center;
  line-height: 32px;
  height: auto !important;
  height: 32px;
  min-height: 32px;
  -webkit-transition: color 0.7s linear;
  -moz-transition: color 0.7s linear;
  -o-transition: color 0.7s linear;
  transition: color 0.7s linear;
  font-size: 12px;
  margin-bottom: 0;
}
</style>
<style scoped lang="scss">
.player-icon {
  font-size: 4em;
  vertical-align: middle;
}

// :deep(.listlyric) {
// background: var(--primary-bg);
// margin: 0 !important;
//   p {
//     color: var(--primary-text) !important;

//   }
// }
.app-content {
  background: #3b3b3b;
  height: calc(100vh - 2em);
  margin-left: 11em;
  border-radius: 8px;
}

.app {
  display: inline-block;
  width: 5em;
  text-align: center;
  vertical-align: text-top;
  padding: 0.5em;
  margin: 0.5em;
  cursor: pointer;

  &:hover {
    background: #969696;
    border-radius: 4px;
  }

  .name {
    font-size: 0.8em;
    word-break: break-all;
  }
}

.listlyric {
  padding: 10px;
  text-align: center;
  zoom: 1.3;
  top: 0;
  z-index: 4;
  margin: auto;
  height: 250px;
  width: 354px;
  overflow: hidden;
  scroll-behavior: smooth;
}

@media screen and (max-height: 618px) {
  .music-player-wrapper {
    zoom: 0.8;
  }
}

@media screen and (min-height: 618px) and (max-height: 800px) {
  .music-player-wrapper {
    zoom: 1;
  }
}

@media screen and (min-height: 801px) and (max-height: 2800px) {
  .music-player-wrapper {
    zoom: 1.3;
  }
}
</style>
