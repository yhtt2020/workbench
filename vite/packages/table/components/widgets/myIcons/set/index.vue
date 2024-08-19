<template>
  <xt-modal
    v-model="visible"
    v-if="visible"
    :footer="0"
    @close="close"
    :index="index"
    :maskIndex="maskIndex"
  >
    <template #header-right>
      <xt-button @click="save" w="60" h="32" radius="8" type="theme"
        >保存</xt-button
      >
    </template>

    <template #header-center>
      <xt-tab
        v-model="currentTab"
        :list="TabList"
        style="width: 168px"
        class="p-1 xt-bg-t-2"
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
    /></template>
    <div style="height: 50vh">
      <div style="width: 452px" v-if="currentTab == 'attribute'">
        <xt-option-box v-if="edit.open.type == 'systemApp'">
          <xt-text class="mb-3" center> 当前图标为「系统功能」类型。 </xt-text>
        </xt-option-box>
        <template v-else>
          <xt-option-form :options="attributeOptions" :data="edit">
            <template #custom>
              <div @click="openLocalApp()">
                <xt-option-input
                  v-model:input="edit.value"
                  readonly
                  v-if="edit.value"
                />
              </div>
              <div v-show="!edit.value">
                <LocalApp ref="localApp"  @onLocalApp="updateApp" />
              </div>
            </template>
            <template #mode>
              <xt-option-tab
                v-model="mode"
                :list="modeList"
                circle
                style="height: 40px"
              />
            </template>
          </xt-option-form>
        </template>
      </div>
      <div v-else style="width: 452px">
        <div @click="showUpload" class="flex justify-center mb-3" style="zoom: 0.8">
          <Icon @onEdit="showUpload"  v-bind="edit" :edit="true"></Icon>
        </div>
        <div class="p-4 mb-4 xt-bg-2 rounded-xl">
          <xt-option-info
            title="图标和名称"
            info="支持自定义图标和名称。"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="refreshIcon"
          />
          <xt-option-icon ref="iconRef"
            v-model:icon="edit.src"
            v-model:input="edit.titleValue"
          />
        </div>
        <!-- systemApp -->
        <Form :options="appearanceNameOptions" :data="edit" />
        <Form :options="appearanceOptions" :data="edit" />
        <Form :options="appearanceColorOptions" :data="edit" />
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";

import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  defineAsyncComponent,
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
import { getHostAddress } from "../edit/hooks/getHostAddress";

// 手动引入通用表单组件
const Form = defineAsyncComponent(() =>
  import("../../../../ui/new/optionForm/src/Form.vue")
);
const iconRef=ref()
const { proxy } = getCurrentInstance();
const showUpload=()=>{
  iconRef.value.showUpload()
}
const modeList = computed(() => {
  let res = [
    {
      name: "网站链接",
      value: "link",
    },
  ];
  if (window.$usePlat("client")) {
    res.push({
      name: "系统程序或文件",
      value: "app",
    });
  }
  return res;
});
const iconStore = myIcons();
const { edit } = storeToRefs(iconStore);
const emits = defineEmits(["close", "update:modelValue", "save"]);
const props = defineProps({
  modelValue: {},
  index: {
    default: "1000",
  },
  maskIndex: {
    default: "999",
  },
});
const arr = ["internal", "default", "thinksky", "mob"];
const res = arr.includes(edit.value.open.type);
edit.value.type = edit.value.open.type;

edit.value["mode"] = res ? "link" : "app";
edit.value["value"] = edit.value.open.value;
if (!edit.value["defaultIcon"]) {
  edit.value["defaultIcon"] = edit.value.src;
}
console.log(edit.value["mode"]);

{
}

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

const mode = ref(edit.value.mode);
/**
 * watch 类型切换清空数据
 */
watch(
  () => mode.value,
  (newVal, oldVal) => {
    console.log("newVal,oldVal :>> ", newVal, oldVal);
    window.$ui.confirm("是否切换模式", "切换模式将清空数据，是否继续？", {
      okText: "切换",

      ok: () => {
        edit.value.value = "";
        if (newVal == "link") {
          edit.value.type = "default";
          edit.value.mode = "link";
        }
        if (newVal === "app") {
          edit.value.mode = "app";
          edit.value.src =
            "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn";
        }
      },
      no: () => {
        edit.value.mode = oldVal;
        mode.value = oldVal;
      },
      type: "warning",
    });
  }
),
  onBeforeUnmount(() => {});

// 监听图标路径
watch(
  () => edit.value.value,
  (newV, oldV) => {
    if (newV && edit.value.mode == "link") {
      edit.value.src = getHostAddress(edit.value.value) + "/favicon.ico";
      edit.value.open.value = newV;
    }
  }
);

// 监听图标打开方式
watch(
  () => edit.value.type,
  (newV, oldV) => {
    edit.value.open.type = newV;
    console.log(newV, edit.value.open.type);
  }
);
/**
 * 恢复默认图标
 */
const refreshIcon = () => {
  if (edit.value["defaultIcon"]) {
    edit.value.src = edit.value["defaultIcon"];
  }
};
/**
 * 保存数据
 */
const save = () => {
  console.log(" edit.value :>> ", edit.value);
  emits("save", edit.value);
  // fileSetVisible
  message.success("保存成功");
  visible.value = false;
};

const localApp = ref(null);
const openLocalApp = () => {
  console.log("localApp.value :>> ", localApp.value);

  localApp.value.localAppClick();
};
</script>

<style lang="scss" scoped></style>
