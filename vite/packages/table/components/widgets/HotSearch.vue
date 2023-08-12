<template>
  <Widget 
  :options="options" 
  :sizeList="sizeList"
  :customData="customData"
  :desk="desk" 
  >
  <div class="flex flex-col overflow mt-1" style="height: 95%;overflow:hidden;">
    <div  v-for="item in hotList" :key="item.id"
      class="w-full flex items-center rounded-lg justify-between pointer set-type" 
      style="margin: 8px 0 8px;">
      <span class="sort">{{ item.id }}</span>
      <div class="flex-1 flex ml-3 items-center">
        <div class="truncate" style="color: var(--primary-text);font-size: 16px;"
        :style="customData.width === 2 ? 'max-width:390px' : 'max-width: 214px;'">
          {{ item.title }}
        </div>
      </div>
      <div v-if="customData.width === 2" style="color:var(--secondary-text);font-size: 16px;">
        {{ item.heat }} 
      </div>
    </div>
</div>
  </Widget>
</template>

<script>
import Widget from '../card/Widget.vue'
import { mapActions, mapWritableState } from 'pinia'
import { hotStore } from '../../store/hot'
export default {
  name: 'HotSearch',
  components: {
    Widget,
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
      options: {className: 'card',title: '微博热搜',icon: 'weibo1',type: 'hotSearch'},
      sizeList:[{title:'1x2',height:2,width:1,name:'1x2'},{title:'2x2',height:2,width:2,name:'2x2'}],
      hotList: []
    }
  },
  computed: {
    ...mapWritableState(hotStore,['data'])
  },
  async mounted() {
    await this.getData()
    console.log(this.data)
    this.hotList = this.data.hotList
    
  },
  methods: {
    ...mapActions(hotStore,['getData'])
  }
}
</script>

<style scoped lang="scss">

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
