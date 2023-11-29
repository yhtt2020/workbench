<template>
  <Widget
  :options="options"
  :sizeList="sizeList"
  :customData="customData"
  :desk="desk"
  >
  <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="ri:weibo-fill" style="font-size: 20px;" />
        </div>
      </template>
  <div class="flex flex-col mt-1 overflow hot-box" style="height: 95%;">
    <div ref="refreshButton" @click="refreshNow" class="pointer" style="position: absolute;left: 120px;top: 16px;">
      <!-- <icon icon="shuaxin"></icon> -->
      <newIcon icon="fluent:arrow-counterclockwise-20-filled" style="font-size: 20px;"/>
    </div>
    <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height: 100%;">

      <div  v-for="item in hotList" :key="item.id" @click="jump(item.title)"
        class="flex items-center justify-between w-full rounded-lg pointer set-type"
        style="margin: 8px 0 8px;">
        <span class="sort">{{ item.id }}</span>
        <div class="flex items-center flex-1 ml-3">
          <div class="truncate" style="color: var(--primary-text);font-size: 16px;"
          :style="customData.width === 2 ? 'max-width:390px' : 'max-width: 214px;'">
            {{ item.title }}
          </div>
        </div>
        <div v-if="customData.width === 2" style="color:var(--secondary-text);font-size: 16px;">
          {{ fix(item.heat) }}
        </div>
      </div>
    </vue-custom-scrollbar>

</div>
  </Widget>
</template>

<script>
import Widget from '../card/Widget.vue'
import { mapActions, mapWritableState } from 'pinia'
import { hotStore } from '../../store/hot'
import browser from '../../js/common/browser'
import { message } from 'ant-design-vue'
import {Icon as newIcon} from '@iconify/vue'
export default {
  name: 'HotSearch',
  components: {
    Widget,
    newIcon
  },
  props: {
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    desk:{
      type:Object
    }
  },
  data () {
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      options: {className: 'card',title: '微博热搜',type: 'hotSearch'},
      sizeList:[{title:'2x4',height:2,width:1,name:'1x2'},{title:'4x4',height:2,width:2,name:'2x2'}],
      hotList: []
    }
  },
  computed: {
    ...mapWritableState(hotStore,['data'])
  },
  async mounted() {
    this.getData().then(()=>{
      this.hotList = this.data
    })


  },
  methods: {
    ...mapActions(hotStore,['getData','refresh']),
    jump(words){
      browser.openInUserSelect('https://s.weibo.com/weibo?q='+words)
    },
    refreshNow(){
      this.$refs.refreshButton.classList.add('animate-spin')
      setTimeout(()=>{
        this.$refs.refreshButton.classList.remove('animate-spin')
        message.success({content: '刷新榜单成功',key:'refreshWeibo' })
      },500)
      this.refresh()
    },
    fix(heat){
      const display=heat.split(' ')
      if(display.length===1){
        return heat
      }
      display[1]=(Number(display[1])/10000).toFixed(1)+'万'
      return display[0]+' '+display[1]
    }
  }
}
</script>

<style scoped lang="scss">
// .hot-box{
//   height: 95%;
//   overflow-x: hidden;
//   overflow-y: auto;
// }
// .hot-box::-webkit-scrollbar{
//   display: none;
// }

.sort {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--mask-bg);
  border-radius: 4px;
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 600;
}

.set-type:nth-of-type(1) > span {
  background: #FE2C46;
}

.set-type:nth-of-type(2) > span {
  background: #FF6600;
}

.set-type:nth-of-type(3) > span {
  background: #FAAA10;
}

.active-index{
  background: var(--active-bg) !important;
}

</style>
