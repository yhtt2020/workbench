<!-- 频道链接添加 具备频道分类添加选择 -->
<script setup>
import { ref, toRefs } from "vue";

import Dropdown from "../../../../components/desk/navigationBar/components/dropDown/DropDown.vue";

const emit = defineEmits(["prev"]);

const props = defineProps({
  title: {
    type: String,
    default: "选择",
  },
});
const { title } = toRefs(props);

const openType = ref([
  { name: "当前页面直接打开", value: "current", openMethod: "currentPage" },
  { name: "外部跳转打开", value: "outer", openMethod: "outerOpen" },
]);
// 默认类型
const defaultType = ref("current");
// 默浏览器打开方式
const mode = ref("systemSelect");
// 浏览器打开方式列表
const linkType = ref([
  {
    icon: "mingcute:windows-line",
    name: "系统默认浏览器",
    value: "systemSelect",
    info: "使用Windows系统默认浏览器打开",
  },
  {
    icon: "fluent:globe-16-regular",
    name: "工作台内置浏览器",
    value: "userSelect",
    info: "在工作台内直接打开，不会跳转到外部应用软件。",
  },
  {
    icon: "fluent:globe-16-regular",
    name: "想天浏览器",
    value: "thinksky",
    info: "使用想天浏览器打开",
  },
  {
    icon: "fluent:phone-16-regular",
    name: "手机模式",
    value: "mob",
    info: "使用想天浏览器内置的「手机模式」打开，可以模拟手机端的浏览状态。",
  },
]);
// 链接数据
const currentLink = ref({
  web: "",
  name: "",
  url: "",
  header: "https",
});
// 开启链接弹窗
const linkVisible = ref(false);
const openLinkModal = () => {
  linkVisible.value = true;
};
// 选择下一步
const selectNext = () => {
  const pattern = /^(https?|http):\/\//;
  const currentResult = {};
  // 存在https、http
  if (pattern.test(currentLink.value.url)) {
    // 当前打开
    if (defaultType.value === "current") {
      currentResult.name = currentLink.value.name;
      currentResult.url = currentLink.value.url;
      currentResult.openMethod = "currentPage";
    }
    // 非当前打开
    else {
      currentResult.name = currentLink.value.name;
      currentResult.url = currentLink.value.url;
      currentResult.openMethod = mode.value;
    }
  }
  // 不存在https、http
  else {
    // 当前打开
    if (defaultType.value === "current") {
      currentResult.name = currentLink.value.name;
      currentResult.url = `${currentLink.value.header}://${currentLink.value.url}`;
      currentResult.openMethod = "currentPage";
    }
    // 非当前打开
    else {
      currentResult.name = currentLink.value.name;
      currentResult.url = `${currentLink.value.header}://${currentLink.value.url}`;
      currentResult.openMethod = mode.value;
    }
  }
  emit("next", currentResult);
  clearLink();
};
// 返回上一步
const returnPreviousStep = () => {
  linkVisible.value = false;
  emit("prev");
};

const clearLink = () => {
  currentLink.value.url = "";
  currentLink.value.name = "";
  linkVisible.value = false;
};

defineExpose({
  openLinkModal,
});
</script>

<template>
  <xt-modal v-if="linkVisible" v-model="linkVisible" custom>
    <div class="flex flex-col p-4" style="width: 500px">
      <div class="w-full flex items-center justify-between mb-4">
        <xt-button
          w="32"
          h="32"
          @click="returnPreviousStep"
          style="border-radius: 8px"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">自定义网页链接</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="linkVisible = false"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              class="xt-text"
              size="20"
            />
          </div>
        </xt-button>
      </div>

      <div class="flex flex-col px-2">
        <div class="flex flex-col p-4 mb-4 rounded-lg xt-bg-2">
          <span class="font-16 mb-2.5 xt-text xt-font"> 操作指南 </span>
          <span class="font-14 xt-text-2 xt-font">
            输入带有“https://”或“http://”前缀的，完整的网页地址。支持选择点击链接后的打开方式，默认使用工作台设置。
          </span>
          <span class="font-14 xt-text-2 xt-font">
            添加网址后,如遇到网页打开无法显示,是该网页路径的安全策略问题导致无法正常显示,则需要通过系统浏览器进行打开。
          </span>
        </div>

        <!-- 链接名称输入框 -->
        <a-input
          class="h-10"
          v-model:value="currentLink.name"
          ref="linkNameRef"
          spellcheck="false"
          style="border-radius: 8px; margin-bottom: 12px"
          placeholder="链接名称"
        />

        <a-input-group compact>
          <a-select
            v-model:value="currentLink.header"
            style="
              width: 20%;
              height: 40px !important;
              z-index: 99999999 !important;
            "
          >
            <a-select-option value="https"> https </a-select-option>
            <a-select-option value="http"> http </a-select-option>
          </a-select>
          <a-input
            v-model:value="currentLink.url"
            ref="linkRef"
            placeholder="请输入"
            spellcheck="false"
            style="
              width: 80%;
              height: 40px !important;
              border-top-right-radius: 8px !important;
              border-bottom-right-radius: 8px;
            "
          />
        </a-input-group>

        <span class="my-4 font-16 xt-font xt-text"> 链接打开方式 </span>

        <xt-option-tab
          :list="openType"
          v-model="defaultType"
          circle
          style="height: 40px"
        />

        <template v-if="defaultType === 'outer'">
          <Dropdown :list="linkType" v-model:mode="mode" />
        </template>
      </div>

      <div class="flex items-center justify-end mb-3">
        <xt-button
          w="64"
          h="40"
          class="mr-3 category-button"
          @click="linkVisible = false"
        >
          取消
        </xt-button>
        <xt-button
          w="64"
          h="40"
          type="theme"
          class="category-button"
          @click="selectNext"
        >
          {{ title }}
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<style lang="scss" scoped>
:deep(.ant-input) {
  color: var(--secondary-text) !important;
  font-size: 1.15em;
  &::placeholder {
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-select .ant-select-selector) {
  height: 40px !important;
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}
:deep(.ant-select-selection-item) {
  line-height: 40px !important;
}
:deep(.ant-select) {
  z-index: 1000000000 !important;
}
</style>