<script setup lang="ts">
import dbStorage from "../../../../../store/dbStorage";
import { ref, onMounted, computed } from "vue";
import TTApp from "../../ttApp";
import { useParserCard } from "../../parser";
import { useSelect } from "../../hooks";
import WuJie from "../wujie/WuJie.vue";
const loading = ref(true);
const cardHeader: any = ref({});
const customSize = ref("8x8");
const wujie: any = ref({});
onMounted(async () => {
  loading.value = false;
  if (!props.customData?.id) return;
  // 查询数据
  let res = await useSelect(props.customData.id);
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
      <!-- <TTApp v-if="visible" @close="visible = false" />
      <xt-button @click="visible = true">打开控制中心</xt-button> -->
      <template v-if="!loading">
        <WuJie v-bind="wujie" />
      </template>
    </div>
  </xt-container>
</template>
<style lang="scss"></style>
