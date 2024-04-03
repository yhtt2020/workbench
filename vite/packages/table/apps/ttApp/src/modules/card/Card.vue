<script setup lang="ts">
// import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
import WuJie from "../wujie/WuJie.vue";
import TTAppCenter from "../../../../appCenter";
import { useTTAppStore } from "../../store";
import { useAppCenterStore } from "../../../../appCenter/src/store";
import { getAppImg } from "../../hooks/getAppImg";
import { storeToRefs } from "pinia";

const appCenterStore = useAppCenterStore();
const { visible: appCenterVisible } = storeToRefs(appCenterStore);

const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
const loading = ref(true);
// 卡片头部
const cardHeader: any = ref({});
// 卡片大小
const customSize = ref("2x2");
const wujie: any = ref({});

const data = ref();
// 卡片状态 无数据、加载中、正常 对应的值分别为 noData、loading、normal

const status = ref("loading");
onMounted(async () => {
  loading.value = false;
  // 无数据情况
  if (!props.customData?.id) return;
  // 查询数据
  let res = ttappStore.select(props.customData.id);
  console.log("res :>> ", res);
  if (!res) return;
  // 解析数据
  let options = useParserCard(res);
  data.value = res;
  customSize.value = options.customSize;
  cardHeader.value = options.header;
  wujie.value = options.wujie;
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
const menus = computed(() => {
  let list = [
    refresh.value,
    {
      newIcon: "fluent:open-16-regular",
      title: "弹窗内打开",
      fn: () => {
        modal.value.id = data.value.id;
        modal.value.visible = true;
      },
    },
  ];
console.log('list :>> ', list);
  return list;
});
const headerImg = () => {
  console.log("12323123 :>> ", 12323123);
  console.log("data.value :>> ", data.value);
  return getAppImg(data.value?.id, data.value?.logo);
};
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :header="header"
    :menuList="menus"
    :options="options"
    :customSize="customSize"
  >
    <template #header-left v-if="!loading">
      <div class="flex ml-3">
        <div class="mr-2 rounded-lg overflow-hidden">
          <a-avatar shape="square" class="" :size="20" :src="headerImg()" />
        </div>
        {{ data.name }}
      </div>
    </template>
    <template v-if="!loading">
      <div
        class="w-full flex flex-col h-full xt-theme-b"
        style="overflow: hidden !important"
      >
        <xt-button @click="appCenterVisible = true">go appCenter</xt-button>
        <TTAppCenter v-if="appCenterVisible" />
        <!--
      <xt-button @click="visible = true">go oldInstall</xt-button>
      <TTApp v-if="visible" @close="visible = false" />
-->

        <WuJie v-bind="wujie" :id="customData.id" class="" />
      </div>
    </template>
  </xt-container>
</template>
<style lang="scss"></style>
