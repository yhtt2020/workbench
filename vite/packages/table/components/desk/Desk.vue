<template>

  <div style="height:100%;width: calc(100% - 20px); " v-if="currentDesk.cards">
    <div style="width: 100%;height: 100%;" :class="notTrigger ? 'trigger' : '' " class="m-auto"
         v-if="currentDesk.cards.length === 0">
      <div style="width: 100%;height: 100%">
        <a-result class="m-auto rounded-lg s-bg" style="margin: auto" status="success" title="使用卡片桌面"
                  sub-title="您可以长按空白处、右键添加小组件。">
          <template #extra>
            <a-button style="color: var(--active-text);" @click="newAddCard" class="mr-10 xt-active-bg" key="console"
                      type="primary">添加第一张卡片
            </a-button>
            <a-button key="buy" @click="learn">学习</a-button>
          </template>

          <div class="desc">
            <p style="font-size: 16px">
              <strong>您可以通过桌面设置调节卡片到合适的大小</strong>
            </p>
            <p>
              从社区获得分享代码（此功能暂未上线，请耐心等待）
              <a>从社区导入 &gt;</a>
            </p>
          </div>
        </a-result>
      </div>
    </div>
    <RightMenu :deskMenu='deskMenu' :deskGroupMenu='newDeskGroupMenu'  class="w-full h-full xt-theme-b">
    <!-- <div  style='z-index:99999px'> -->
        <vue-custom-scrollbar @contextmenu.stop="showMenu" class="no-drag" key="scrollbar" id="scrollerBar"
                          :settings="{...scrollbarSettings,
                            suppressScrollY:settings.vDirection?false: true ,
        suppressScrollX:settings.vDirection?true: false,
                          }"
                          style="position: relative; width: 100%; height: 100%;padding-left: 10px;padding-right: 10px;display: flex;flex-direction: row">



      <div id="cardContent" ref="deskContainer"
           style="
          /*display: flex;*/
          /*align-items: center;*/
          /*align-content: center;*/
        " :style="{
           // 'flex-direction': settings.vDirection?'row':'column',
           'padding-top': this.usingSettings.marginTop + 'px',
              width:settings.vDirection?'100%':'auto',
          height:settings.vDirection?'auto':'100%',
        }"
           :class="notTrigger ? 'trigger' : '' "
      >
        <vuuri :key="key" v-if="currentDesk.cards && !hide" :get-item-margin="() => {
            return usingSettings.cardMargin * this.adjustZoom  + 'px';
          }

          " group-id="grid.id" :drag-enabled="editing" v-model="currentDesk.cards"  :style="{
          width:settings.vDirection?'100%':'auto',
          height:settings.vDirection?'auto':'100%',
    }" class="grid home-widgets" ref="grid" :options="muuriOptions">


          <template #item="{ item }">
            <div
              :class="{editing:editing}"
              :editing="editing"
              :style="{ zoom: (usingSettings.cardZoom * this.adjustZoom / 100).toFixed(2), }">


              <component :desk="currentDesk" :is="item.name" :customIndex="item.id"
                         :customData="item.customData" :editing="editing"></component>
            </div>

          </template>
        </vuuri>

      </div>


    </vue-custom-scrollbar>
    <!-- </div> -->
  </RightMenu>

  </div>

  <transition name="fade">
    <div class="home-blur" style="
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
      " v-if="addCardVisible">
      <NewAddCard @close="hideAddCard" @addSuccess="hideAddCard" :desk="currentDesk"
                  @onBack="() => { this.addCardVisible = false }"></NewAddCard>
    </div>
  </transition>

  <a-drawer :contentWrapperStyle="{ backgroundColor: '#1F1F1F' }" :width="120" :height="350" class="drawer"
            style="z-index: 99999999999;"
            placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <div style="height: 200px;" class="hidden mb-3">
      </div>
      <xt-task id='M0101' no='2' to="" @cb="newAddCard()">
        <a-col>
          <div @click="newAddCard" class="btn">
            <Icon style="font-size: 3em" icon="tianjia1"></Icon>
            <div><span>添加小组件</span></div>
          </div>
        </a-col>
      </xt-task>
      <xt-task   id='M0201' no='2' to="" @cb="newAddIcon()">
        <a-col>
          <div @click="newAddIcon" class="btn">
            <Icon style="font-size: 3em" icon="wanggeshitu"></Icon>
            <div><span>添加图标</span></div>
          </div>
        </a-col>
      </xt-task>
      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon v-if="!this.editing" style="font-size: 3em" icon="line-dragdroptuofang"></Icon>
          <Icon v-else style="font-size: 3em; color: red" icon="tingzhi"></Icon>
          <div>
            <span v-if="!this.editing">调整布局</span><span v-else style="color: red">停止调整</span>
          </div>
        </div>
      </a-col>
      <xt-task  id='M0103' no='2' to="" @cb="showSetting">
        <a-col>
          <div @click="showSetting" class="btn">
            <Icon style="font-size: 3em" icon="shezhi1"></Icon>
            <div><span>设置</span></div>
          </div>
        </a-col>
      </xt-task>
      <a-col>
        <div @click="clear" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div><span>清空小组件</span></div>
        </div>
      </a-col>

      <a-col>
        <div v-if="!hide" @click="hideDesk" class="btn">
          <Icon style="font-size: 3em" icon="yanjing-yincang"></Icon>
          <div><span>隐藏小组件</span></div>
        </div>
        <div v-else @click="showDesk" class="btn">
          <Icon style="font-size: 3em" icon="yanjing"></Icon>
          <div><span>显示卡片</span></div>
        </div>
      </a-col>
      <!--      <a-col>-->
      <!--        <div @click="showAddDeskForm" class="btn">-->
      <!--          <Icon style="font-size: 3em" icon="desktop"></Icon>-->
      <!--          <div><span>添加桌面</span></div>-->
      <!--        </div>-->
      <!--      </a-col>-->
      <!--      <a-col>-->
      <!--        <div @click="delDesk" class="btn">-->
      <!--          <Icon style="font-size: 3em" icon="shanchu"></Icon>-->
      <!--          <div><span>删除桌面</span></div>-->
      <!--        </div>-->
      <!--      </a-col>-->

      <!--   菜单插槽    -->
      <slot name="currentDeskMenu"></slot>
    </a-row>
    <slot name="outMenu"></slot>
  </a-drawer>
  <a-drawer v-model:visible="settingVisible" placement="right">
    <XtTab class="mb-2"
           v-if="settingVisible"
           style="height: 48px"
           boxClass="p-1 xt-bg-2"
           v-model="currentSettingTab"
           :list="settingsTab"
    ></XtTab>
    <template v-if="currentSettingTab==='current' && currentDesk.settings">
      <div class="line-title">基础设置</div>
      <div class="mt-2 line">
        桌面名称：
      </div>
      <div>
        <a-input v-model:value="currentDesk.name"></a-input>
      </div>
      <div class="my-3" style="font-size: 1.2em;font-weight: bold;">
        独立缩放：
        <div class="line xt-text-2" style="font-size: 14px;font-weight: normal">
          开启独立缩放后，将不再使用通用桌面设置中的缩放设置。
        </div>
        <a-switch v-model:checked="settings.enableZoom" @change="update"></a-switch>
      </div>
      <template v-if="settings.enableZoom">
        <div class="line-title">卡片设置：</div>

        <div class="line">
          卡片缩放：
          <a-slider @afterChange="update" :min="20" :max="500" v-model:value="settings.cardZoom"></a-slider>
        </div>
        <div class="line">
          卡片空隙：(调大空隙可能变成瀑布流布局)
          <a-slider :min="5" :max="30" v-model:value="settings.cardMargin"></a-slider>
        </div>
        <div class="line">
          距离顶部：
          <a-slider :min="0" :max="200" v-model:value="settings.marginTop"></a-slider>
        </div>
      </template>

      <div>
        桌面垂直布局：
        <a-switch v-model:checked="currentDesk.settings.vDirection"></a-switch>
      </div>

    </template>
    <template v-else>
      <div class="line-title">卡片设置：</div>

      <template v-if="settings.enableZoom">
        <div class="mb-2" style="color:orangered">
          <icon icon="tishi-xianxing"></icon>
          当前桌面正在使用独立设置，此处设置对当前桌面不起作用。
        </div>
      </template>
      <div class="line">
        卡片缩放：
        <a-slider @afterChange="update" :min="20" :max="500" v-model:value="globalSettings.cardZoom"></a-slider>
      </div>
      <div class="line">
        卡片空隙：(调大空隙可能变成瀑布流布局)
        <a-slider :min="5" :max="30" v-model:value="globalSettings.cardMargin"></a-slider>
      </div>
      <div class="line">
        距离顶部：
        <a-slider :min="0" :max="200" v-model:value="globalSettings.marginTop"></a-slider>
      </div>
      <slot name="settingsAllAfter">
      </slot>
    </template>


  </a-drawer>

  <transition name="fade">
    <div class="" style="
         position: fixed;
         top: 0;
         right: 0;
         left: 0;
         bottom: 0;
         z-index: 999;
       " v-if="iconVisible">
      <AddIcon @setCustoms="setCustoms" @close="iconHide" :desk="currentDesk"></AddIcon>
    </div>
  </transition>

