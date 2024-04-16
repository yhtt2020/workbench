<script setup lang="ts">
// import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed, onUnmounted, nextTick } from "vue";
import { useParserCard } from "./parser";
import WuJie from "../wujie/WuJie.vue";
import { useTTAppStore } from "../../store";
import { storeToRefs } from "pinia";
import { useCardSize } from "../../../../../hooks";
import { useWuJieStore } from "../wujie/store";
const wujieStore = useWuJieStore();
const { data: wujieData }: any = storeToRefs(wujieStore);

const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
const loading = ref(true);
// 卡片头部
const cardHeader: any = ref({});
const size = ref();
const sizeList = ref();
const data = ref();
// 卡片状态 无数据、加载中、正常 对应的值分别为 noData、loading、normal
const status = ref("loading");
const id = ref();
onMounted(async () => {
  loading.value = false;
  // 无数据情况

  if (!props.customData?.parentId) return;
  // 双ID
  console.log("props.customData?.parentId :>> ", props.customData?.parentId);
  console.log("props.customData?.id :>> ", props.customData?.id);
  id.value = props.customData.id;
  // 查询数据
  let res = ttappStore.select(props.customData.parentId);
  console.log("props.customData :>> ", props.customData);
  if (!res) return;
  // 解析数据
  let options = useParserCard(res);
  data.value = res;

  cardHeader.value = options.header;
  let currentSize: any = useCardSize(props.customData.size);

  if (props.customData.sizeList) {
    sizeList.value = props.customData.sizeList.map((item: any) => {
      return {
        value: item,
        name: item,
      };
    });
  }
  size.value = {
    width: currentSize.width + "px",
    height: currentSize.height + "px",
  };
  loading.value = false;
  nextTick(() => {
    perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {
      wheelPropagation: false,
    });
  });
});
const props = defineProps({
  customIndex: {},
  customData: {
    type: Object,
    required: true,
  },
});

const options = ref({
  // bg: "pink",
  resize: props.customData?.resize,
});
const refreshFn = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1);
};
const refresh = ref({
  fn: refreshFn,
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
      title: "打开主应用",
      fn: () => {
        modal.value.id = data.value.id;
        modal.value.visible = true;
      },
    },
    {
      newIcon: "fluent:open-16-regular",
      title: "清空缓存",
      fn: () => {
        wujieData.value[props.customData.id] = {};
        refreshFn();
      },
    },
  ];
  return list;
});

import PerfectScrollbar from "perfect-scrollbar";
const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);

const resize = () => {
  // perfectScrollbar.value.update();
  // scrollbar.value.scrollTop += 1;
  // perfectScrollbar.value.update();
};
onUnmounted(() => {
  perfectScrollbar.value?.destroy();
  perfectScrollbar.value = null;
});
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :header="header"
    :menuList="menus"
    :options="options"
    v-model:customSize="customData.size"
    :sizeList="sizeList"
    @resize="resize"
    v-if="data"
  >
    <template #header-left v-if="!loading">
      <div class="flex ml-3">
        <div class="mr-2 rounded-lg overflow-hidden">
          <a-avatar shape="square" class="" :size="20" :src="data?._logo" />
        </div>
        {{ data?.name }}
      </div>
    </template>
    <div
      class="relative w-full h-full overflow-hidden"
      ref="scrollbar"
      style="overflow: hidden !important"
    >
      <WuJie
        v-if="!loading"
        :url="customData._entry"
        :name="customData.id"
        :key="customData.parentId"
      />
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
