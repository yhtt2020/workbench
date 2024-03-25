<script setup lang="ts">
import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
import { useSelect } from "../../hooks";
import WuJie from "../wujie/WuJie.vue";
import { useTTAppStore } from "../../store";
const ttappStore: any = useTTAppStore();
const loading = ref(true);
// 卡片头部
const cardHeader: any = ref({});
// 卡片大小
const customSize = ref("2x2");
const wujie: any = ref({});

// 卡片状态 无数据、加载中、正常 对应的值分别为 noData、loading、normal

const status = ref("loading");
onMounted(async () => {
  loading.value = false;
  // 无数据情况
  if (!props.customData?.id) return;
  // 查询数据
  let res = ttappStore.select(props.customData.id);

  if (!res) return;
  // 解析数据
  let data = useParserCard(res);
  customSize.value = data.customSize;
  cardHeader.value = data.header;
  wujie.value = data.wujie;
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
    ...cardHeader.value,
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
    :customSize="customSize"
    class="xt-theme-b"
  >
    <div
      class="w-full flex flex-col h-full"
      style="overflow: hidden !important"
    >
      <TTApp v-if="visible" @close="visible = false" />
      <xt-button @click="visible = true">打开控制中心</xt-button>
      <template v-if="!loading">
        <WuJie v-bind="wujie" :id="customData.id" />
      </template>
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
