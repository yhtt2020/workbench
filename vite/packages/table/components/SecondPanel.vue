<template>
  <!-- 快速搜索 基础设置->基础设置 菜单 -->

  <div class="second-panel  mt-3" :class="{ 'large': this.size === 'large', 'small': this.size === 'small' }"
    id="secondPanel">

    <div style="margin-bottom:2em;" v-if="gallery === true">
      <div :onClick="goHome" class="second-panel-back s-icon" style="color:var(--primary-text)">
        <Icon icon="xiangzuo" style="margin-right: 0.2em;"></Icon>
        <span style="margin-left: 0.5em;font-size: 1em;" class="s-text" >返回</span>
      </div>
    </div>
    <div @click="change($event, menu)" class="menu relative s-icon" :class="{ 'xt-active-btn': current(menu) }"
      v-for="(menu) in menus" style="color:var(--primary-text)">
      <div class="flex items-center justify-start">
        <Icon v-if="menu.icon" :icon="menu.icon"></Icon>
        <SecondPanelIcon :icon="menu.newIcon" class="xt-text" v-else-if="menu.newIcon" style="font-size:1.25rem;"/>
        <span style="margin-left: 0.5em;font-size: 1em;color: var(--font-color);" class="xt-text">{{ menu.title }}</span>
      </div>
      <GradeSmallTip powerType="lockWallpaper" lastPowerType="动态壁纸" v-if="menu.title === '动态壁纸'"></GradeSmallTip>
    </div>
    <xt-task :modelValue="M01035"></xt-task>
  </div>
</template>

<script>
import GradeSmallTip from "./GradeSmallTip.vue";
import { taskStore } from "../apps/task/store";
import routerTab from '../js/common/routerTab'
import {mapActions, mapState,mapWritableState} from "pinia";
import { offlineStore } from "../js/common/offline";

import { Icon as SecondPanelIcon } from '@iconify/vue';

export default {
  name: 'SecondPanel',
  props: [
    'menus',
    'logo',
    'size',
    'search',
    'close',
    'back',
    'goHome',
    'gallery'
  ],
  emits: [
    'changeTab'
  ],
  components: { GradeSmallTip,SecondPanelIcon },
  data() {
    return {
      panel: {},
      activeIndex: '',
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  mounted() {
    this.panel = document.getElementById('secondPanel')
    this.activeIndex = this.menus[0].index

    //this.panel.style.marginTop = -this.panel.offsetHeight / 2-20 + 'px'
  },
  computed: {
    ...mapWritableState(taskStore, ['taskID','step']),
    M01035() {
      if ( this.taskID == 'M0103' && this.step == 5) {
        this.change(1, {
          "index": "p",
          "title": "拾光壁纸",
          "icon": "wallpaper",
          "route": {
              "name": "pickingPaper"
    }
})
        return true
      }
    },
  },
  methods: {
    ...mapActions(offlineStore, ["getIsOffline"]),
    isActive:routerTab.isActive,
    current(menu) {
      if(menu.tab){
        return this.isActive(menu.tab,2)
      }else{
        if (menu.route) {
          return this.$route.name === menu.route.name || this.$route.path === menu.route.path
        } else {
          return this.activeIndex === menu.index
        }
      }


    },
    change(e, menu) {
      this.activeIndex = menu.index
      this.$emit('changeTab', {
        index: menu.index,
        menu: menu,
        event: e
      })
    }
  }
}
</script>

<style scoped lang="scss">
.active-menu-item {
  background: var(--active-bg);
}
.s-text {
    text-shadow:none !important;
}
.second-panel {
  .xt-active-btn{
    justify-content: left;
  }
  padding-left: 0 !important;

  &.small {}

  height:auto;
  border-radius: 6px;

  .menu {
    &:hover {}

    &.active {}

    width: 8em;
    padding-left: 1em;
    font-size: 1.3em;
    height: 3em;
    line-height: 3em;
    border-radius: 0.5em;
    cursor: pointer;
    margin-bottom: 0.5em;
  }

}

.second-panel-back {
  width: 8em;
  padding-left: 1em;
  font-size: 1.3em;
  height: 3em;
  line-height: 3em;
  border-radius: 0.3em;
  cursor: pointer;
  margin-bottom: 0.5em;

}

</style>
