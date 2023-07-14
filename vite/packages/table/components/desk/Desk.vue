<template>



  <div style="height:100%;width: calc(100% - 20px); " v-if="currentDesk.cards">
    <div  style="width: 100%;height: 100%" class="m-auto" v-if="this.currentDesk.cards.length === 0">
      <div style="width: 100%;height: 100%">
        <a-result class="s-bg rounded-lg m-auto" style="margin: auto" status="success" title="使用卡片桌面"
          sub-title="您可以长按空白处、右键添加卡片。">
          <template #extra>
            <a-button style="color: var(--active-text);" @click="newAddCard" class="mr-10 xt-active-bg" key="console" type="primary">添加第一张卡片</a-button>
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
    <vue-custom-scrollbar class="no-drag"  key="scrollbar" id="scrollerBar" @contextmenu.stop="showMenu" :settings="scrollbarSettings"
      style="position: relative; width: 100%; height: 100%;padding-left: 10px;padding-right: 10px">
      <div ref="deskContainer" style="
          white-space: nowrap;
          height: 100%;
          display: flex;
          align-items: center;
          align-content: center;
        " :style="{ 'padding-top': this.settings.marginTop + 'px' }">
        <vuuri  v-if="currentDesk.cards && !hide" :get-item-margin="() => {
            return settings.cardMargin + 'px';
          }
          " group-id="grid.id" :drag-enabled="true" v-model="currentDesk.cards" :key="key" :style="{

      height: '100%',
      width: '100%',
    }" class="grid home-widgets" ref="grid" :options="muuriOptions">
          <template #item="{ item }">
            <div :style="{ pointerEvents: editing ? 'none' : '',zoom: (this.settings.cardZoom * this.adjustZoom / 100).toFixed(2), }">
              <component :desk="currentDesk" :is="item.name" :customIndex="item.id"
                :customData="item.customData" :editing="editing" @customEvent="customEvent"></component>
            </div>
          </template>
        </vuuri>
      </div>
    </vue-custom-scrollbar>
  </div>

  <transition name="fade">
    <div class="home-blur" style="
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        z-index: 999;
      " v-if="visibleAdd">
      <NewAddCard @close="hideAddCard" @addSuccess="hideAddCard" :desk="currentDesk" @onBack="() => { this.visibleAdd = false }"></NewAddCard>
    </div>
  </transition>
  <a-drawer :contentWrapperStyle="{ backgroundColor: '#1F1F1F' }" :width="120" :height="220" class="drawer"
    placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
<!--      <a-col>-->
<!--        <div @click="toggleEditing" class="btn">-->
<!--          <Icon v-if="!this.editing" style="font-size: 3em" icon="bofang"></Icon>-->
<!--          <Icon v-else style="font-size: 3em; color: orange" icon="tingzhi"></Icon>-->
<!--          <div>-->
<!--            <span v-if="!this.editing">调整布局</span><span v-else style="color: orange">停止调整</span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </a-col>-->
      <a-col>
        <div @click="newAddCard" class="btn">
          <Icon style="font-size: 3em" icon="tianjia1"></Icon>
          <div><span>添加卡片</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="showSetting" class="btn">
          <Icon style="font-size: 3em" icon="shezhi1"></Icon>
          <div><span>设置</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="clear" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div><span>清空卡片</span></div>
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
      <a-col>
        <div v-if="!hide" @click="hideDesk" class="btn">
          <Icon style="font-size: 3em" icon="yanjing-yincang"></Icon>
          <div><span>隐藏桌面</span></div>
        </div>
        <div v-else @click="showDesk" class="btn">
          <Icon style="font-size: 3em" icon="yanjing"></Icon>
          <div><span>显示桌面</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
  <a-drawer v-model:visible="settingVisible" placement="right">
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
  </a-drawer>
</template>

<script>

import Muuri from 'muuri'
import Vuuri from '../vuuriHome/Vuuri.vue'

