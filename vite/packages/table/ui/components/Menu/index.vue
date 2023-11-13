<template>
  <div
    ref="containerRef"
    @click.prevent.stop="handleOpenMenu($event, 'click')"
    @contextmenu.prevent.stop="handleOpenMenu($event, 'contextmenu')"
  >
    <slot></slot>
    <teleport to="body">
      <Transition
        @beforeEnter="handleBeforeEnter"
        @enter="handleEnter"
        @afterEnter="handleAfterEnter"
      >
        <div
          v-if="show"
          class="container fixed xt-modal xt-b xt-shadow rounded-xl xt-text"
          :style="pos"
          v-resize="handleMenuViewport"
          @mouseleave="handleCloseLock()"
          @mouseover="handleStartLock()"
        >
          <slot name="menu">
            <div class="list w-full h-full p-2">
              <Menus
                @handleClick="handleItemCallBack"
                :menus="menus"
                :name="name"
                :fn="fn"
              >
                <template #cardSize>
                  <slot name="cardSize"></slot>
                </template>
              </Menus>
            </div>
          </slot>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted, onBeforeUnmount } from "vue";
import useWindowViewport from "./useWindowViewport";
import { reSize as vResize } from "./useElementResize";
import Menus from "./Menus.vue";
// import type { MenuProps } from "./types";
interface Menus {
  name: string;
  fn?: () => void;
  lock?: boolean;
  children?: any[];
}

export interface MenuProps {
  menus: Menus[];
  name?: string;
  fn?: string;
  type?: string;
  lock?: boolean;
  model?: string;
  beforeCreate?: () => boolean;
  beforeUnmount?: () => boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  menus: () => [
    {
      name: "下班",
      fn: () => {
        console.log("我到点下班啦！~ ");
      },
    },
    {
      name: "吃啥",
      lock: true,
      children: [
        {
          name: "炸鸡",
          fn: () => {
            console.log("这餐吃炸鸡~ ");
          },
        },
      ],
    },
  ],
  name: "label",
  fn: "callBack",
  type: "menu",
  lock: true,
  model: "contextmenu",
  beforeCreate: () => true,
  beforeUnmount: () => true,
});

const { type, model, lock, beforeCreate, beforeUnmount } = toRefs(props);
/**
 * 菜单回调
 * @mounted 菜单打开后
 * @selected 菜单项中时
 * @destroyed 菜单关闭后
 */
const emits = defineEmits(["mounted", "selected", "destroyed"]);

/**
 * 打开菜单
 */
const show = ref(false);
const menuX = ref(0);
const menuY = ref(0);

function handleOpenMenu(e: any, currentModel: string) {
  if (!beforeCreate.value()) return;


  if (model.value != currentModel && model.value != "all") return;
  console.log('222 :>> ', 222);
  menuX.value = e.clientX;
  menuY.value = e.clientY;
  show.value = true;
}

// 菜单项事件点击 调用回调函数
function handleItemCallBack(menu: any) {
  if (!menu?.lock) {
    show.value = false;
  }
  emits("selected", menu);
  menu[props.fn] && menu[props.fn](menu);
}
/**
 * 关闭菜单
 */
let lockState = ref(false);
function handleStartLock() {
  if (lock.value) lockState.value = true;
}
function handleCloseLock() {
  if (lock.value) lockState.value = false;
}
function handleCloseMenu() {
  if (lockState.value) return;
  if (!beforeUnmount.value()) return;
  show.value = false;
  emits("destroyed");
}

// 获取 视图大小
const { windowWidth, windowHeight } = useWindowViewport();
// 获取菜单大小
const w = ref(0);
const h = ref(0);

const handleMenuViewport = (size: any) => {
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
    el.style.transition = ".03s";
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

<style lang="scss" scoped>
.container {
  width: 200px;
  z-index: 999999999999;

  .list {
    border-radius: 12px;
    box-sizing: border-box;
    padding-bottom: 10px;
    overflow: hidden;
  }
}
</style>
