<script lang="ts">
import {defineComponent} from 'vue'
import HorizontalCapture from "../HorizontalCaptrue.vue";
import VueCustomScrollbar from "../../../../src/components/vue-scrollbar.vue";
import VideoItem from "../game/VideoItem.vue";
import BackBtn from "../comp/BackBtn.vue";
import {AreaChartOutlined} from "@ant-design/icons-vue";
import {mapActions, mapState, mapWritableState} from "pinia";
import {captureStore} from "../../store/capture";
import {steamUserStore} from "../../store/steamUser";

export default defineComponent({
  name: "SourceSelector",
  components: {AreaChartOutlined, BackBtn, VideoItem, VueCustomScrollbar, HorizontalCapture},
  data() {
    return {
      defaultIndex: 0,
      loading: false,
      captureType: [
        // {title:'录游戏',name:'recordGame'},
        {title: '捕获窗口', name: 'logger'},
        {title: '捕获全屏', name: 'recordFullScreen'},

      ],
      recordGameData: [],
      recordLogger: [
        // {url:'/public/img/test.png',name:'程序3'},
        // {url:'/public/img/test.png',name:'程序4'},
      ],
      simpleImage: '/public/img/test/not-data.png',
      defaultRecordingType: {title: '录窗口', name: 'logger'},
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  computed: {
    ...mapState(steamUserStore, ['runningGame']),
    ...mapWritableState(captureStore, ['currentSource','sources', 'settings', 'images', 'videos']),
    windowSource() {
      return this.sources.filter(s => {
        return s.type === 'window'
      })
    },
    deskSource() {
      return this.sources.filter(s => {
        return s.type === 'screen'
      })
    }
  },
  mounted() {
    this.refreshSource(() => {
      let source = this.findWindow()
      if (source) {
        this.currentSource = source
        this.step = 2
      }
    })
  },
  methods: {
    ...mapActions(captureStore, ['getSource']),
    refreshSource(cb) {
      this.sources = []
      this.loading = true
      this.getSource()
      let timer = setInterval(() => {
        if (this.sources.length > 0) {
          this.loading = false
          clearInterval(timer)
          if (cb) {
            cb()
          }
        }
      }, 500)
    },
    chooseSource(source) {
      this.currentSource = source
      this.$emit('choosenSource', {source})
    },
    /**
     * 查找源
     */
    findWindow () {
      if (!this.runningGame.chineseName) {
        return false
      }
      let source = this.sources.find(s => {
        if (s.name.toLowerCase() === this.runningGame.chineseName.toLowerCase()) {
          return true
        }
      })
      return source
    },
  }
})
</script>

<template>
  <!--  选择录制源    -->
  <div style="width: 550px;max-height: 600px;padding:20px">
    <div style="max-height: 550px;display: flex;flex-direction: column;overflow: hidden;position: relative">
      <div style="width: 300px;margin: auto">
        <HorizontalCapture @click="refreshSource" :navList="captureType" v-model:selectType="defaultRecordingType"
                           class="mb-4"></HorizontalCapture>
      </div>

      <div class="text-center" v-if="loading===true">
        捕获源获取中…
      </div>
      <div v-else style="flex:1;height: 0">
        <template v-if="defaultRecordingType.name === 'recordFullScreen'">
          <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                                style="max-height:450px;position:relative;height: 450px;padding-right: 15px">
            <div v-if="deskSource.length === 0">
              <a-empty :image="simpleImage"/>
            </div>
            <div class="flex justify-between flex-wrap" v-else>
              <div v-for="(item,index) in  deskSource"
                   class="flex flex-col capture-bg rounded-lg mb-4 pointer record-game-item"
                   @click="chooseSource(item,index)" :class="{'s-active':defaultIndex === index}"
              >
                <img :src="'file://'+item.src" class="w-full rounded-t-lg h-full object-cover">
                <div class="px-4 py-3">
                  <span class="truncate capture-title" style="max-width:207px;">{{ item.name }} </span>
                </div>
              </div>
            </div>
          </vue-custom-scrollbar>
        </template>
        <template v-if="defaultRecordingType.name === 'logger'">
          <vue-custom-scrollbar @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller"
                                style="max-height:450px;position:relative;height:450px;padding-right: 15px">
            <div v-if="windowSource.length === 0">
              <a-empty :image="simpleImage"/>
            </div>
            <div class="flex justify-between flex-wrap" v-else>
              <div v-for="(item,index) in  windowSource"
                   class="flex flex-col justify-between capture-bg rounded-lg mb-4 pointer record-game-item"
                   @click="chooseSource(item,index)" :class="{'s-active':defaultIndex === index}"
              >
                <img :src="'file://'+item.src" class="w-full rounded-t-lg h-full object-cover">
                <div class="px-4 py-3 truncate">
                  <span class="capture-title" style="max-width:207px;">{{ item.name }} </span>
                </div>
              </div>
            </div>
          </vue-custom-scrollbar>
        </template>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.capture-bg{
  background: var(--primary-bg);
}

.cap-active{
  color: var(--active-text);
}

.capture-title{
  color:var(--primary-text);
}
.cp-w {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 140px;
}

.cp-lw {
  width: 64px;
  height: 64px;
}
.record-game-item {
  max-width: 234px;
}
</style>
