<template>
  <div style="height: 100%" v-if="currentDesk.cards">
    <div class="p-3 m-auto" v-if="this.currentDesk.cards.length === 0">
      <div style="width: 100%">
        <a-result class="s-bg rounded-lg m-auto" style="margin: auto" status="success" title="使用卡片桌面"
                  sub-title="您可以长按空白处、右键添加卡片。">
          <template #extra>
            <a-button @click="addCard" class="mr-10" key="console" type="primary">添加第一张卡片</a-button>
            <a-button disabled key="buy" @click="learn">学习（课程暂未上线）</a-button>
          </template>

          <div class="desc">
            <p style="font-size: 16px">
              <strong>您可以通过桌面设置调节卡片到合适的大小</strong>
            </p>
            <p>
              <close-circle-outlined :style="{ color: 'red' }"/>
              从社区获得分享代码（此功能暂未上线，请耐心等待）
              <a>从社区导入 &gt;</a>
            </p>
          </div>
        </a-result>
      </div>
    </div>
    <vue-custom-scrollbar key="scrollbar" id="scrollerBar" @contextmenu.stop="showMenu" :settings="scrollbarSettings"
                          style="position: relative; border-radius: 8px; width: 100%; height: 100%">
      <div style="
          white-space: nowrap;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: flex-start;
          align-content: flex-start;
        " :style="{ 'padding-top': this.settings.marginTop + 'px' }">
        <vuuri v-if="currentDesk.cards" :get-item-margin="() => {
            return settings.cardMargin + 'px';
          }
          " group-id="grid.id" :drag-enabled="editing" v-model="currentDesk.cards" :key="key" :style="{
      zoom: (this.settings.cardZoom / 100).toFixed(2),
      height: '100%',
      width: '100%',
    }" class="grid home-widgets" ref="grid" :options="muuriOptions">
          <template #item="{ item }">
            <div :style="{ pointerEvents: editing ? 'none' : '' }">
              <component :is="item.name" :customIndex="item.id" @touchstart="touch" @touchmove="touch" @touchend="touch"
                         :customData="item.data" :editing="editing" @customEvent="customEvent"></component>
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
      <AddCard :desk="currentDesk" @onBack="()=>{this.visibleAdd=false}"></AddCard>
    </div>
  </transition>
  <a-drawer :contentWrapperStyle="{ backgroundColor: '#1F1F1F' }" :width="120" :height="220" class="drawer"
            placement="bottom" :visible="menuVisible" @close="onClose">
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <a-col>
        <div @click="toggleEditing" class="btn">
          <Icon v-if="!this.editing" style="font-size: 3em" icon="bofang"></Icon>
          <Icon v-else style="font-size: 3em; color: orange" icon="tingzhi"></Icon>
          <div>
            <span v-if="!this.editing">调整布局</span><span v-else style="color: orange">停止调整</span>
          </div>
        </div>
      </a-col>
      <a-col>
        <div @click="addCard" class="btn">
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
      <a-col>
        <div @click="showAddDeskForm" class="btn">
          <Icon style="font-size: 3em" icon="desktop"></Icon>
          <div><span>添加桌面</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="delDesk" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div><span>删除桌面</span></div>
        </div>
      </a-col>
      <a-col>
        <div @click="hideDesk" class="btn">
          <Icon style="font-size: 3em" icon="yanjing-yincang"></Icon>
          <div><span>隐藏桌面</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>

import Muuri from 'muuri'
import AddCard from '../../page/app/card/AddCard.vue'
import Vuuri from '../vuuri/Vuuri.vue'

import CPULineChart from "../homeWidgets/supervisory/CPULineChart.vue";
import CPUFourCard from "../homeWidgets/supervisory/CPUFourCard.vue";
import InternalList from "../homeWidgets/supervisory/InternalList.vue";
import SmallCPUCard from "../homeWidgets/supervisory/SmallCPUCard.vue";
import SmallGPUCard from "../homeWidgets/supervisory/SmallGPUCard.vue";
import GamesDiscount from "../homeWidgets/games/GamesDiscount.vue";
import DiscountPercentage from "../homeWidgets/games/DiscountPercentage.vue";
import MiddleWallpaper from "../homeWidgets/MiddleWallpaper.vue";
import SmallWallpaper from "../homeWidgets/SmallWallpaper.vue";
import MyGameSmall from "../homeWidgets/games/MyGameSmall.vue";
import Capture from "../homeWidgets/games/Capture.vue";
import Voice from "../homeWidgets/games/Voice.vue";
import Audio from "../homeWidgets/games/Audio.vue";
import CaptureNewCard from "../homeWidgets/games/CaptureNewCard.vue";
import Remote from "../homeWidgets/custom/Remote.vue";
import GameEpic from "../homeWidgets/games/GameEpic.vue";
import CustomAssembly from "../homeWidgets/custom/CustomAssembly.vue";
import SignIn from "../homeWidgets/SignIn.vue"
import SingleFilm from "../homeWidgets/film/SingleFilm.vue"
import ManyFilm from "../homeWidgets/film/ManyFilm.vue"
import SteamFriends from '../homeWidgets/games/SteamFriends.vue'
import Weather from "../homeWidgets/Weather.vue";
import Calendar from "../homeWidgets/Calendar.vue";
import Timer from "../homeWidgets/Timer.vue";
import Music from "../homeWidgets/Music.vue";
import Stock from "../homeWidgets/Stock.vue";
import Dou from "../homeWidgets/Dou.vue";
import Fish from "../homeWidgets/Fish.vue";
import CustomTimer from "../homeWidgets/CustomTimer.vue";
import SmallCountdownDay from "../homeWidgets/SmallCountdownDay.vue";
import Clock from "../homeWidgets/Clock.vue";
import CountdownDay from "../homeWidgets/CountdownDay.vue";


export default {
  name: 'Desk',
  components: { Vuuri, AddCard,CPUFourCard,CPULineChart,InternalList,
    SmallCPUCard,SmallGPUCard ,DiscountPercentage,GamesDiscount,GameEpic,
    Music,Stock,Dou,Fish,CustomTimer,SmallCountdownDay,Clock,CountdownDay,
    Calendar,Timer,Weather,SteamFriends,Remote,SignIn,SingleFilm,ManyFilm,
    CaptureNewCard,Voice,Audio,Capture,CustomAssembly,MyGameSmall,SmallWallpaper,
    MiddleWallpaper
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
            dragAutoScroll: {
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
            },
          }
        }
      },
      settings: {
        type: Object,
        required: true
      }
    }
  ,
  data () {
    return {
      menuVisible:false,
      visibleAdd:false,
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
  methods:{
    addCard(){
      this.visibleAdd=true
    },
    onClose() {
      this.menuVisible = false;
    },
  }
}
</script>

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
</style>
