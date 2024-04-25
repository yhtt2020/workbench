<script setup lang="ts">
// import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed, onUnmounted, nextTick } from "vue";
import { useParserCard } from "./parser";
import WuJie from "../wujie/WuJie.vue";
import { useTTAppStore } from "../../store";
import { mapActions, storeToRefs } from "pinia";
import { useCardSize } from "../../../../../hooks";
import { useWuJieStore } from "../wujie/store";
import PerfectScrollbar from "perfect-scrollbar";
import { appsStore as useAppStore } from "../../../../../store/apps";
const appsStore: any = useAppStore();
const scrollbar: any = ref(null);
const perfectScrollbar: any = ref(null);

const wujieStore = useWuJieStore();
const { data: wujieData }: any = storeToRefs(wujieStore);

const ttappStore: any = useTTAppStore();
const { modal } = storeToRefs(ttappStore);
const loading = ref(true);
// 卡片头部
const cardHeader: any = ref({});
const sizeList = ref();
const data = ref();
// 卡片状态 无数据、加载中、正常 对应的值分别为 noData、loading、normal

const id = ref();
onMounted(async () => {
  loading.value = false;
  // 无数据情况

  if (!props.customData?.parentId) return;
  id.value = props.customData.id;
  // 查询数据
  let res = ttappStore.select(props.customData.parentId);
  data.value = res;
  console.log("props.customData :>> ", props.customData);
  if (!res) return;
  // 解析数据
  let options = useParserCard(res);
  cardHeader.value = options.header;
  let currentSize: any = useCardSize(props.customData.customSize);
  // size.value = {
  //   width: currentSize.width + "px",
  //   height: currentSize.height + "px",
  // };

  if (props.customData.sizeList) {
    sizeList.value = props.customData.sizeList.map((item: any) => {
      return {
        value: item,
        name: item,
      };
    });
  }

  loading.value = false;
  // 是否加载滚动条
  nextTick(() => {
    const scroll = props.customData.scroll;
    if (scroll === false) return;
    perfectScrollbar.value = new PerfectScrollbar(scrollbar.value, {
      wheelPropagation: false,
    });
  });
  injectProps.value.api=await ttappStore.injectApi(data.value.id)
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
        ttappStore.enterApp(data.value.id)
      },
    },
    {
      newIcon: "fluent:window-16-regular",
      title: "弹窗打开",
      fn: () => {
        modal.value.id = data.value.id;
        modal.value.url = "ttapp://" + data.value.id + props.customData.entry;
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
        wujieData.value[data.value.id] = {};
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
  perfectScrollbar.value?.destroy();
  perfectScrollbar.value = null;
});


const injectProps=ref({})

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
        :props="injectProps"
        :url="customData._entry"
        :id="customData.parentId"
        :app-info="data"
      />
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
