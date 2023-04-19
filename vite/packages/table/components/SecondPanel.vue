<template>
  <div class="second-panel ml-3 mt-3"  :class="{'large':this.size==='large','small':this.size==='small'}" id="secondPanel" style="">
    <div  style="margin-bottom:2em;" v-if="gallery === true">
      <div :onClick="goHome"  class="second-panel-back bg-white bg-opacity-10 ">
        <Icon icon="xiangzuo" style="margin-right: 0.2em;"></Icon>
        <span style="margin-left: 0.5em;font-size: 1em;">返回</span>
      </div>
    </div>
    <vue-custom-scrollbar id="second-container" :settings="settingsScroller" style="height: 80vh">
      <div @click="change($event,menu)" class="menu relative" :class="{'active':current(menu)}"
         v-for="(menu) in menus">
        <Icon v-if="menu.icon" :icon="menu.icon"></Icon>
        <span style="margin-left: 0.5em;font-size: 1em;">{{ menu.title }}</span>
        <GradeSmallTip powerType="lockWallpaper" lastPowerType="动态壁纸" v-if="menu.title==='动态壁纸'"></GradeSmallTip>
      </div>
    </vue-custom-scrollbar>
  </div>
</template>

<script>
import GradeSmallTip from "./GradeSmallTip.vue";
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
  components:{GradeSmallTip},
  data () {
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
  mounted () {
    this.panel = document.getElementById('secondPanel')
    this.activeIndex = this.menus[0].index
    //this.panel.style.marginTop = -this.panel.offsetHeight / 2-20 + 'px'
  },
  computed:{

  },
  methods: {
    current(menu){
      if(menu.route){
        return this.$route.name===menu.route.name || this.$route.path===menu.route.path
      }else{
        return this.activeIndex===menu.index
      }

    },
    change (e, menu) {
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
.second-panel {
  &.small{

  }
  height:auto;
  border-radius: 6px;

  .menu {
    &:hover {
      background: #696969;
    }

    &.active {
      background: #595959;
    }

    width: 8em;
    padding-left: 1em;
    font-size: 1.3em;
    height: 3em;
    line-height: 3em;
    border-radius: 0.3em;
    cursor: pointer;
    margin-bottom: 0.5em;
  }
}
.second-panel-back{
  width: 8em;
  padding-left: 1em;
  font-size: 1.3em;
  height: 3em;
  line-height: 3em;
  border-radius: 0.3em;
  cursor: pointer;
  margin-bottom: 0.5em;
  &:hover {
    background: #696969;
  }
}

</style>
