<script setup lang="ts">
import {
  ref,
  computed,
  inject,
  watch,
  provide,
  onMounted,
  reactive,
} from "vue";
import { useEventListener, useDebounce } from "@vueuse/core";
import History from "./History.vue";
import { sourceList, openWithList } from "../../config/data";
import axios from "axios";

const data: any = inject("data");
const customData = reactive(data.value);
const emit = defineEmits(["close", "update:source"]);
const props: any = defineProps({
  specifySource: {},
});
/** 搜索数据 */
const words = ref("");
// 打开方式下标
const openWithIndex = ref(0);
/** 搜索源下标 */
const sourceIndex = ref(0);
/** 当前打开方式 */
const currentOpenWith: any = ref();
/** 当前搜索源 */
const currentSource = ref();
/** 初始化当前搜索源 */
const initCurrentSource = () => {
  let source;
  // 有指定搜索源
  if (props.specifySource) {
    source = props.specifySource;
  }
  // 有记录
  else if (data.value?.lastUse) {
    source = data.value.source;
  }
  // 默认
  else {
    source = data.value.sourceList[0];
  }
  sourceIndex.value = sourceList.findIndex((item) => item.name === source.name);

  currentSource.value = source;
};
/** 初始化打开方式 */
const initOpenWith = () => {
  openWithIndex.value = openWithList.findIndex(
    (item) => item.value === data.value.openWith
  );
  currentOpenWith.value = openWithList[openWithIndex.value];
};
initCurrentSource();
initOpenWith();

const search: any = async () => {
  const history = {
    value: words.value,
    source: currentSource.value,
  };

  data.value.historyList.push(history);
};
const getRecommend = async () => {
  // 空数据
  if (!words.value.trim()) {
    return;
  }
  // 搜索源不符合
  const name = currentSource.value.name;
  if (name === "文件夹" || name === "工作台") {
    return;
  }
  if (data.value?.lastUse) {
    // emit("update:openWith", currentOpenWith.value);
    // emit("update:source", currentSource.value);
    data.value.source = currentSource.value;
    data.value.openWith = currentOpenWith.value.value;
  }
  const searchUrl =
    currentSource.value.searchUrl + encodeURIComponent(words.value);
  let res = await axios.get(searchUrl);

  if (name == "百度") {
  }
  console.log("res :>> ", res);
};
const debounceWord = useDebounce(words, 500);
const debounceSource = useDebounce(currentSource, 500);

watch([debounceWord, debounceSource], async (val) => {
  await getRecommend();
});

const searchValueChange = (data) => {
  console.log("data :>> ", data);
};
/** 打开方式选择 */
const selectOpenWith = (index) => {
  currentOpenWith.value = openWithList[index];
};

/** 搜索源选择 */
const selectSource = (newSource) => {
  currentSource.value = newSource;
};
</script>

<template>

</template>
<style lang="scss" scoped></style>