</template>

<script>

import Muuri from 'muuri'
import Vuuri from '../vuuriHome/Vuuri.vue'
import { defineAsyncComponent } from 'vue'

import CPULineChart from '../widgets/supervisory/CPULineChart.vue'
import CPUFourCard from '../widgets/supervisory/CPUFourCard.vue'
import InternalList from '../widgets/supervisory/InternalList.vue'
import SmallCPUCard from '../widgets/supervisory/SmallCPUCard.vue'
import SmallGPUCard from '../widgets/supervisory/SmallGPUCard.vue'
import GamesDiscount from '../widgets/games/GamesDiscount.vue'
import DiscountPercentage from '../widgets/games/DiscountPercentage.vue'
import MiddleWallpaper from '../widgets/MiddleWallpaper.vue'
import SmallWallpaper from '../widgets/SmallWallpaper.vue'
import MyGameSmall from '../widgets/games/MyGameSmall.vue'
import Capture from '../widgets/games/Capture.vue'
import Voice from '../widgets/games/Voice.vue'
import Audio from '../widgets/games/Audio.vue'
import CaptureNewCard from '../widgets/games/CaptureNewCard.vue'
import Remote from '../widgets/custom/Remote.vue'
import GameEpic from '../widgets/games/GameEpic.vue'
import CustomAssembly from '../widgets/custom/CustomAssembly.vue'
import SignIn from '../widgets/SignIn.vue'
import SingleFilm from '../widgets/film/SingleFilm.vue'
import ManyFilm from '../widgets/film/ManyFilm.vue'
import SteamFriends from '../widgets/games/SteamFriends.vue'
import Weather from '../widgets/Weather.vue'
import Clocks from '../widgets/clock/index.vue'
import Timer from '../widgets/Timer.vue'
import Music from '../widgets/Music.vue'
import Stock from '../widgets/Stock.vue'
import Dou from '../widgets/Dou.vue'
import Fish from '../widgets/Fish.vue'
import CustomTimer from '../widgets/CustomTimer.vue'
import SmallCountdownDay from '../widgets/SmallCountdownDay.vue'
import Clock from '../widgets/Clock.vue'
import CountdownDay from '../widgets/CountdownDay.vue'
import Notes from '../widgets/note/index.vue'
import GameInformation from '../widgets/gameInformation/index.vue'
import HistoryInfo from '../widgets/historyInfo/index.vue'
import ShortcutKey from '../../apps/shortcutKey/widget/index.vue'
import ClipBoard from '../widgets/clipBoard/index.vue'

