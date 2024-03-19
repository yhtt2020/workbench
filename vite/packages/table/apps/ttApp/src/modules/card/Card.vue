<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
const data: any = ref({});
const loading = ref(true);

const wujieHeader: any = ref({});
const wujie: any = ref({});
onMounted(async () => {
  console.log("props.customData :>> ", props.customData);

  if (!props.customData?.id) return;
  // 查询数据
  await tsbApi.ttapp.select(props.customData.id, (obj) => {
    let config = useParserCard(obj);
    wujieHeader.value = config.header;
    wujie.value = config.wujie;
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
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :header="header"
    :menuList="[refresh]"
    customSize="8x8"
    class="xt-theme-b"
  >
    <!-- :customSize="customSize" -->

    <div
      class="overflow-scroll w-full xt-theme-b flex flex-col h-full xt-scrollbar"
      style="overflow: hidden !important"
    >
      <TTApp v-if="visible" @close="visible = false" />
      {{ visible }}
      <xt-button @click="visible = true">打开控制中心</xt-button>
      <WujieVue
        v-if="!loading"
        width="100%"
        height="100%"
        :name="wujie.name || ''"
        :url="wujie.url || ''"
      >
      </WujieVue>
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
../../ttApp/src/views/TTApp.vue