import CPULineChart from "../widgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../widgets/supervisory/CPUFourCard.vue";
import InternalList from "../widgets/supervisory/InternalList.vue";
import SmallCPUCard from "../widgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../widgets/supervisory/SmallGPUCard.vue";
import GamesDiscount from "../widgets/games/GamesDiscount.vue";
import DiscountPercentage from "../widgets/games/DiscountPercentage.vue";
import MiddleWallpaper from "../widgets/MiddleWallpaper.vue";
import SmallWallpaper from "../widgets/SmallWallpaper.vue";
import MyGameSmall from "../widgets/games/MyGameSmall.vue";
import Capture from "../widgets/games/Capture.vue";
import Voice from "../widgets/games/Voice.vue";
import Audio from "../widgets/games/Audio.vue";
import CaptureNewCard from "../widgets/games/CaptureNewCard.vue";
import Remote from "../widgets/custom/Remote.vue";
import GameEpic from "../widgets/games/GameEpic.vue";
import CustomAssembly from "../widgets/custom/CustomAssembly.vue";
import SignIn from "../widgets/SignIn.vue"
import SingleFilm from "../widgets/film/SingleFilm.vue"
import ManyFilm from "../widgets/film/ManyFilm.vue"
import SteamFriends from '../widgets/games/SteamFriends.vue'
import Weather from "../widgets/Weather.vue";
import Clocks from '../widgets/clock/index.vue'
import Timer from "../widgets/Timer.vue";
import Music from "../widgets/Music.vue";
import Stock from "../widgets/Stock.vue";
import Dou from "../widgets/Dou.vue";
import Fish from "../widgets/Fish.vue";
import CustomTimer from "../widgets/CustomTimer.vue";
import SmallCountdownDay from "../widgets/SmallCountdownDay.vue";
import Clock from "../widgets/Clock.vue";
import CountdownDay from "../widgets/CountdownDay.vue";
import Notes from '../widgets/note/index.vue'
import NewAddCard from "../../page/app/card/NewAddCard.vue";
import GameStrategy from '../widgets/games/GameStrategy.vue';
import {message, Modal} from "ant-design-vue";
import {mapWritableState} from "pinia";
import {appStore} from "../../store";
import VueCustomScrollbar from '../../../../src/components/vue-scrollbar.vue'
export default {
  name: 'Desk',
  components: {
    VueCustomScrollbar,
    Vuuri, CPUFourCard, CPULineChart, InternalList,
    SmallCPUCard, SmallGPUCard, DiscountPercentage, GamesDiscount, GameEpic,
    Music, Stock, Dou, Fish, CustomTimer, SmallCountdownDay, Clock, CountdownDay,
    Timer, Weather, SteamFriends, Remote, SignIn, SingleFilm, ManyFilm,
    CaptureNewCard, Voice, Audio, Capture, CustomAssembly, MyGameSmall, SmallWallpaper,
    MiddleWallpaper,NewAddCard,Clocks,Notes,GameStrategy
  },
  props:
  {
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
          dragStartPredicate: {
            distance: 10,
            delay: 1000,
          },
          dragAutoScroll: {
            layout:{
              fillGaps: true,
              horizontal: false,
              alignRight: false,
              alignBottom: false,
              rounding: true
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
            dragSortPredicate:{
              threshold: 30,
            },
            dragSortHeuristics: {
              sortInterval: 10,
              minDragDistance: 5,
              minBounceBackAngle: Math.PI / 2,
            },
          },
        }
      }
    },
    settings: {
      type: Object,
      required: false,
      default:{
        cardZoom: 100,
        marginTop: 0,
        cardMargin: 5//卡片间隙
      }
    }
  }
  ,
  mounted () {
    console.log(this.currentDesk.cards)
  },
  computed: {
    ...mapWritableState(appStore, ['fullScreen']),
  },
  data() {
    return {
      stashBound:{width:0,height:0,zoom:0},
      adjustZoom:1,

      settingVisible:false,
      hide:false,
      key:Date.now(),
      menuVisible: false,
      visibleAdd: false,
      editing: false,
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: true,
        suppressScrollX: false,
        wheelPropagation: true,
        currentItemId: -1,
      },
    }
  },
  methods: {
    learn(){
      browser.openInTable('https://www.bilibili.com/video/BV1Th4y1o7SZ/?vd_source=2b7e342ffb60104849f5db6262bb1e0b')
    },
    update(){
      this.$refs.grid.update()
    },
    toggleEditing() {
      this.editing = !this.editing;
      if (this.editing) {
        message.info("您可以直接拖拽图标调整位置，支持跨组调整");
      } else {
        message.info("已关闭拖拽调整");
      }
      this.menuVisible = false;
      this.key = Date.now();
    },
    showSetting(){
      this.settingVisible=true
      this.menuVisible=false
    },
    hideDesk() {
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    showDesk() {
      this.hide = !this.hide;
      this.menuVisible = false;
    },
    clear() {
      this.menuVisible = false;
      let desk = this.currentDesk;
      if (desk) {
        Modal.confirm({
          centered: true,
          content: "清空当前桌面的全部卡片？此操作不可还原。",
          onOk: () => {
            desk.cards = [];
            this.menuVisible = false;
          },
          okText: "清空卡片",
        });
      }
    },
    newAddCard() {
      this.visibleAdd = true;
      this.menuVisible = false;
    },
    hideAddCard(){
      this.visibleAdd=false
    },
    onClose() {
      this.menuVisible = false;
    },
    showMenu(){
      this.menuVisible = true;
    },
    /**
     * 暂存布局，与restore结对使用。
     */
    stashLayout()
    {
      let bound={
        width:this.$refs.deskContainer.clientWidth,
        height:this.$refs.deskContainer.clientHeight
      }
      this.stashBound = bound

      console.log(bound,'贮存时的bound')
    },
    /**
     * 恢复布局
     */
    restoreLayout(rate=0){
      if(rate){
        this.adjustZoom=1
        this.update()
        return
      }
      let bound={
        width:this.$refs.deskContainer.clientWidth,
        height:this.$refs.deskContainer.clientHeight
      }
      console.log(bound,'恢复时的bound')
      this.adjustZoom=bound.height/this.stashBound.height
      this.update()
      console.log(this.adjustZoom,'需要条件的')

    }
  }
}
</script>

<style scoped lang="scss">
.grid {
  position: relative;
  display: inline-block;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
  margin-right: 1em;
  height: 100%;
  width: 100%;
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
  display: inline-block;
  width: 43em;
  border-radius: 4px;
  vertical-align: top;
  left: 0;
  right: 0;
  margin-right: 1em;
}

.btn {
  text-align: center;
}

@media screen and (min-height: 1020px) and (max-height: 1600px) {
  #scrollerBar {
    height: 880px;

    .grid {
      height: 880px;
    }
  }
}

@media screen and (max-height: 1021px) {
  #scrollerBar {
    height: 438px;

    .grid {
      height: 438px;
    }
  }
}
</style>
