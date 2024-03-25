<script setup lang="ts">
import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
import { useSelect } from "../../hooks";
const data: any = ref({});
const loading = ref(true);

const wujieHeader: any = ref({});
// const wujie: any = ref({});
onMounted(async () => {
  console.log("props.customData :>> ", props.customData);
  loading.value = false;

  if (!props.customData?.id) return;
  // 查询数据
  let res = await useSelect(props.customData.id);
  console.log("----------------------- :>> ");
  console.log("res :>> ", res);
  let config = useParserCard(res);
  console.log("config :>> ", config);
  wujieHeader.value = config?.header;
  // wujie.value = config?.wujie;
  data.value = config;
  loading.value = false;
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
    <div
      class="w-full flex flex-col h-full"
      style="overflow: hidden !important"
    >
      <!-- <TTApp v-if="visible" @close="visible = false" />
      <xt-button @click="visible = true">打开控制中心</xt-button> -->
      <Wujie />
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
