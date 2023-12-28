<template>

  <div
    style="width: 100%; display: flex; height: 100%; flex-direction: column;padding-right: 10px;padding-bottom: 10px">
    <back-btn style="margin-top: -20px;margin-left: -20px"></back-btn>
    <div
      class="drag"
      style="height: 4em; width: 100%"
    >
      <a-row type="flex">

        <a-col style="display: flex">
          <div class="app-btn no-drag" style="width:60px">
            <!--            <div class="btn-wrapper">-->
            <!--              <Icon-->
            <!--                icon="xiangzuo"-->
            <!--                style="font-size: 1.5em; vertical-align: middle"-->
            <!--              ></Icon>-->
            <!--            </div>-->

          </div>

          <div @click="goBack" class="app-btn">
            <div class="btn-wrapper no-drag">
              <Icon
                icon="youjiantou"
                style="font-size: 1.5em; vertical-align: middle;transform: rotate(-180deg)"
              ></Icon>
            </div>
          </div>
          <div @click="goForward" class="app-btn">
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
        <a-col flex="1" style="text-align: center;width: 0 ">

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
            <!--      网址输入框      -->

            <a-input style="font-weight: bold" @blur="this.showEdit=false" spellcheck="false" v-if="showEdit"
                     @keyup.enter="addTab"
                     v-model:value="urlInput" class="address-input xt-bg"></a-input>
            <div @click="showEdit=true" class="xt-bg xt-text truncate"
                 style="font-weight:bold;text-align:left;border-radius: 100px;height: 32px;line-height:32px;color: white;padding-left: 20px;width: 100%;margin-top: 10px;margin-left: 10px;margin-right: 10px"
                 v-else>
              <template v-if="currentTab && currentTab.favicons">
                <a-avatar shape="square" :size="18" :src="currentTab.favicons[0]"></a-avatar>
              </template>
              <span v-if="currentTab.url">&nbsp;{{ currentTab.title }}</span><span v-else>工作台浏览器</span>
            </div>
            <div @click="addNewTab" class="app-btn no-drag">
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
            <div class="btn-wrapper" style="position: relative">
              <Icon
                icon="wenzidaxiao2"
                style="font-size: 1.5em; vertical-align: middle"
              ></Icon>
              <div class="scale">{{ scale }}%</div>
            </div>
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
          <div @click="showTabs" class="app-btn no-drag">
            <div class="btn-wrapper" style="position: relative">
              <Icon icon="fuzhi" style="width: 24px;height:24px;font-size: 32px;transform: translateY(4px) "></Icon>
              <span
                style="position: absolute;width: 24px;height: 24px;text-align: center;line-height: 24px;font-weight: bold;font-size: 12px;left: 11px;transform: translateY(4px)">{{
                  runningTabs.length
                }}</span>
            </div>
          </div>
          <div v-if="false" class="app-btn no-drag">
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

      style="width: 100%; flex: 1"
    >
      <div class="nav-list">
        <div @click="openUrl(item.url)" class="nav-item" v-for="item in navList">
          <div class="nav-logo">
            <a-avatar :size="80" :src="item.logo" shape="square"></a-avatar>
          </div>
          <div class="nav-title">
            {{item.title}}
          </div>
        </div>
      </div>

    </div>
    <div
      v-else
      id="frame"
      style="width: 100%; flex: 1;background: rgba(0,0,0,0.2)"
      :style="{zoom:this.scale/100}"
    >
      <div class="nav-list">
        <div @click="openUrl(item.url)" class="nav-item" v-for="item in navList">
          <div class="nav-logo">
            <a-avatar :size="80" :src="item.logo" shape="square"></a-avatar>
          </div>
          <div class="nav-title">
            {{item.title}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appStore } from '../../../store'
