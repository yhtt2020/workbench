<script setup lang="ts">
// import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
import WuJie from "../wujie/WuJie.vue";
import TTAppCenter from "../../../../appCenter";
import { useTTAppStore } from "../../store";
import { useAppCenterStore } from "../../../../appCenter/src/store";
import { storeToRefs } from "pinia";

const appCenterStore = useAppCenterStore();
const { visible: appCenterVisible } = storeToRefs(appCenterStore);

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
  console.log("props.customData.id :>> ", props.customData.id);
  let res = ttappStore.select(props.customData.id);
  console.log("res 22222 :>> ", res);
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

const appCenter = ref(false);
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :header="header"
    :menuList="[refresh]"
    :options="options"
    :customSize="customSize"
  >
    <!-- <WuJie v-bind="wujie" :id="customData.id" /> -->

    <div
      class="w-full flex flex-col h-full xt-theme-b"
      style="overflow: hidden !important"
    >
      <!-- <xt-button @click="ttappStore.modal.visible = true">go modal</xt-button>
      <xt-button @click="visible = true">go oldInstall</xt-button>
      <TTApp v-if="visible" @close="visible = false" />
      <xt-button @click="appCenterVisible = true">go appCenter</xt-button>
      <TTAppCenter v-if="appCenterVisible" /> -->
      <template v-if="!loading">
        <WuJie v-bind="wujie" :id="customData.id" class="" />
      </template>
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
