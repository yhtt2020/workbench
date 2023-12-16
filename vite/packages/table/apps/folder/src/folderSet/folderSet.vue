<template>
  <div>
    <xt-modal
      title="分组设置"
      v-model="setVisible"
      @close="setVisible = false"
      full
      :footer="0"
      boxClass="px-4 pt-4"
    >
      <xt-option-from :options="nameOptions" :data="data"> </xt-option-from>
      <xt-option-from :options="filesOptions" :data="data" style="width: 542px">
        <template #model>
          <xt-option-info title="分组模式" :info="modelInfo" />
        </template>
        <template #custom> <div class="mb-3">正在火速开发中</div> </template>
      </xt-option-from>
    </xt-modal>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  getCurrentInstance,
  toRefs,
} from "vue";

import { nameOptions, filesOptions } from "./options";
const { proxy } = getCurrentInstance();
const emits = defineEmits(["close", "updateSort", "updateModel",'updateWindowApp']);
const props = defineProps({
  data: {},
});
const { data } = toRefs(props);
/**
 * 分组描述
 */
const modelInfo = computed(() => {
  if (props.data.model === "observe") {
    return "“文件夹观察”支持监控文件夹的变化，当有新文件加入时，自动整理到分组。";
  } else if (props.data.model === "arrange") {
    return "桌面整理支持帮你自动整理Windows桌面。";
  } else {
    return "自定义模式支持自由选择图标进行分组管理。";
  }
});

/**
 * 图标排序
 */
const currentSelect = ref("max");
const selectList = [
  {
    name: "最多使用",
    value: "max",
  },
  {
    name: "图标类型",
    value: "type",
  },
];

watch(currentSelect, (val) => {
  emits("updateSort", val);
});

const setVisible = ref(true);
watch(setVisible, (val) => {
  emits("close", val);
});

//
watch(
  () => props.data.model,
  (newVal) => {
    const arr = ["observe", "arrange"];
    if (!arr.includes(newVal)) return;
    proxy.$xtConfirm("是否切换模式", "切换模式将会清空当前分组，是否继续？", {
      ok: () => {
        data.value.list = {};
        emits('updateWindowApp')
      },
      no: () => {
        data.value["model"] = "custom";
        // emits("updateModel", "custom");
      },
      type: "warning",
    });
  }
);
</script>

<style lang="scss" scoped></style>