import { mapWritableState, mapActions } from 'pinia'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'
import _ from 'lodash-es'
import { browserStore } from '../../../store/browser'
import Template from '../../../../user/pages/Template.vue'
import runningApps from '../../../components/bottomPanel/RunningApps.vue'
import BackBtn from '../../../components/comp/BackBtn.vue'
import Avatar from '../../../components/desk/navigationBar/components/Avatar.vue'
import homeList from './browserHome'
export default {
  name: 'BrowserIndex',
  data () {
    return {
      showScale: false,
      scale: 100,
      marks: {
        100: '100',
        200: '200',
      },
      urlInput: '',//用户输入的地址
      showEdit: false,
      navList:homeList
    }
  },
  components: {
    Avatar,
    BackBtn,
    Template,
    PlusOutlined,
    MinusOutlined,
  },
  computed: {
    runningApps () {
      return runningApps
    },
    ...mapWritableState(appStore, ['fullScreen', 'settings', 'saving']),
    ...mapWritableState(browserStore, ['currentTab', 'runningTabs'])
  },
  mounted () {
    this.setEvent('addedTab', this.addedTab)
    ipc.send('getRunningTableTabs')
    let params = this.$route.params
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
      if (params.id) {
        //如果是直接切换到某个tab
        this.switchToTab(params.id)
        return
      }
      if (params.url) {
        //如果存在需要打开的url
        await this.invokeAddTab({ url: params.url })
        setTimeout(() => {
          ipc.send('getRunningTableTabs')
        }, 3000)

      } else {
        //如果已经存在tab了
        if (this.currentTab.id) {
          this.switchToTab(this.currentTab.id)
        }
      }
      let frame = document.getElementById('frame')
      frame.addEventListener('resize', () => {
        _.debounce(() => {
          this.syncBounds()
        }, 1000)
      })
    })

  },
  beforeUnmount () {
    this.handleLeave()
  },
  methods: {
    ...mapActions(browserStore, ['updateTabCapture', 'setEvent']),
    switchToTab (id) {
      let found = this.runningTabs.find(tab => {
        return tab.id === id
      })
      if (found) {
        this.currentTab = found
        this.urlInput = this.currentTab.url
        ipc.send('showTableTab', { id: id, position: this.getContentBounds() })
      }

    },
    async addTab () {
      await this.invokeAddTab({ url: this.urlInput })
    },
    async addNewTab () {
      await this.invokeAddTab({ url: 'about:blank' })
    },
    async openUrl(url){
      await this.invokeAddTab({ url: url })
    },
    fixZoom (num) {
      return Number(((num * this.settings.zoomFactor) / 100).toFixed(0))
    },
    /**
     * 执行添加一个tab
     * @param tab
     * @returns {Promise<void>}
     */
    getContentBounds () {
      let frame = document.getElementById('frame')
      let position = {
        x: this.fixZoom(frame.getBoundingClientRect().x),
        y: this.fixZoom(frame.getBoundingClientRect().y),
        width: this.fixZoom(frame.offsetWidth),
        height: this.fixZoom(frame.offsetHeight),
      }
      return position
    },
    async invokeAddTab (tab) {

      let args = {
        position: this.getContentBounds(),
        url: tab.url,
      }
      await ipc.send('addTableTab', JSON.parse(JSON.stringify(args)))
    },
    addedTab (args) {
      const { tab } = args
      this.currentTab = tab
      this.urlInput = this.currentTab.url
      this.runningTabs.push(JSON.parse(JSON.stringify(this.currentTab)))
    },
    /**
     * 切换缩放
     */
    switchScale () {
      this.showScale = !this.showScale
    },
    /**
     * 设置网页的缩放
     * @param value
     */
    setScale (value) {
      ipc.send('setTableTabScale', {
        tab: JSON.parse(JSON.stringify(this.currentTab)),
        scale: value,
      })
    },
    /**
     * 显示当前的全部tabs
     */
    showTabs () {
      this.$router.push({
        name: 'browserTabs'
      })
    },
    toggleFullScreen () {
      this.fullScreen = !this.fullScreen
      this.$nextTick(() => {
        this.syncBounds()
      })
    },
    /**
     * 同步边框位置
     */
    syncBounds () {
      if (!this.currentTab) {
        return
      }
      let frame = document.getElementById('frame')
      let position = {
        x: this.fixZoom(frame.getBoundingClientRect().x),
        y: this.fixZoom(frame.getBoundingClientRect().y),
        width: this.fixZoom(frame.offsetWidth),
        height: this.fixZoom(frame.offsetHeight),
      }
      let args = {
        bounds: position,
        tab: this.currentTab,
      }
      ipc.send('syncTableTabBounds', JSON.parse(JSON.stringify(args)))
    },
    /**
     * 隐藏Tab
     * @param tab
     */
    hideTab (tab) {
      ipc.send('hideTableTab', {
        tab: tab
      })
    },
    handleLeave () {
      if (this.currentTab) {
        this.hideTab(JSON.parse(JSON.stringify(this.currentTab)))
      }
      this.fullScreen = false
    },
    goBack () {
      ipc.send('goBackTableTab', {
        tab: JSON.parse(JSON.stringify(this.currentTab)),
      })
    },
    goForward () {
      ipc.send('goForwardTableTab', {
        tab: JSON.parse(JSON.stringify(this.currentTab)),
      })
    },
    refresh () {
      ipc.send('refreshTableTab', {
        tab: JSON.parse(JSON.stringify(this.currentTab)),
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
  color: var(--primary-text);

  &:hover .btn-wrapper {
    color: var(--secondary-text);
    background: var(--active-secondary-bg);
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

.nav-list{
  justify-items: center;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap:30px;
  display:flex;

  height: 100%;
  .nav-item{
    cursor: pointer;
    &:hover{
      opacity: .8;
    }
  }
  .nav-title{
    padding-top: 10px;
    font-size: 18px;
    text-align: center;
  }
}
</style>
