<!-- 底部tab切换 -->
<template>
  <div
    class="flex flex-row xt-main-top-util-bar desk-group-switcher"
    v-if="showTopBar && !fullScreen"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <xt-task id="D0001" no="1" @cb="clickDesk">
      <!-- tab切换桌面按钮 -->
      <div class="panel s-bg">
        <div class="flex flex-row tabs" v-if="showTabs">
          <!-- 当前社群桌面头像 -->
          <div
            style="width: 38px; height: 38px"
            class="flex items-center justify-center"
          >
            <a-avatar :src="communityInfo?.icon" :size="38" shape="square" />
          </div>

          <!-- 桌面切换列表 -->
          <div
            :class="{ 'tab-active': currentDeskId === item.id }"
            @click="setCurrentDeskId(item.id)"
            class="pr-3 truncate tab s-bg xt-text"
            v-for="(item, index) in tabList"
          >
            <a-avatar
              v-if="item.iconUrl"
              shape="square"
              class="mr-2 icon"
              :size="22"
              :src="item.iconUrl"
            />
            <icon
              v-else
              :icon="item.icon || 'desktop'"
              style="font-size: 18px; vertical-align: middle"
              class="mr-2"
            />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>

      <div class="flex dots item-content">
        <div
          :class="{ active: currentDeskId === item.id }"
          class="dot"
          v-for="(item, index) in tabList"
        >
          &nbsp;
        </div>
      </div>
    </xt-task>

    <div v-if="false">
      <div class="flex flex-row ml-1">
        <slot name="toolsBefore"></slot>
        <a-tooltip title="菜单" placement="bottom">
          <div class="pl-3"></div>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTopBar: {
      type: Boolean,
      default: true,
    },
    fullScreen: {
      type: Boolean,
      default: true,
    },
    communityInfo: {
      type: Object,
      default: () => {},
    },
    tabList: {
      type: Array,
      default: () => [],
    },
    showTabs: {
      type: Boolean,
      default: true,
    },
    currentDeskId: {
      type: String,
      required: true,
    },
  },

  methods: {
    // 鼠标事件
    handleMouseEnter() {
      this.$bus.emit("stopHide");
    },
    handleMouseLeave() {
      this.$bus.emit("startHide");
    },

    // 切换桌面
    setCurrentDeskId(id){
     this.$emit('tabDeskId',id);
    },

    clickDesk(){
      this.$emit('clickTabDesk')
    },
    
  },
};
</script>

<style lang="scss" scoped>
.btn-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
  height: 42px;
  line-height: 42px;

  &:hover {
    opacity: 0.8;
  }
}

.tab-bg {
  background: var(--primary-bg);
  color: var(--primary-text);
}

.btn-item {
  height: 48px;
  background: var(--secondary-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0;
  border-radius: 12px;
  font-size: 16px;
  color: var(--primary-text);
  cursor: pointer;
}

.desk-title {
  font-size: 16px;
  color: var(--primary-text);
  font-weight: 500;
}

.input {
  width: 452px;
  height: 48px;
  background: var(--secondary-bg);
  border-radius: 12px;
  color: var(--primary-text);
  font-size: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 21px 0 24px;
}

.desk-group-switcher {
  svg {
    display: inline-block;
  }
  min-width: 100px;
  min-height: 20px;
  z-index: 99;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -10px;
  display: flex;
  justify-items: center;
  margin: auto;
  .tabs {
    gap: 10px;
    .tab {
      .icon {
        margin-top: -1px;
        vertical-align: text-top;
      }
      cursor: pointer;
      &.tab-active,
      &:hover {
        opacity: 1;
      }
      &.tab-active {
        background: var(--active-bg);
        color: var(--active-text) !important;
      }
      line-height: 38px;
      font-size: 15px;
      width: 120px;
      border-radius: 8px;

      padding-left: 10px;
      padding-right: 10px;
      text-align: center;
    }
    .more {
      min-width: 80px;
    }
    .home {
      min-width: 90px;
    }
  }
  .dots {
    cursor: pointer;
    padding: 20px;
    gap: 10px;
    padding-bottom: 5px !important;
    .dot {
      background: var(--secondary-bg);
      width: 15px;
      height: 15px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1000px;

      &.active {
        width: 40px;
      }
    }
  }
  &:hover {
    .panel {
      display: flex;
    }

    .dots {
      display: none;
    }
  }
  .panel {
    display: none;
  }
  .dots {
    display: flex;
  }
  .panel {
    padding: 10px;
    border-radius: 12px;
    border: 1px solid var(--divider) !important;
  }
}
</style>