<template>
  <!-- 快速搜索 头部 菜单切换 -->
  <div class="flex flex-row rounded-lg p-1" :class="bgColor" :style="{ height: itemHeight }"
    style="background: var(--primary-bg);color: var(--primary-text);">
    <!-- <div v-for="(item, index) in navList"
      class=" w-40 h-full nav-item flex justify-center btn-active items-center relative rounded-lg pointer"
      @click.stop="clickNav(item, index)" :class="activeIndex === index ? 's-item' : ''"> -->
    <template v-for="(item, index) in navList">

      <div class=" w-40 h-full nav-item flex justify-center btn-active items-center relative rounded-lg pointer xt-active"
        @click.stop="clickNav(item, index)" :class="activeIndex === index ? 'xt-active-btn' : ''" >
        <droppable-area @hover="handleHover">
          <span :data-index="index"
        :data-item="JSON.stringify(item)">{{ item.title }}</span>
          <div v-if="item.state === true" class="state-dot ml-2"></div>
        </droppable-area>
      </div>
    </template>
  </div>
</template>

<script>
import DroppableArea from './widgets/myIcons/hooks/DroppableArea.vue'
export default {
  name: 'HorizontalPanel',
  emits: ['changed'],
  props: {
    navList: {
      type: Array,
      default: () => []
    },
    selectType: {
      type: Object,
      default: () => { }
    },
    bgColor: {
      type: String,
      default: 's-bg'
    },
    height: {
      type: Number,
      default: 48
    }
  },
  components: {
    DroppableArea
  },
  data() {
    return {
      activeIndex: 0,
      index: 0
    }
  },
  computed: {
    itemHeight() {
      return this.height + 'px'
    }
  },
  watch: {
    'selectType': {
      handler() {
        this.posType()
      }
    },
    activeIndex: {
      handler(newV, oldV) {
        this.index = newV
        console.log('newV :>> ', newV);
      },
      immediate: true
    },
  },
  mounted() {
    this.posType()
  },
  methods: {
    handleHover(event) {
      const index = event.target.dataset.index;
      if (index != undefined && index != this.index) {
        let item = event.target.dataset.item;
        if (item) item = JSON.parse(item);
        this.clickNav(item, index)
      }
    },
    posType() {
      if (this.selectType) {
        if (this.selectType.name && this.navList.length > 0) {
          this.activeIndex = this.navList.findIndex(item => {
            return item.name === this.selectType.name
          })
        }
      }

    },
    clickNav(item, index) {
      this.activeIndex = index
      item.state = false  // 将消息未读状态隐藏
      this.$emit('update:selectType', item)
    }
  },
}
</script>

<style  scoped>
.state-dot {
  width: 8px;
  height: 8px;
  background: #FF4D4F;
  border-radius: 4px;
}
</style>
