<template>
  <xt-option-box>
    <xt-option-info title="音量" isSwitch v-model:switch="settings.duck">
      <template #right>提示音</template>
    </xt-option-info>
    <xt-option-slider v-model:slider="vol" @cb="setVol" :min="0" :max="100" />
  </xt-option-box>
  <xt-option-box>
    <xt-option-info
      title="屏幕亮度"
      info="调整屏幕亮度需要用到高权限接口，可能造成安全软件误报。"
    />
    <xt-option-slider
      v-model:slider="bright"
      @cb="setBright"
      :min="0"
      :max="100"
    />
  </xt-option-box>
  <xt-option-box>
    <xt-option-info title="音频输出设备" />
    <template v-if="audioList.length">
      <div
        v-for="audio in audioList"
        @click="setAudio(audio, audioList)"
        class="cursor-pointer h-11 flex items-center pl-3 rounded-xl mb-3"
        :class="{ 'xt-theme-bg-2': audio.isDefaultForMultimedia }"
      >
        <Icon icon="yinlianglabashengyin" class="mr-3" />
        {{ audio.name }} ({{ audio.deviceName }})
        <span v-if="audio.deviceId === 'default'">当前</span>
      </div>
    </template>
    <xt-text
      type="2"
      v-else
      class="flex justify-center items-center mb-4"
      title="未检测到输出设备"
    ></xt-text>
  </xt-option-box>
  <xt-option-box>
    <xt-option-info title="音频输入设备" />
    <template v-if="micList.length">
      <div
        v-for="audio in micList"
        @click="setAudio(audio, micList)"
        class="cursor-pointer h-11 flex items-center pl-3 rounded-xl mb-3"
        :class="{ 'xt-theme-bg-2': audio.isDefaultForMultimedia }"
      >
        <Icon icon="maikefeng"></Icon>
        {{ audio.name }}（{{ audio.deviceName }}）
        <span v-if="audio.deviceId === 'default'">当前</span>
      </div>
    </template>
    <xt-text
      type="2"
      v-else
      class="flex justify-center items-center mb-4"
      title="未检测到输入设备"
    ></xt-text>
  </xt-option-box>
</template>

<script>
import { appStore } from "../../../../store";

const loudness = window.loudness;
const brightness = window.brightness;
import { getResPathJoin } from "../../../../js/common/exec";
// const {listOutputs,setAsDefault} =require('@josephuspaye/win-audio-outputs')
import {
  listInputs,
  listOutputs,
  setAsDefault,
} from "../../../../js/ext/audio/audio";
import { mapWritableState } from "pinia";
import BackBtn from "../../../../components/comp/BackBtn.vue";
export default {
  name: "Status",
  components: { BackBtn },
  data() {
    return {
      muted: false,
      vol: 50,
      bright: 50,
      timer: null,
      loaded: false,
      audioList: [],
      micList: [],
      scrollbarSettings: {
        useBothWheelAxes: false,
        minScrollbarLength: 30,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
    };
  },
  computed: {
    ...mapWritableState(appStore, ["settings"]),
  },
  async mounted() {
    this.micList = await listInputs();

    // $('#scroller').on('touchstart',()=>{
    //
    // })

    //   console.log(this.$refs)
    // setTimeout(()=>{
    //   $('scroller').on('mousedown',(e)=>{
    //     cosnole.log('触摸开始')
    //     e.stopPropagation()
    //     e.preventDefault()
    //     return false
    //   })
    //   $('scroller').on('touchstart',(e)=>{
    //     cosnole.log('触摸开始')
    //     e.stopPropagation()
    //     e.preventDefault()
    //     return false
    //   })
    //   $('scroller').on('touchend',(e)=>{
    //     cosnole.log('触摸解锁')
    //     console.log('toucheend')
    //     e.stopPropagation()
    //     return false
    //   })
    //   $('scroller').on('touchmove',(e)=>{
    //     cosnole.log('触摸移动')
    //     e.stopPropagation()
    //     return false
    //   })
    // },200)
    let isDevelopmentMode = "development-mode" in window.globalArgs;
    let path = getResPathJoin(
      "adjust_get_current_system_volume_vista_plus.exe"
    );
    loudness.setCmdPath(path);
    setTimeout(() => {
      //const [audioList, setAudioList] = useState([]);
      //获取音频列表
      this.getSpeakerList();
    }, 0);
    this.loaded = true;
    await this.getVals();

    this.timer = setInterval(() => {
      this.getVals();
    }, 2000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    log(info) {},
    async getSpeakerList() {
      listOutputs()
        .then((devices) => {
          let list = [];
          devices.forEach((device) => {
            device.value = device.id;
            list.push(device);
          });
          this.audioList = list;
        })
        .catch(function (err) {
          console.error(err.name + ": " + err.message);
        });
    },
    async getVals() {
      this.muted = await loudness.getMuted();
      this.vol = await loudness.getVolume();
      this.bright = (await brightness.get()) * 100;
    },
    async setVol() {
      console.log("123 :>> ", 123);
      await loudness.setVolume(Number(this.vol));
      this.gua();
    },
    async setBright() {
      await brightness.set(Number(this.bright) / 100);
      console.log((Number(this.bright) / 100).toFixed(1));
    },
    async setAudio(audio, list) {
      await setAsDefault(audio);
      list.forEach((li) => {
        li.isDefaultForMultimedia = false;
      });
      audio.isDefaultForMultimedia = true;
      // navigator.mediaDevices.selectAudioOutput()
    },
    async gua() {
      if (!this.settings.duck) {
        return;
      }
      let audioSpeaker = document.getElementById("speakerAudio");
      audioSpeaker.play();
    },
    async setMuted() {
      await loudness.setMuted(true);
      this.muted = true;
    },
    async cancelMuted() {
      await loudness.setMuted(false);
      this.muted = false;
      this.gua();
    },
    async shell(cmd, cb) {
      let rs = await ipc.invoke("shell", { cmd });
      if (rs) {
        cb(rs);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.audio {
  border-radius: 0.2em;
  padding: 0.5em;
  font-size: 1.2em;
  cursor: pointer;
  width: 100%;
  word-break: break-all;
  white-space: pre-wrap;

  &.active {
    background: #565656;
    border-radius: 3px;
    font-weight: bold;
  }

  &:hover {
    background: rgba(86, 84, 84, 0.62);
  }
}
</style>
