<template>
  <xt-modal
    v-model="visible"
    :footer="0"
    @close="close"
    :index="index"
    :maskIndex="maskIndex"
  >
    <template #header-center>
      <xt-tab
        v-model="currentTab"
        :list="TabList"
        style="width: 248px"
        class="xt-bg-t-2 p-1"
        :boxStyle="{ 'border-radius': '10px' }"
        :edit.valueStyle="{ 'border-radius': '6px' }"
    /></template>
    <div style="height: 50vh">
      <div class="flex justify-center mb-3">
        <Icon v-bind="edit" :edit="true"></Icon>
      </div>
      <div style="width: 452px" v-if="currentTab == 'attribute'">
        <xt-option-from :options="attributeOptions" :data="edit">
          <template #custom>
            <LocalApp @click="" @onLocalApp="updateApp"></LocalApp>
          </template>
        </xt-option-from>
        <div></div>
      </div>
      <div v-else style="width: 452px">
        <xt-option-icon />1111
        <xt-option-from :options="appearanceNameOptions" :data="edit" />
        <xt-option-from :options="appearanceOptions" :data="edit" />
        <xt-option-from :options="appearanceColorOptions" :data="edit" />
      </div>
    </div>
  </xt-modal>
</template>
<script setup>
import { storeToRefs } from "pinia";
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import { myIcons } from "../../../../store/myIcons";
import Icon from "../components/icon.vue";
import LocalApp from "./LocalApp.vue";
import {
  attributeOptions,
  appearanceNameOptions,
  appearanceOptions,
  appearanceColorOptions,
} from "./options";
const { proxy } = getCurrentInstance();

const iconStore = myIcons();
const { edit } = storeToRefs(iconStore);
const emits = defineEmits(["close", "update:modelValue"]);
const props = defineProps({
  modelValue: {},
  index: {
    default: "1000",
  },
  maskIndex: {
    default: "999",
  },
});
const arr = ["internal", "default", "thinksky"];
const res = arr.includes(edit.value.open.type);
if (res) edit.value["type"] = edit.value.open.type;
edit.value["mode"] = res ? "link" : "app";
edit.value["value"] = edit.value.open.value;
console.log(edit.value["mode"]);

onMounted(() => {});
/**
 * 控制弹窗显示
 */
const visible = ref(props.modelValue);
watch(visible, (val) => {
  emits("update:modelValue", val);
});
const close = () => {
  emits("close");
};
/**
 * 控制tab
 */
const currentTab = ref("attribute");
const TabList = [
  {
    name: "属性",
    value: "attribute",
  },
  {
    name: "外观",
    value: "appearance",
  },
];

/**
 * 更新本地返回的应用数据
 */
const updateApp = (data) => {
  edit.value = {
    ...edit.value,
    titleValue: data.name,
    value: data.value,
    type: data.type,
    src: data.icon,
  };
};

/**
 * watch 类型切换清空数据
 */
watch(
  () => edit.value.mode,
  (newVal, oldVal) => {
    // edit.value.value = "";
    // if (newVal == "link") {
    //
    // }
    console.log("newVal,oldVal :>> ", newVal, oldVal);
    proxy.$xtConfirm("是否切换模式", "切换模式将清空数据，是否继续？", {
      okText: "切换",

      ok: () => {
        edit.value.value = "";
        if (newVal == "link") {
          edit.value.type = "default";
        }
      },
      no: () => {
        edit.value.mode = oldVal;
      },
      type: "warning",
    });
  }
),
  // watch(
  //   () => props.data.mode,
  //   (newVal, oldVal) => {
  //     proxy.$xtConfirm(
  //       "是否切换模式",
  //       "切换模式将清空数据，是否继续？",
  //       {
  //         okText: "切换",

  //         ok: () => {
  //           data.value.list = [];
  //         },
  //         no: () => {
  //           data.value.model = oldVal;
  //         },
  //         type: "warning",
  //       }
  //     );
  //     return;
  //   }
  // );
  onBeforeUnmount(() => {});
</script>

<style lang="scss" scoped></style>
