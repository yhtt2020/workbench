<script setup lang="ts">
import { ref } from "vue";
import TTapp from "../../ttApp/src/TTApp.vue";

// 旧版测试代码
const header = {
  ifyIcon: "fluent:add-16-filled",
  leftHover: true,
  leftHoverName: "222",
  title: "123",
};
const props = defineProps({
  customIndex: {},
  customData: {
    default: () => {
      return {
        customSize: "4x4",
        name: "",
      };
    },
  },
});
const visible = ref(false);
// 9OdI
// tsbapi.
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    customSize="8x8"
    :header="header"
    class="xt-theme-b"
  >
    <div
      class="w-full xt-theme-b flex flex-col flex-1 h-full overflow-hidden"
      style="overflow: hidden !important"
    >
      <!-- <TTapp v-if="visible" @close="visible = false" />
      {{ visible }}
      <xt-button @click="visible = true">打开控制中心</xt-button> -->
      <WujieVue
        width="100%"
        height="100%"
        name="vue2-demo"
        url="http://127.0.0.1:5500/index.html"
      >
        <!-- url="https://www.yinaor.com/docs/front/micro/micro-intro/" -->
        <!-- url="http://localhost:5173" -->
        <!-- url="http://127.0.0.1:5500/index.html" -->
        <!-- url="http://127.0.0.1:5501/src/views/test/1.html" -->

      </WujieVue>
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
