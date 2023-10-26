<template>
  <div
    ref="containerRef"
    @click.stop.prevent="handleClickMenu($event)"
    @contextmenu.stop.prevent="handleContextMenu($event)"
  >
    <!-- 展开菜单的范围 -->
    <slot></slot>
    <!-- 将菜单传递到body -->
    <teleport to="body">
      <Transition
        @beforeEnter="handleBeforeEnter"
        @enter="handleEnter"
        @afterEnter="handleAfterEnter"
      >
        <!-- 便利菜单项 -->
        <div
          v-if="show"
          class="container fixed xt-modal xt-b xt-shadow rounded-xl xt-text"
          :style="pos"
        >
          <div
            class="list w-full h-full p-2"
            v-resize="handeleMenuViewport"
            @mouseleave="handeleCloseLock()"
            @mouseover="handeleStartLock()"
          >
            <template v-for="menu in props.menus">
              <template v-if="menu.slot">
                <div class="item rounded-lg">
                  <Item :data="menu" :name="name" />
                </div>
                <slot :name="menu.slot"></slot>
              </template>
              <xt-divider v-else-if="menu.divider" class="my-3" />
              <div
                v-else-if="menu.children"
                class="item rounded-lg"
                :key="menu[`${name}`]"
                @click="handleClick(menu)"
              >
                <xt-popover>
                  <xt-text class="w-full h-full">
                    <Item :data="menu" :name="name" />
                    <template #right>
                      <xt-new-icon
                        size="20"
                        class="mr-3"
                        icon="fluent:chevron-left-16-filled"
                        style="transform: rotate(180deg)"
                      />
                    </template>
                  </xt-text>
                  <template #content>
                    <div class="list w-full h-full p-1">
                      <div
                        class="item"
                        @click="handleClick(data)"
                        v-for="data in menu.children"
                        :name="name"
                      >
                        <Item :data="data" :isBg="true" />
                      </div>
                    </div>
                  </template>
                </xt-popover>
              </div>
              <div v-else class="item rounded-lg" @click="handleClick(menu)">
                <xt-text class="w-full h-full">
                  <Item :data="menu" :name="name" />
                </xt-text>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 200px;
  z-index: 999999999999;
  .list {
    border-radius: 12px;
    box-sizing: border-box;
    padding-bottom: 10px;
    overflow: hidden;

    .item {
      box-sizing: border-box;
      height: 40px;

      &:hover {
        background: var(--active-secondary-bg);
        cursor: pointer;
      }
    }
  }
}
</style>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted, onBeforeUnmount } from "vue";
import useWindowViewport from "./useWindowViewport";
import { reSize as vResize } from "./useElementResize";
import Item from "./Item.vue";

// 接收父组件传递的菜单项
const props = defineProps({
  menus: {
    type: Array<any>,
    default: () => [],
  },
  data: {
    default: "",
  },
  name: {
    default: "label",
  },
  fn: {
    default: "callBack",
  },

  start: {
    default: true,
  },
  lock: {
    default: true,
  },
  // 展开触发模式
  model: {
    default: "contextmenu",
  },
  // 用于手动触发事件
  trigger: {
    default: false,
  },
});

const { model, trigger, start, lock } = toRefs(props);
const emits = defineEmits(["closeMenu"]);

/**
 * 打开菜单
 */
const show = ref(false);
const menuX = ref(0);
const menuY = ref(0);

const setup = (e: any) => {
  menuX.value = e.clientX;
  menuY.value = e.clientY;
  show.value = true;
};

const handeleCustomTrigger = (e: any) => {
  if (trigger.value) {
    setup(e);
  }
};
// 右键
const handleContextMenu = (e: any) => {
  handeleCustomTrigger(e);
  if (!start.value || model.value != "contextmenu") return;
  setup(e);
};
// 左键
const handleClickMenu = (e: any) => {
  handeleCustomTrigger(e);
  if (trigger.value) {
    setup(e);
  }
  if (!start.value || model.value != "click") return;
  setup(e);
};
// 菜单项事件点击 调用回调函数
const handleClick = (menu: any) => {
  if (!menu?.lock) {
    show.value = false;
  }
  menu[props.fn] && menu[props.fn](props.data);
};
/**
 * 关闭菜单
 */
let lockState = ref(false);
const handeleStartLock = () => {
  if (lock.value) lockState.value = true;
};
const handeleCloseLock = () => {
  if (lock.value) lockState.value = false;
};
const handleCloseMenuCore = () => {
  show.value = false;
  emits("closeMenu");
};

const handleCloseMenu = () => {
  if (lockState.value) return;
  handleCloseMenuCore();
};

// 获取 视图大小
const { windowWidth, windowHeight } = useWindowViewport();
// 获取菜单大小
const w = ref(0);
const h = ref(0);

const handeleMenuViewport = (size: any) => {
  w.value = size.width;
  h.value = size.height;
};

// 菜单加载前
const handleBeforeEnter = (el: any) => {
  el.style.height = 0;
};
// 菜单加载后
const handleEnter = (el: any) => {
  el.style.height = "auto";
  const height = el.clientHeight;
  h.value = height;
  el.style.height = 0;
  // html5新增 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画
  // 该方法需要传入一个回调函数  回调函数会在页面被刷新时前调用
  requestAnimationFrame(() => {
    el.style.height = height + "px";
    el.style.transition = ".2s";
  });
};
// 菜单离开时
const handleAfterEnter = (el: any) => {
  el.style.transition = "none";
};

// 动态计算菜单坐标
const pos = computed(() => {
  // 菜单坐标
  let posX = menuX.value;
  let posY = menuY.value;
  // 视图大小
  let vW = windowWidth.value;
  let vH = windowHeight.value;

  // 菜单大小
  let menuW = w.value;
  let menuH = h.value;

  // x 坐标
  posX = posX > vW - menuW ? posX - menuW : posX;
  // Y 坐标
  posY = posY > vH - menuH ? vH - menuH : posY;
  return {
    left: posX + "px",
    top: posY + "px",
  };
});

onMounted(() => {
  window.addEventListener("click", handleCloseMenu, { capture: true });
  window.addEventListener("contextmenu", handleCloseMenu, { capture: true });
});
onBeforeUnmount(() => {
  window.addEventListener("click", handleCloseMenu, { capture: true });
  window.addEventListener("contextmenu", handleCloseMenu, { capture: true });
});
</script>
