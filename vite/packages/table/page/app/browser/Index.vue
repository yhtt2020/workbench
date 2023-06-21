<template>
  <div
    style="width: 100%; display: flex; height: 100%; flex-direction: column;padding-right: 10px;padding-bottom: 10px">
    <div
      class="drag"
      style="height: 4em; width: 100%"
    >
      <a-row type="flex">
        <a-col style="display: flex">
          <div @click="goBack" class="app-btn no-drag">
            <div class="btn-wrapper">
              <Icon
                icon="xiangzuo"
                style="font-size: 1.5em; vertical-align: middle"
              ></Icon>
            </div>
          </div>
          <div class="app-btn">
            <div class="btn-wrapper no-drag">
              <Icon
                icon="youjiantou"
                style="font-size: 1.5em; vertical-align: middle;transform: rotate(-180deg)"
              ></Icon>
            </div>
          </div>
          <div class="app-btn">
          <div class="btn-wrapper no-drag">
            <Icon
              icon="youjiantou"
              style="font-size: 1.5em; vertical-align: middle"
            ></Icon>
          </div>
          </div>
          <div @click="refresh" class="app-btn no-drag">
            <div class="btn-wrapper">
              <Icon
                icon="shuaxin"
                style="font-size: 1.5em; vertical-align: middle"
              ></Icon>
            </div>

          </div>
          <!--          <div @click="refresh" class="app-btn no-drag">-->
          <!--            <div class="btn-wrapper">-->
          <!--              <Icon-->
          <!--                icon="home"-->
          <!--                style="font-size: 1.5em; vertical-align: middle"-->
          <!--              ></Icon>-->
          <!--            </div>-->
          <!--          </div>-->
        </a-col>
        <a-col flex="1" style="text-align: center; ">

          <div class="no-drag" v-if="showScale" style="line-height: 3">
            <a-row>
              <a-col :span="6"> 网页缩放</a-col>
              <a-col :span="10">
                <a-slider
                  @change="setScale"
                  :marks="marks"
                  :step="10"
                  v-model:value="scale"
                  :min="50"
                  :max="300"
                  style="width: 100px"
                ></a-slider>
              </a-col>
              <a-col :span="8">
                <a-button-group>
                  <a-button
                    @click="
                      () => {
                        if (this.scale + 10 <= 300) {
                          this.scale = this.scale + 10;
                          this.setScale(this.scale);
                        }
                      }
                    "
                  >
                    <plus-outlined
                    />
                  </a-button>
                  <a-button
                    @click="
                      () => {
                        if (this.scale - 10 >= 20) {
                          this.scale = this.scale - 10;
                          this.setScale(this.scale);
                        }
                      }
                    "
                  >
                    <minus-outlined/>
                  </a-button
                  >
                </a-button-group>
              </a-col>
            </a-row>
          </div>
          <div class="no-drag" v-else style="display: flex">
            <a-input @keyup.enter="addTab" v-model:value="tab.title" class="address-input"></a-input>
            <div @click="refresh" class="app-btn no-drag">
              <div class="btn-wrapper">
                <Icon
                  icon="tianjia2"
                  style="font-size: 1.5em; vertical-align: middle"
                ></Icon>
              </div>
            </div>
          </div>

          <!--        <span style="font-size: 1.2em">您可以通过按下esc键隐藏/显示外框。</span>-->
        </a-col>
        <a-col style="text-align: right">

          <div @click="switchScale" class="app-btn no-drag">
            <Icon
              icon="wenzidaxiao2"
              style="font-size: 1.5em; vertical-align: middle"
            ></Icon>
            <div class="scale">{{ scale }}%</div>
          </div>

          <div class="app-btn no-drag">

            <div
              v-if="fullScreen"
              @click="toggleFullScreen"
              class="btn-wrapper"
            >
              <Icon
                icon="quxiaoquanping_huaban"
                style="font-size: 1.5em; vertical-align: middle"
              ></Icon>
            </div>

            <div v-else @click="toggleFullScreen" class="btn-wrapper">
              <Icon
                icon="quanping_huaban"
                style="font-size: 1.4em; vertical-align: middle"
              ></Icon>
            </div>
          </div>
          <div class="app-btn no-drag">
            <div class="btn-wrapper">
              <Icon
                icon="touping"
                style="font-size: 1.5em; vertical-align: middle"
              ></Icon>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div
      v-if="fullScreen"
      id="frame"
      :style="{ background: tab.theme || 'white' }"
      style="width: 100%; flex: 1"
    ></div>
    <div
      v-else
      id="frame"
      :style="{ background: tab.theme || 'white' }"
      style="width: 100%; flex: 1"
    >
      &nbsp;
    </div>
  </div>
