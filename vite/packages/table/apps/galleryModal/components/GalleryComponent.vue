<template>
  <div
    class="w-full h-full xt-modal flex items-center justify-center rounded-r-xl px-4 pt-4 pb-0"
  >
    <!-- 我的收藏 1 -->
    <template v-if="pageStatus === 'm'">
      <My :isModal="true" @updateIndependentBg="updateBg" />
    </template>

    <!-- 精选壁纸 1 -->
    <template v-else-if="pageStatus === 'w'">
      <SiftPaper :isModal="true" @updateIndependentBg="updateBg" />
    </template>

    <!-- 必应壁纸 -->
    <template v-else-if="pageStatus === 'b'">
      <Bing :isModal="true" />
    </template>

    <!-- 拾光壁纸 1 -->
    <template v-else-if="pageStatus === 'p'">
      <Picking :isModal="true" @updateIndependentBg="updateBg" />
    </template>

    <!-- 动态壁纸 -->
    <template v-else-if="pageStatus === 'l'">
      <Lively :isModal="true" />
    </template>

    <!-- 设置 -->
    <template v-else-if="pageStatus === 's'">
      <Setting :isModal="true" />
    </template>
  </div>
  <xt-confirm
    @close="open = false"
    v-if="open"
    :maskIndex="999999"
    :mask="true"
    ref="confirm"
    title="选择当前壁纸所需要设置的桌面"
  >
    <template #footer>
      <xt-button :w="120" h="40" @click="onConfirmClick">
        <span class="xt-text-2">取消</span>
      </xt-button>
      <xt-button
        :w="120"
        h="40"
        class="ml-3"
        type="theme"
        @click="onConfirmClick('common')"
        >通用桌面
      </xt-button>
      <xt-button
        :w="120"
        h="40"
        class="ml-3"
        type="theme"
        @click="onConfirmClick('independent')"
        >当前桌面
      </xt-button>
    </template>
  </xt-confirm>
</template>

<script setup>
import { ref, toRefs, getCurrentInstance, inject } from "vue";
import { message } from "ant-design-vue";
import { appStore } from "../../../store";
// setBackgroundImage
// ...mapActions(appStore, ["setBackgroundImage"]),
//
const { proxy } = getCurrentInstance();
import My from "../../../page/gallery/My.vue";
import SiftPaper from "../../../page/gallery/SiftPaper.vue";
import Picking from "../../../page/gallery/Picking.vue";

import Bing from "../../../page/gallery/Bing.vue";
import Lively from "../../../page/gallery/Lively.vue";
import Setting from "../../../page/gallery/Setting.vue";
// impor
const confirm = ref();

const props = defineProps({
  // 当前页面切换选中状态
  pageStatus: {
    type: String,
    required: true,
  },
});
// window.$ui.confirm('',)
const modalParams = inject("modalParams");
const close = () => {
  confirm.value.close();
  currentImg.value = null;
  open.value = false;
};
const onConfirmClick = (type) => {
  if (type === "common") {
    updateCommonBg(currentImg.value);
  } else if (type === "independent") {
    // updateIndependentBg(currentImg.value);
    proxy.$bus.emit("setIndependentBg", currentImg.value.path);
  }
  close();
};
const open = ref(false);
const currentImg = ref();
// 更新壁纸
const updateBg = (img) => {
  // 有独立参数 说明为独立壁纸
  if (modalParams?.independent) {
    updateIndependentBg(img);
    return;
  }
  // 无壁纸
  open.value = true;
  currentImg.value = img;
  return;
};
const updateIndependentBg = (img) => {
  if (img.srcProtocol) {
    proxy.$bus.emit("independentBg", `file://${img.src}`);
  } else {
    proxy.$bus.emit("independentBg", img.path);
  }
};
const updateCommonBg = (img) => {
  if (img !== null) {
    message.info("正在为您设置背景");
  }
  // proxy.$bus.emit("setIndependentBg",false);
  if (img.srcProtocol) {
    appStore().setBackgroundImage({ path: "", runpath: `file://${img.src}` });
  } else {
    if (!img.path) {
      img.path = img.src;
    } else {
      appStore().setBackgroundImage(img);
    }
  }
};

const { pageStatus } = toRefs(props);
</script>

<style lang="scss" scoped></style>
