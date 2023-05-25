<template>
  <div v-if="currentDesk.cards">
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
          align-items: center;
          align-content: center;
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
</template>

<script>

import vuuri from '../vuuriHome/Vuuri.vue'
import Muuri from 'muuri'
import AddCard from '../../page/app/card/AddCard.vue'

export default {
  name: 'Desk',
  components: { AddCard },
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
    }
  }
}
</script>

<style scoped>

</style>
