<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onUnmounted,
  nextTick,
  getCurrentInstance,
} from "vue";
import { useParserCard } from "./parser";
import WuJie from "../wujie/WuJie.vue";
import { useTTAppStore } from "../../store";
import { mapActions, storeToRefs } from "pinia";
import { useCardSize } from "../../../../../hooks";
import { useWuJieStore } from "../wujie/store";
import PerfectScrollbar from "perfect-scrollbar";
import { appsStore as useAppStore } from "../../../../../store/apps";

const { proxy }: any = getCurrentInstance();

const appsStore: any = useAppStore();
const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);

const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
const loading = ref(true);
// 卡片头部
const cardHeader: any = ref({});
const sizeList = ref();
const data = ref();
// 卡片状态 无数据、加载中、正常 对应的值分别为 noData、loading、normal
/** 卡片数据初始化 */
const init = () => {
  data.value = false;
  // 开始加载
  loading.value = true;
  // 存储ID
  if (!props.customData?.parentId) return;
  // 查询数据
  let res = ttappStore.select(props.customData.parentId);
  if (!res) return;

  console.log("res :>> ", res);
  data.value = res;
  // 解析数据
  let options = useParserCard(res);
  cardHeader.value = options.header;

  if (props.customData.sizeList) {
    sizeList.value = props.customData.sizeList.map((item: any) => {
      return {
        value: item,
        name: item,
      };
    });
  }
  // 加载完成
  loading.value = false;
};

onMounted(async () => {
  proxy.$bus.on("updateTTApp", (id: string) => {
    const parentId = props.customData?.parentId;
    // 非自己更新无需操作
    if (parentId != id) {
      return;
    }

    console.log("updateTTApp id :>> ", id);
    init();
  });
  init();

  // 是否加载滚动条
  nextTick(() => {
    const scroll = props.customData.scroll;
    if (scroll === false) return;
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
      title: "进入主应用",
      fn: () => {
        ttappStore.enterApp(data.value.id);
      },
    },
    {
      newIcon: "fluent:window-16-regular",
      title: "弹窗打开",
      fn: () => {
        modal.value.id = data.value.id;
        // modal.value.url = "ttapp://" + data.value.id + props.customData.entry;
        modal.value.url = props.customData._entry;
        modal.value.visible = true;
      },
    },
    {
      title: "设置",
      newIcon: "fluent:settings-16-regular",
    },
    {
      newIcon: "fluent:open-16-regular",
      title: "清空缓存",
      fn: () => {
        ttappStore.clearData(data.value.parentId);
        refreshFn();
      },
    },
  ];
  return list;
});

const container = ref({
  // 头部
  header: header.value,
  // 右键菜单
  menus: menus.value,
  // 配置对象
  options: options.value,
  // 卡片尺寸
});

const resize = () => {
  // perfectScrollbar.value.update();
  // scrollbar.value.scrollTop += 1;
  // perfectScrollbar.value.update();
};
onUnmounted(() => {
  proxy.$bus.off("updateTTApp");
  perfectScrollbar.value?.destroy();
  perfectScrollbar.value = null;
});
</script>

<template>
  <xt-container
    :customIndex="customIndex"
    :customData="customData"
    :header="container.header"
    :menuList="container.menus"
    :options="container.options"
    :sizeList="sizeList"
    @resize="resize"
    v-model:customSize="customData.customSize"
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
        v-model:cardConfig="cardContainer"
        :url="customData._entry"
        :id="customData.parentId"
        :app-info="data"
      />
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