import Guider from '../widgets/shortTalk/page/Guider.vue'
import ShortTodo from '../widgets/shortTalk/page/ShortTodo.vue'
import Dashboard from '../widgets/shortTalk/page/Dashboard.vue'
import ShortChart from '../widgets/shortTalk/page/ShortChart.vue'

import TimerChart from '../../apps/tomato/page/Chart.vue'
import TimerClock from '../../apps/tomato/page/Clock.vue'

const NewAddCard = defineAsyncComponent(() => import('../../page/app/card/NewAddCard.vue'))
import MyIcons from '../widgets/myIcons/index.vue'
import AggregateSearch from '../widgets/aggregate/AggregateSearch.vue'
import AggregateSearchFullScreen from '../widgets/aggregate/AggregateSearchFullScreen.vue'
import GameStrategy from '../widgets/games/GameStrategy.vue'
import { message, Modal } from 'ant-design-vue'
import { mapWritableState } from 'pinia'
import { appStore } from '../../store'
import VueCustomScrollbar from '../../../../src/components/vue-scrollbar.vue'
import HorizontalPanel from '../HorizontalPanel.vue'
import AddIcon from '../../page/app/addIcon/index.vue'
import News from '../widgets/news/NewsCard.vue'
import Template from '../../../user/pages/Template.vue'
import SmallRank from '../widgets/SmallRank.vue'
import Todo from '../widgets/todo/Todo.vue'
import EatToday from '../widgets/eat/EatToday.vue'
import HotSearch from '../widgets/HotSearch.vue'
import CoolWidget from '../card/CoolWidget.vue'
import AIaides from '../widgets/AIaides.vue'
import OilPrices from '../widgets/OilPrices.vue'
import yuanCommunity from '../widgets/yuanCommunity/yuanCommunity.vue'
import RightMenu from './RightMenu.vue'
import {useWidgetStore} from "../card/store.ts"
export default {
  name: 'Desk',
  emits: ['changeEditing'],
  components: {
    RightMenu,
    GameInformation,
    HistoryInfo,
    ShortcutKey,
    ClipBoard,
    Guider,
    ShortTodo,
    Dashboard,
    ShortChart,
    TimerChart,
    TimerClock,
    News,
    Template,
    HorizontalPanel,
    VueCustomScrollbar,
    Vuuri,
    CPUFourCard,
    CPULineChart,
    InternalList,
    SmallCPUCard,
    SmallGPUCard,
    DiscountPercentage,
    GamesDiscount,
    GameEpic,
    Music,
    Stock,
    Dou,
    Fish,
    CustomTimer,
    SmallCountdownDay,
    Clock,
    CountdownDay,
    Timer,
    Weather,
    SteamFriends,
    Remote,
    SignIn,
    SingleFilm,
    ManyFilm,
    CaptureNewCard,
    Voice,
    Audio,
    Capture,
    CustomAssembly,
    MyGameSmall,
    SmallWallpaper,
    MiddleWallpaper,
    NewAddCard,
    Clocks,
    Notes,
    GameStrategy,
    AggregateSearch,
    AggregateSearchFullScreen,
    MyIcons,
    AddIcon,
    SmallRank,
    Todo,
    EatToday,
    HotSearch,
    AIaides,
    OilPrices,
    yuanCommunity,
  },
  props:
    {
      deskGroupMenu:{
      },
      globalSettings: {
        type: Object,
        default: {}
      },
      editing: {
        type: Boolean,
        required: true,
        default: false,
      },
      currentDesk: {
        type: Object,
        required: true,
        default: () => {
          return { cards: [] }
        }

      },
      muuriOptions: {
        type: Object,
        required: false,
        default: () => {
          return {
            // dragStartPredicate: {
            //   distance: 10,
            //   delay: 1000,
            // },
            dragAutoScroll: {},
            layout: {
              // fillGaps: true,
              // horizontal: false,
              alignRight: false,
              alignBottom: false,
              // rounding: true
            },
            targets: [
              {
                element: '#scrollerBar>div',
              },
            ],
            handle: null,
            threshold: 50,
            safeZone: 0.2,
            speed: Muuri.AutoScroller.smoothSpeed(1000, 2000, 2500),
            sortDuringScroll: true,
            smoothStop: false,
            onStart: null,
            onStop: null,
            dragSortPredicate: {
              threshold: 30,
            },
            dragSortHeuristics: {
              sortInterval: 10,
              minDragDistance: 5,
              minBounceBackAngle: Math.PI / 2,
            },

          }
        }
      },
      settings: {
        type: Object,
        required: false,
        default: {
          cardZoom: 100,
          marginTop: 0,
          cardMargin: 5,//卡片间隙
          vDirection: false,
        }
      },
      notTrigger: {
        type: Boolean,
        default: () => false
      },

    }
  ,

  watch: {
    currentDesk (newVal) {
      newVal.layoutSize = this.getLayoutSize()
      // if (!newVal.settings) {
      //   newVal.settings=
      //     .settings = {
      //     cardZoom: 100,
      //     marginTop: 0,
      //     cardMargin: 5,//卡片间隙
      //     vDirection: false,
      //   }
      // }
      this.muuriOptions.layout.horizontal =! newVal.settings?.vDirection
    },

    'currentDesk.settings': {
      handler (newVal) {
        console.log('更改了方向')
        console.log()
        if(!newVal){
          newVal={
            cardZoom: 100,
            marginTop: 0,
            cardMargin: 5,//卡片间隙
            vDirection: false,
          }
        }
        this.muuriOptions.layout.horizontal =! newVal.vDirection
        this.currentDesk.settings=newVal
        this.update()

      },
      deep: true,
      immediate: true,
    },
    'currentDesk.settings.vDirection':{
      handler (newVal) {
        console.log('更新了方向，重载')
        this.key=Date.now()
        console.log(this.muuriOptions.layout,'murri参数')
      },
      deep:true
    }
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
    ...mapWritableState(useWidgetStore, ['rightModel']),

   newDeskGroupMenu() {
    let arr = [ ...this.deskGroupMenu[1].children];
    arr.push({
            id:4,
            newIcon:"fluent:circle-off-16-regular",
            name:"清空桌面",
            fn:this.clear
    })

      arr.sort((a, b) => a.id - b.id);

      console.log('arr :>> ', arr);
      let deskGroupMenu = [...this.deskGroupMenu]
      deskGroupMenu[1].children = arr
  return deskGroupMenu;
   },
    deskMenu() {
      return [
          {
            id:1,
            newIcon:"fluent:add-16-filled",
            name:"添加图标",
            fn:this.newAddIcon,
          },
          {
            id:2,
              newIcon:"fluent:collections-add-24-regular",
            name:"添加小组件",
            fn:this.newAddCard,
          },
          { id:4,
            divider:true
          },
          {
            id:5,
              newIcon:"fluent:window-new-16-regular",
            name:this.editing ? '停止调整':'调整桌面布局',
            fn:this.toggleEditing,
          },
          {
            id:6,
              newIcon:"fluent:eye-off-16-regular",
            name:this.hide ? '显示小组件':"隐藏小组件",
            fn: this.hide ? this.showDesk :this.hideDesk
          },
          {id:7,
            divider:true
          },
          {
            id:8,
              newIcon:"fluent:settings-16-regular",
            name:"桌面设置",
            fn:this.showSetting,
          },
      ]
    },
    usingSettings () {
      if (this.settings.enableZoom) {
        return this.settings
      } else {
        return this.globalSettings
      }
    }
  },
  data () {
    return {

      stashBound: { width: 0, height: 0, zoom: 0 },
      adjustZoom: 1,
      iconVisible: false,
      settingVisible: false,
      hide: false,
      key: Date.now(),
      menuVisible: false,
      addCardVisible: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId: -1,
      },
      settingsTab: [
        { name: '通用桌面设置', value: 'all' },
        { name: '当前桌面设置', value: 'current' }
      ],
      currentSettingTab: 'all',
      resizeHandler: null
    }
  },
  mounted () {
    this.resizeHandler = () => {
      this.currentDesk.layoutSize = this.getLayoutSize()
    }
    this.getLayoutSize()

    window.addEventListener('resize', this.resizeHandler)
  },
  unmounted () {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {

    learn () {
      browser.openInTable('https://www.bilibili.com/video/BV1Th4y1o7SZ/?vd_source=2b7e342ffb60104849f5db6262bb1e0b')
    },
    update () {
      if (this.$refs.grid) {
        this.$refs.grid.update()
      }

    },
    hideMenu () {
      this.menuVisible = false
    },
    toggleEditing () {

      if (this.editing) {
        message.info('已关闭拖拽调整')
      } else {
        message.info('您可以直接拖拽图标调整位置')
      }
      this.muuriOptions.layout.horizontal = !this.settings.vDirection
      this.$emit('changeEditing', this.editing)
      this.menuVisible = false
      this.key = Date.now()
      console.log(this.muuriOptions,'ediingt输出')
    },
    showSetting () {
      this.settingVisible = true
      this.menuVisible = false
    },
    hideDesk () {
      this.hide = !this.hide
      this.menuVisible = false
    },
    iconHide () {
      this.iconVisible = false
    },

    showDesk () {
      this.hide = !this.hide
      this.menuVisible = false
    },
    clear () {
      this.menuVisible = false
      let desk = this.currentDesk
      if (desk) {
        Modal.confirm({
          centered: true,
          content: '清空当前桌面的全部卡片？此操作不可还原。',
          onOk: () => {
            desk.cards = []
            this.menuVisible = false
          },
          okText: '清空卡片',
        })
      }
    },
    newAddCard () {
      this.addCardVisible = true
      // addCardVisible
      this.menuVisible = false
    },
    hideAddCard () {
      this.addCardVisible = false
    },
    onClose () {
      this.menuVisible = false
    },
    showMenu () {
      if (!this.notTrigger && this.rightModel !== 'follow') this.menuVisible = true
    },
    // 添加图标
    newAddIcon () {
      this.iconVisible = true
      this.menuVisible = false
    },
    /**
     * 暂存布局，与restore结对使用。
     */
    stashLayout () {
      let bound = {
        width: this.$refs.deskContainer.clientWidth,
        height: this.$refs.deskContainer.clientHeight
      }
      this.stashBound = bound
    },
    /**
     * 恢复布局
     */
    restoreLayout (rate = 0) {
      if (rate) {
        this.adjustZoom = 1
        this.update()
        return
      }
      let bound = {
        width: this.$refs.deskContainer.clientWidth,
        height: this.$refs.deskContainer.clientHeight
      }
      this.adjustZoom = bound.height / this.stashBound.height
      this.update()

    },
    /**
     * 获取当前布局的宽高
     * @returns {{width: number, height: number}}
     */
    getLayoutSize () {
      this.currentDesk.layoutSize = {
        width: this.$refs.deskContainer.clientWidth,
        height: this.$refs.deskContainer.clientHeight
      }
      if (this.currentDesk?.settings?.preparing) {
        message.loading({ content: '此桌面为首次使用，正在为您适配您的桌面…', key: 'preparing' })
        this.setFullScreen(true, () => {
          setTimeout(() => {
            this.$nextTick(() => {
              const fullLayoutSize = {
                width: this.$refs.deskContainer.clientWidth,
                height: this.$refs.deskContainer.clientHeight
              }
              const settings = this.currentDesk.settings
              const oldLayoutSize = this.settings.layoutSize
              settings.cardZoom = (settings.cardZoom * fullLayoutSize.height / oldLayoutSize.height / this.adjustZoom).toFixed()
              settings.cardMargin = (settings.cardMargin * fullLayoutSize.height / oldLayoutSize.height / this.adjustZoom).toFixed()
              //todo竖屏界面不一样
              message.success({ content: '此桌面为首次使用，已为您适配您的当前窗口。', key: 'preparing' })
              settings.preparing = false
              this.setFullScreen(false)
              delete settings.layoutSize
            })
          }, 1000)
        })

      }

      return this.currentDesk.layoutSize
    },
    setFullScreen (flag, cb) {
      this.stashLayout()
      this.fullScreen = flag
      this.$nextTick(() => {
        if (flag === false) {
          this.restoreLayout(1)
        } else {
          this.restoreLayout()
        }
        if (cb) cb()

      })
    },
    getAdjustZoom () {
      return this.adjustZoom
    }
  }
}
</script>

