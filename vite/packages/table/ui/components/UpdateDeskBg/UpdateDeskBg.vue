<template>
  <xt-option-tab  v-model="backgroundName.name" :list="tabList" circle class="mb-4"  style="height: 40px;" />

  <template v-if="backgroundName.name === 'img'">
    <xt-button w="200" h="112" class="xt-bg-m relative"  style="border-radius: 6px"  @click="openPaperModal" >
     <div class="flex items-center justify-center" v-if="backImage.src === ''">
      <xt-new-icon icon="fluent:add-16-regular" size="20"></xt-new-icon>
     </div>
     <div v-else class="w-full h-full absolute top-0 left-0 rounded-md">
      <img :src="backImage.src" class="w-full h-full object-cover rounded-md"/>
     </div>
    </xt-button>
  </template>

  <template v-else>
   <div class="flex">
    <xt-option-color v-model:color="backgroundColor.color" />
   </div>
  </template>

  <GalleryModal ref="paperModal" />
</template>

<script setup>
import { ref, computed,watch } from "vue";
import { storeToRefs } from "pinia";
import { appStore } from "../../../store";

import GalleryModal from "../../../components/paperModal/GalleryModal.vue";

const tabList = ref([
  { name: "图片", value: "img" },
  { name: "纯色", value: "color" },
]);

const paperModal = ref(null);

const app = appStore();
const { backgroundImage,backgroundName,backgroundColor } = storeToRefs(app);

// 触发打开壁纸弹窗
const openPaperModal = () => {
  paperModal.value.openGalleryModal();
};

// 计算属性获取当前壁纸数据
const backImage = computed(() => {
  if (backgroundImage.value.path !== "") {
    return { src: backgroundImage.value.src };
  } else {
    return { src: "https://a.apps.vip/papers/neom-207NEuFvjlg-unsplash.jpg" };
  }
});

</script>

<style lang="scss" scoped>
:deep(.nav-box) {
  border-radius: 8px !important;
}
</style>