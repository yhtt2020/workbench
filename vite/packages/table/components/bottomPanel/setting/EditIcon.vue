<template>
  <xt-modal v-model="visible" :footer="0" @close="close" :index="index" :maskIndex="900">
    <template #header-right>
      <xt-button @click="save" w="60" h="32" radius="8" type="theme">保存</xt-button>
    </template>

    <template #header-center>
      <xt-tab v-model="currentTab" :list="TabList" style="width: 168px" 
       class="p-1 xt-bg-t-2"
       :boxStyle="{ 'border-radius': '10px' }" :itemStyle="{ 'border-radius': '6px' }"
      />
    </template>

    <div style="height:auto;">
      <div style="width: 452px" class="flex flex-col">
        <!-- 属性 -->
        <template v-if="currentTab == 'attribute'">
          <div class="flex justify-center mb-3" style="zoom: 0.8" v-if="!isSystem">
            <Icon v-if="visible" v-bind="edit" :edit="true"></Icon>
          </div>

          <div class="flex flex-col items-center justify-center w-full mb-3 rounded-xl xt-bg-2 p-4" v-else>
            <span class="xt-text font-16 xt-font">
              当前图标为「系统功能」类型。
            </span>
          </div>

          <template v-if="!isSystem">
            <div class="flex flex-col w-full rounded-xl xt-bg-2 p-4">
              <span class="xt-text font-16 xt-font">图标链接</span>
              <template v-if="edit.type === 'default'">
                <a-input :spellcheck="false"  style="width: 100%; border-radius: 8px; margin: 12px 0"
                 class="xt-bg" allowClear v-model:value="edit.url"
                />
              </template>

              <template v-else>
                <a-input :spellcheck="false"  style="width: 100%; border-radius: 8px; margin: 12px 0"
                 class="xt-bg" allowClear v-model:value="edit.path" 
                /> 
                <LocalApp @onLocalApp="updateApp"></LocalApp>
              </template> 
            </div>
          </template>
        </template>

        <template v-else>
          <div class="flex justify-center mb-3" style="zoom: 0.8" >
            <Icon v-if="visible" v-bind="edit" :edit="true"></Icon>
          </div>
          <div class="p-4 mb-4 xt-bg-2 rounded-xl">
            <xt-option-info title="图标和名称" info="支持自定图标和名称。" icon="fluent:arrow-clockwise-16-regular"
              @onIconClick="refreshIcon" />
            <xt-option-icon v-model:icon="edit.src" v-model:input="edit.titleValue" />
          </div>
          <xt-option-from :options="appearanceColorOptions" :data="edit" />
        </template>
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
  defineAsyncComponent,
  toRefs,
  nextTick
} from "vue";
import { storeToRefs } from "pinia";
import { myIcons } from "../../../store/myIcons";

const Icon = defineAsyncComponent(() => import("../../widgets/myIcons/components/icon.vue"));
import LocalApp from "../../widgets/myIcons/set/LocalApp.vue";
import { appearanceColorOptions, } from "../../widgets/myIcons/set/options";

const props = defineProps({
  modelValue: {},
  index: {
    default: "910",
  },
});
const { modelValue } = toRefs(props);

// 控制弹窗显示
const visible = ref(false);
// 控制头部tab
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
const edit = ref({});
const appearanceData = ref({})

// 是否为系统应用
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
      ...modelValue.value
    }
    edit.value = {
      src:modelValue.value.icon,
      titleValue:modelValue.value.name,
      isReSize:true,
      value:modelValue.value.name,
      url:modelValue.value.url,
      path:modelValue.value.path,
      type:modelValue.value.type,
      backgroundColor:modelValue.value.bg,
      isBackground:modelValue.value.isBg,
    };
    appearanceData.value = {
      ...modelValue.value
    };
  });
};
// 本地应用更新
const updateApp = (data) =>{
  edit.value = {
    ...edit.value,
    src:data.icon,
    titleValue:data.name,
    path:data.value,
    type:data.type
  } 
};
// 保存更新的数据
const save = () =>{
  if(currentTab.value === 'attribute'){
    modelValue.value.name = edit.value.titleValue;
    modelValue.value.url = edit.value.url;
    modelValue.value.path = edit.value.path;
    modelValue.value.value = edit.value.url || edit.value.path;
    visible.value = false;
  }
  else {
    modelValue.value.name = edit.value.titleValue;
    modelValue.value.icon = edit.value.src;
    modelValue.value.bg = edit.value?.backgroundColor;
    modelValue.value.isBg = edit.value?.isBackground;
    visible.value = false;
  }
};
// 重置刷新
const refreshIcon = () =>{
  edit.value.src = modelValue.value?.default?.icon;
  edit.value.titleValue = modelValue.value?.default?.name,
  edit.value. isReSize = true,
  edit.value.value = modelValue.value?.default?.name,
  edit.value.url= modelValue.value?.default?.url,
  edit.value.bg=modelValue.value?.default?.bg,
  edit.value.isBg=modelValue.value?.default?.isBg
}

defineExpose({
  openEditIcon,
});
</script>

<style lang="scss" scoped>

</style>