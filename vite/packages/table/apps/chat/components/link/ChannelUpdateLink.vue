<!-- 社群子频道 链接修改 -->
<script setup>
import { nextTick, ref, toRefs } from "vue";

import DropDown from "../../../../components/desk/navigationBar/components/dropDown/DropDown.vue";

const props = defineProps({
  currentLink: {
    type: Object,
    default: () => {},
  },
});
const { currentLink } = toRefs(props);

/**ref数据定义**/
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
// 当前链接数据
const currentItemLink = ref({
  web: "",
  name: "",
  url: "",
  header: "https",
});
const linkHeader = ref([
  {
    name: "https",
    value: "https",
  },
  { name: "http", value: "http" },
]);

const updateLinkUrlRef = ref(null);
const updateLinkNameRef = ref(null);

const updateLinkVisible = ref(false);
const openUpdateLink = () => {
  updateLinkVisible.value = true;
  nextTick(() => {
    updateLinkNameRef.value.select();
    const data = currentLink.value.props;
    currentItemLink.value.name = data.name;
    currentItemLink.value.url = data.url;
  });
};

// 确定更新
const selectNext = () => {
  console.log('更新-1',currentItemLink.value);
  console.log('更新-2',mode.value);
  
};

defineExpose({
  openUpdateLink,
});
</script>

<template>
  <xt-modal
    v-if="updateLinkVisible"
    v-model="updateLinkVisible"
    title="自定义网页链接"
    @close="updateLinkVisible = false"
  >
    <div class="flex flex-col p-4" style="width: 500px">
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
          class="h-10 xt-bg-2"
          v-model:value="currentItemLink.name"
          ref="updateLinkNameRef"
          spellcheck="false"
          style="border-radius: 8px; margin-bottom: 12px"
          placeholder="链接名称"
        />

        <div
          class="flex items-center justify-center w-full rounded-lg"
          style="border: 1px solid var(--divider)"
        >
          <xt-select
            :list="linkHeader"
            v-model="currentItemLink.header"
            style="width: 20%"
            :borderClass="'rounded-tl-lg rounded-bl-lg'"
            :zIndex="99999999"
            :border="false"
          />
          <a-input
            v-model:value="currentItemLink.url"
            ref="updateLinkUrlRef"
            placeholder="请输入"
            spellcheck="false"
            style="
              width: 80%;
              height: 40px !important;
              border-top-right-radius: 8px;
              border-bottom-right-radius: 8px;
            "
            :bordered="false"
            class="xt-bg-2"
          />
        </div>

        <!-- <a-input-group compact style="z-index: 100001 !important;">
          <a-select
            v-model:value="currentItemLink.header"
            style="
              width: 20%;
              height: 40px !important;
            "
          >
            <a-select-option value="https"> https </a-select-option>
            <a-select-option value="http"> http </a-select-option>
          </a-select>
          <a-input
            v-model:value="currentItemLink.url"
            ref="updateLinkUrlRef"
            placeholder="请输入"
            spellcheck="false"
            style="
              width: 80%;
              height: 40px !important;
              border-top-right-radius: 8px !important;
              border-bottom-right-radius: 8px;
            "
          />
        </a-input-group> -->

        <span class="my-4 font-16 xt-font xt-text"> 链接打开方式 </span>

        <xt-option-tab
          :list="openType"
          v-model="defaultType"
          circle
          style="height: 40px"
        />

        <template v-if="defaultType === 'outer'">
          <DropDown :list="linkType" v-model:mode="mode" />
        </template>
      </div>

      <div class="flex items-center justify-end mb-3">
        <xt-button
          w="64"
          h="40"
          class="mr-3 category-button"
          @click="updateLinkVisible = false"
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
          确定
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
}
:deep(.ant-select-selection-item) {
  line-height: 40px !important;
}
:deep(.ant-select) {
  z-index: 100001 !important;
}
:deep(.rounded-xl) {
  border-radius: 0 8px 0 8px !important;
}
</style>