<script setup lang="ts">
import  dbStorage  from "../../../../../store/dbStorage";
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
const data: any = ref({});
const loading = ref(true);

const wujieHeader: any = ref({});
const wujie: any = ref({});
onMounted(async () => {
  console.log("props.customData :>> ", props.customData);
  loading.value = false;

  if (!props.customData?.id) return;
  // 查询数据
  await tsbApi.ttapp.select(props.customData.id, (obj) => {
    let config = useParserCard(obj);
    wujieHeader.value = config?.header;
    wujie.value = config?.wujie;
    data.value = config;
    loading.value = false;
  });
});
const props = defineProps({
  customIndex: {},
  customData: {
    type: Object,
  },
});
const options = ref({
  bg: "pink",
});
const visible = ref(false);

const refresh = ref({
  fn: () => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
    }, 1);
  },
  newIcon: "fluent:arrow-clockwise-16-regular",
  tip: "刷新",
  title: "刷新",
});

const header = computed(() => {
  return {
    ...wujieHeader.value,
    refresh: refresh.value,
  };
});

let obj = {
  test: "test success",
};
// window.parent.window = {};
const test = (iframeWindow: any) => {
  let res = {
    windowPropertyOverride: (iframeWindow) => {
      console.log("iframeWindow :>> ", iframeWindow);

      console.log("222 :>> ", 222);
      iframeWindow.A = obj;
      // iframeWindow.parent = {}
      console.log("iframeWindow.parent :>> ", iframeWindow.parent);
      // iframeWindow.localStorage = dbStorage
      return iframeWindow;
    },
  };
  return res;
};
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :header="header"
    :menuList="[refresh]"
    :options="options"
    customSize="8x8"
    class="xt-theme-b"
  >
    <!-- :customSize="customSize" -->

    <div
      class="overflow-scroll w-full flex flex-col h-full xt-scrollbar"
      style="overflow: hidden !important"
    >
      <TTApp v-if="visible" @close="visible = false" />
      {{ visible }}
      <xt-button @click="visible = true">打开控制中心</xt-button>
      {{ loading }}
      <!-- v-if="!loading" -->
      <WujieVue
        v-if="!loading"
        ref="wujie"
        url="http://localhost:5173/"
        :plugins="[
          {
            jsBeforeLoaders: [
              { content: 'window.tt = window.parent.tt' },
              { content: 'window.$wujie = window.parent.dd' },
            ],
          },
          // {
          //   // 对子应用的template进行的aaa替换成bbb
          //   htmlLoader: (code: any) => {
          //     console.log('code :>> ', code)
          //     return code.replace('Tom', 'bbb')
          //   }
          // },

          test(),
        ]"
      />
      <!-- <WujieVue
        width="100%"
        height="6%"
        :name="'1' + customIndex"

        url="http://192.168.0.129:5173"
        :alive="true"
        :plugins="[
          {
            jsBeforeLoaders: [
              { content: 'window.tt = window.parent.tt' },
              // { content: 'window.parent = window.parent.tt' },
              // { content: 'window.parent.window = window.parent.tt' },
              // { content: 'window = window.parent.tt' },
              // { content: 'window.window = window.parent.tt' },
            ],
          },
          windowPropertyOverride(),
        ]"
      >
      </WujieVue> -->
      <!-- http://1611037570.3vhost.club/ -->
      <!-- url="ttapp://2mhM/index.html -->
      <!-- url="https://www.yinaor.com/docs/front/micro/micro-intro/" -->
      <!-- url="http://localhost:5173" -->
      <!-- url="http://127.0.0.1:5500/index.html" -->
      <!-- url="http://127.0.0.1:5501/src/views/test/1.html" -->
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
