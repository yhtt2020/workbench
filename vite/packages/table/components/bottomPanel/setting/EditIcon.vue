<template>
  <xt-modal
    v-model="visible"
    :footer="0"
    @close="close"
    :index="index"
    :maskIndex="maskIndex"
  >
    <!-- 右侧头部 -->
    <template #header-right>
      <xt-button @click="save" w="60" h="32" radius="8" type="theme">
        保存
      </xt-button>
    </template>
    <!-- 头部居中 -->
    <template #header-center>
      <xt-tab
        v-model="currentTab"
        :list="TabList"
        style="width: 168px"
        class="p-1 xt-bg-t-2"
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
      />
    </template>
    
    <div class="h-2/3">
      <div class="flex justify-center mb-3">
        <template v-if="currentTab == 'attribute'">
          <!-- 系统应用 -->
          <div
            class="flex items-center flex-col py-3 justify-center w-full icon-hover pointer"
            style="width: 135px"
            v-if="!isSystem"
          >
            <a-avatar :src="currentIcon" :size="64" shape="square"></a-avatar>
            <span
              class="xt-text-2 xt-font font-14 mt-2 truncate"
              style="max-width: 100px"
              >{{ modelValue.name }}</span
            >
          </div>
          <!-- 非系统应用 -->
          <div
            class="flex flex-col items-center justify-center w-full rounded-xl xt-bg-2 p-4"
            v-else
          >
            <span class="xt-text font-16 xt-font"
              >当前图标为「系统功能」类型。</span
            >
          </div>
        </template>
        <template v-else>
          <div
            class="flex items-center flex-col py-3 justify-center w-full icon-hover pointer"
            style="width: 135px"
          >
            <a-avatar :src="currentIcon" :size="64" shape="square"></a-avatar>
            <span
              class="xt-text-2 xt-font font-14 mt-2 truncate"
              style="max-width: 100px"
              >{{ modelValue.name }}</span
            >
          </div>
        </template>
      </div>
      <div
        style="width: 452px"
        class="flex flex-col"
        v-if="currentTab == 'attribute'"
      >
        <div
          class="flex flex-col w-full rounded-xl xt-bg-2 p-4"
          v-if="!isSystem"
        >
          <span class="xt-text font-16 xt-font">图标链接</span>
          <a-input
            style="width: 100%; border-radius: 8px; margin: 12px 0"
            class="xt-bg"
            allowClear
            v-model:value="customUrl"
          ></a-input>
          <LocalApp @onLocalApp="updateApp"></LocalApp>
        </div>

        <div class="flex flex-col w-full rounded-xl xt-bg-2 p-4" v-else>
          <xt-option-info
            title="图标和名称"
            info="修改当前引用图标名称"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="refreshName"
          />
          <a-input
            style="width: 100%; border-radius: 8px;"
            class="xt-bg"
            allowClear
            v-model:value="customName"
          ></a-input>
        </div>
      </div>
      <div v-else style="width: 452px">
        <div class="p-4 mb-4 xt-bg-2 rounded-xl">
          <xt-option-info
            title="图标和名称"
            info="支持自定图标和名称。"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="refreshIcon"
          />
          <xt-option-icon
            v-model:icon="currentIcon"
            v-model:input="customName"
          />
        </div>
      </div>
    </div>
  </xt-modal>
</template>
<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  toRefs,
  nextTick,
} from "vue";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";

import LocalApp from "../../widgets/myIcons/set/LocalApp.vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  modelValue: {},
  index: {
    default: "1000",
  },
  maskIndex: {
    default: "999",
  },
});

const { modelValue } = toRefs(props);

const visible = ref(false);
const customName = ref("");
const currentIcon = ref("");
const customUrl = ref("");

// 控制tab
const currentTab = ref("attribute");
const TabList = ref([
  {
    name: "属性",
    value: "attribute",
  },
  {
    name: "外观",
    value: "appearance",
  },
]);

// 判断是否为系统应用
const isSystem = computed(() => {
  if (modelValue.value.type === "systemApp") {
    return true;
  } else {
    return false;
  }
});

// 打开编辑弹窗
const openEditIcon = () => {
  visible.value = true;
  nextTick(() => {
    modelValue.value.default = {
      icon: modelValue.value.icon,
      name: modelValue.value.name,
      url: modelValue.value.url ? modelValue.value.url : "",
    };
    customName.value = modelValue.value.name;
    currentIcon.value = modelValue.value.icon;
    customUrl.value = modelValue.value.url;
  });
};

// 刷新重置
const refreshIcon = () => {
  if (Object.keys(modelValue.value.default).length !== 0) {
    customName.value = modelValue.value?.default?.name;
    customUrl.value = modelValue.value?.default?.url;
    currentIcon.value = modelValue.value?.default?.icon;
  }
};
const refreshName = () => {
  if (Object.keys(modelValue.value.default).length !== 0) {
    customName.value = modelValue.value?.default?.name;
  }
};

// 保存
const save = () => {
  if (currentTab.value === "attribute") {
    modelValue.value.name = customName.value;
  } else {
    modelValue.value.name = customName.value;
    modelValue.value.icon = currentIcon.value;
  }
  visible.value = false;
};

// 更新app
const updateApp = (data) => {
  console.log("更新", data);
};

onMounted(() => {
  nextTick(() => {});
});

defineExpose({
  openEditIcon,
});
</script>
<style lang="scss" scoped>
.icon-hover {
  &:hover {
    background: var(--secondary-bg);
    border-radius: 12px;
  }
}
</style> 