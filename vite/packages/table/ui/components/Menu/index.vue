<template>
  <div ref="containerRef" @click="handeleCustomTrigger($event)">
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
          <div class="list w-full h-full p-2" v-resize="handeleMenuViewport">
            <template v-for="menu in props.menus">
              <template v-if="menu.slot">
                <div class="item rounded-lg">
                  <Item :data="menu" :name="name" />
                </div>
                <slot :name="menu.slot"></slot>
              </template>
              <xt-divider v-else-if="menu.divider" class="my-3" />
              <div
                v-else
                class="item rounded-lg"
                :key="menu[`${name}`]"
                @click="handleClick(menu)"
              >
                <xt-popover>
                  <xt-text class="w-full h-full">
                    <Item :data="menu" :name="name" />
                    <template #right v-if="menu.children">
                      <xt-new-icon
                        size="20"
                        class="mr-3"
                        icon="fluent:chevron-left-16-filled"
                        style="transform: rotate(180deg)"
                      />
                    </template>
                  </xt-text>
                  <template #content v-if="menu.children">
                    <div class="list w-full h-full p-1">
                      <div
                        class="item"
                        v-for="data in menu.children"
                        :name="name"
                      >
                        <Item :data="data" :isBg="true" />
                      </div>
                    </div>
                  </template>
                </xt-popover>
              </div>
            </template>
          </div>
        </div>
      </Transition>
    </teleport>
  </div>
</template>

<style lang="less" scoped>
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
import { ref, computed, toRefs } from "vue";
import useMenuEvent from "./useMenuEvent";
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
  // 展开触发模式
  model: {
    default: "contextmenu",
  },
  // 用于手动触发事件
  trigger: {
    default: false,
  },
});

const { model, trigger, start } = toRefs(props);
const emits = defineEmits("closeMenu");
// 菜单离开回调
const handleCloseMenu = () => {
  emits("closeMenu");
};
// 菜单项事件点击 调用回调函数
const handleClick = (menu: any) => {
  menu[props.fn] && menu[props.fn](props.data);
};

// 获取菜单坐标
const containerRef = ref();
const { menuX, menuY, show } = useMenuEvent(
  containerRef,
  model,
  start,
  handleCloseMenu
);
// 自定义触发事件

const handeleCustomTrigger = (e) => {
  if (trigger.value) {
    menuX.value = e.clientX;
    menuY.value = e.clientY;
    show.value = true;
  }
};
// 获取 视图大小
const { windowWidth, windowHeight } = useWindowViewport();
// 获取菜单大小
const w = ref(0);
const h = ref(0);

const handeleMenuViewport = (size: any) => {
  w.value = size.width;
  // 这里没获取h 是因为加了过渡 高度会一直更新
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
    el.style.transition = ".3s";
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
  posX = posX > vW - w.value ? posX - w.value : posX;
  // Y 坐标
  console.log('vH - h.value :>> ', vH - h.value);
  console.log('PosY :>> ', posY);
  posY = posY > vH - h.value ? posY - vH + h.value + 10 : posY;
  return {
    left: posX + "px",
    top: posY + "px",
  };
});
</script>