<style scoped lang="scss">
.grid {
  position: relative;
  //display: inline-block;
  white-space: pre-wrap;
  border-radius: 4px;
  vertical-align: top;
  //left: 0;
  //right: 0;
  margin-right: 1em;
  //height:3000px;
  //max-width: 100%;
}

.trigger {
  pointer-events: none;
}
</style>
<style lang="scss">
.home-widgets {
  .muuri-item {
    padding: 0;
  }

  /**
  .muuri-item {
  }
  */

  .card {
    position: relative;
    border: 0;
    height: 420px;

    &.small {
      height: 204px;
    }

    &.double {
      width: 572px;
      height: 420px;
    }
  }
}
</style>
<style scoped lang="scss">
.grid {
  position: relative;
  //display: inline-block;
  //width: 43em;
  border-radius: 4px;
  vertical-align: top;

  margin-right: 1em;

  .editing {
    pointer-events: none;
    cursor: move;
  }
}

.btn {
  text-align: center;
}

//@media screen and (min-height: 1020px) and (max-height: 1600px) {
//  #scrollerBar {
//    height: 880px;
//
//    .grid {
//      height: 880px;
//    }
//  }
//}
//
//@media screen and (max-height: 1021px) {
//  #scrollerBar {
//    height: 438px;
//
//    .grid {
//      height: 438px;
//    }
//  }
//}

</style>
