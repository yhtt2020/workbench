<template>
  <!-- 仅供改样式快速搜索：菜单切换 -->
  <div class="flex flex-row rounded-lg p-1 " :class="bgColor"
    :style="{ backgroundColor: 'var(--secondary-bg)', height: itemHeight }">
    <div v-for="(item, index) in navList"
      class=" w-40 h-full nav-item flex justify-center btn-active items-center relative rounded-lg pointer"
      @click.stop="clickNav(item, index)" :class="activeIndex === index ? 'xt-active-btn ' : 'xt-text-2'">
      <span class="">{{ item.title }}</span>
      <div v-if="item.state === true" class="state-dot ml-2"></div>
    </div>
  </div>
</template>

<script>
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
      default: 's-item'
    },
    height: {
      type: Number,
      default: 48
    }
  },
  data() {
    return {
      activeIndex: 0
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

    }
  },
  mounted() {
    this.posType()
  },
  methods: {
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
      this.$emit('click')
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
.item-text{
  color: rgba(255,255,255,0.85);
}
</style>