</template>

<script>
import { appStore } from '../../../store'
import { mapWritableState } from 'pinia'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import _ from 'lodash-es'

export default {
  name: 'BrowserIndex',
  data () {
    return {
      tab: {
        url: '',
        title: '',
        id: '',
      },
      showScale: false,
      scale: 100,
      marks: {
        100: '100',
        200: '200',
      },
    }
  },
  components: {
    PlusOutlined,
    MinusOutlined,
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen', 'settings', 'saving']),
  },
  mounted () {
    let params = this.$route.params
    console.log('原始parmas', params)
    if (typeof params.fullScreen === 'undefined') {
      params.fullScreen = false //默认全屏
    } else {
      params.fullScreen = !(params.fullScreen === 'false')
    }
    if (params.fullScreen) {
      this.fullScreen = params.fullScreen
    }
    //非系统应用，则打开内嵌网页
    this.$nextTick(async () => {
      let frame = document.getElementById('frame')
      let position = {
        x: this.fixZoom(frame.getBoundingClientRect().x),
        y: this.fixZoom(frame.getBoundingClientRect().y),
        width: this.fixZoom(frame.offsetWidth),
        height: this.fixZoom(frame.offsetHeight),
      }
      let args = {
        position,
        url: params.url,
      }
      this.tab = await ipc.sendSync('addTableTab', JSON.parse(JSON.stringify(args)))
      console.log('创建出来的tab', this.tab)
      setTimeout(() => {
        ipc.send('getRunningTableTabs')
      }, 3000)
      frame.addEventListener('resize', () => {
        _.debounce(() => {
          this.syncBounds()
        }, 1000)
      })
      setTimeout(() => {
        this.syncBounds()
      }, 600)
    })
  },
  beforeUnmount () {
    this.handleLeave()
  },
  methods: {
    addTab(tab){

    },
    fixZoom (num) {
      return Number(((num * this.settings.zoomFactor) / 100).toFixed(0))
    },
    switchScale () {
      this.showScale = !this.showScale
    },
    setScale (value) {
      ipc.send('setTableTabScale', {
        tab: JSON.parse(JSON.stringify(this.tab)),
        scale: value,
      })
    },
    toggleFullScreen () {
      this.fullScreen = !this.fullScreen
      this.$nextTick(() => {
        this.syncBounds()
      })
    },
    syncBounds () {
      let frame = document.getElementById('frame')
      let position = {
        x: this.fixZoom(frame.getBoundingClientRect().x),
        y: this.fixZoom(frame.getBoundingClientRect().y),
        width: this.fixZoom(frame.offsetWidth),
        height: this.fixZoom(frame.offsetHeight),
      }
      let args = {
        bounds: position,
        tab: this.tab,
      }
      console.log('发送消息', args)
      ipc.send('syncTableTabBounds', JSON.parse(JSON.stringify(args)))
    },
    handleLeave () {
      ipc.send('hideTableTab', {
        tab: JSON.parse(JSON.stringify(this.tab)),
      })
      this.fullScreen = false
    },
    goBack () {
      this.$router.go(-1)
    },
    refresh () {
      ipc.send('refreshTableTab', {
        tab: JSON.parse(JSON.stringify(this.tab)),
      })
    },
  }
  ,
}
</script>

<style scoped lang="scss">
.app-btn {
  display: inline-block;
  cursor: pointer;

  &:hover .btn-wrapper {
    color: #1e1e1e;
    background: #969696;
  }
}

.btn-wrapper {
  font-size: 16px;
  border-radius: 0.5em;
  padding: 0.4em 0.8em;
  margin: 0.3em 0.4em;
}

.scale {
  display: inline-block;
  width: 3em;
  font-weight: bold;
}

.address-input {
  line-height: 32px;
  height: 32px;
  border-radius: 100px;

  border: none;
  margin: 10px;
  padding: 0;
  padding-left: 20px;
  flex: 1;
  background: var(--secondary-bg);
}
</style>
