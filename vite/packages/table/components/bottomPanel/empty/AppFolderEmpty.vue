<template>
  <div class="flex w-full h-full items-center justify-center">
    <div class="grid-container">
      <div v-for="item in list" class="grid-item xt-bg-2 rounded-xl">
        <div class="flex items-center justify-center h-full flex-col">
          <div class="flex items-center mb-3">
            <xt-ify-icon
              v-for="children in item.icon"
              :icon="children"
              class="mr-3 addFolder-icon"
              size="32"
            ></xt-ify-icon>
          </div>
          <div style="max-width: 200px; text-align: center" class="mb-4">
            <span class="font-16 xt-text xt-font">{{ item.title }}</span>
          </div>
          <xt-button
            v-if="item.btnText !== ''"
            type="theme"
            w="84"
            h="32"
            style="border-radius: 8px"
            @click="item.fn"
          >
            {{ item.btnText }}
          </xt-button>
          <xt-button
            v-if="item.disableBtnText !== ''"
            w="84"
            h="32"
            class="xt-bg-t-2"
            style="border-radius: 8px"
          >
            {{ item.disableBtnText }}
          </xt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const list = ref([
  {
    icon: ["fluent:apps-add-in-16-regular"],
    title: "从应用图标选择器」中自定义添加",
    btnText: "选择添加",
    disableBtnText: "",
    fn: () => {
      proxy.$bus.emit('openIconAdd');
    },
  },
  {
    icon: [
      "fluent:desktop-16-regular",
      "fluent:tablet-16-regular",
      "fluent:app-folder-16-regular",
    ],
    title: "从你的桌面、导航栏、分组中选择添加",
    btnText: "选择添加",
    disableBtnText: "",
    fn:()=>{
      proxy.$bus.emit('openDeskAppModal')
    }
  },
  {
    icon: ["fluent:hard-drive-16-regular"],
    title: "添加软件类型图标（需要启用软件库）",
    btnText: "",
    disableBtnText: "暂不支持",
  },
  {
    icon: ["fluent:globe-16-regular"],
    title: "从外部拖动URL地址到窗口中直接添加",
    btnText: "",
    disableBtnText: "",
  },
]);

</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
.grid-item {
  width: 280px;
  height: 200px;
}
.addFolder-icon {
  &:last-of-type {
    margin-right: 0 !important;
  }
}
</style>