<template>
  <xt-left-menu
    :list="menuList"
    last="1"
    :end="endMenu"
    model="id"
    class="w-full"
    :class="modalClass"
    :leftClass="leftClass"
  >
    <slot></slot>

  </xt-left-menu>

  <xt-modal
    v-if="createChatVisible"
    v-model="createChatVisible"
    title="新建模板"
  >
    <CreateTopic @close="createChatVisible = false"></CreateTopic>
  </xt-modal>
  <!-- 系统设置 -->
  <xt-modal v-if="setVisible" v-model="setVisible" title="AI助手设置">
    <div
      style="width: 500px"
      :style="{
        height: aiMode == 'custom' ? '66vh' : 'auto',
      }"
    >
      <AppOpenMode />
      <!-- <xt-option-box>
        <xt-option-info title="打开方式" info="修改后再下次打开后生效。" />
        <xt-option-tab
          v-model="useMode"
          :list="openModeList"
          circle
          style="height: 40px"
          @cb="updateAiMode"
        />
      </xt-option-box> -->
      <xt-option-box style="padding-bottom: 0 !important">
        <xt-option-info
          title="选择AI助手配置"
          info="默认配置下使用天天工作台提供的免费额度，你也可以选择自定义配置。"
        />
        <xt-option-tab
          v-model="aiMode"
          :list="list"
          circle
          style="height: 40px"
          @cb="updateAiMode"
        />
      </xt-option-box>

      <Edit v-if="aiMode == 'custom'"></Edit>
    </div>
  </xt-modal>
</template>

<script setup>
import { useAppModal } from "../../../apps/appModal/src/hook/useAppModal";
const { AppOpenMode,openApp } = useAppModal("ai");
import { ref, computed, inject } from "vue";
import { storeToRefs } from "pinia";
import { aiStore } from "../../../store/ai";
import CreateTopic from "../chat/left/createTopic.vue";
import Edit from "./edit.vue";
// import { SettingFilled } from "@ant-design/icons-vue";

const {
  selectTab,
  gpt,
  temperature,
  count,
  key,
  url,
  customData,
  aiMode,
  useMode,
} = storeToRefs(aiStore());
const openModeList = ref([
  {
    name: "应用模式",
    value: "default",
  },
  {
    name: "弹窗模式",
    value: "modal",
  },
]);
// const
const list = ref([
  {
    name: "默认配置",
    value: "default",
  },
  {
    name: "自定义配置",
    value: "custom",
  },
]);
const modalStatus = inject("modalStatus");
const endMenu = computed(() => {
  return modalStatus ? 2 : 3;
});


const leftClass = computed(() => {
  if (modalStatus) {
    return "xt-main-bg py-3";
  }
});
const modalClass = computed(() => {
  if (modalStatus) {
    return "pr-3";
  }
});
const menuList = computed(() => {
  let res = [
    {
      icon: "message",
      callBack: () => {
        selectTab.value = "Chat";
      },
      name: "聊天",
    },
    {
      disabled: modalStatus,
      full: true,
    },
    {
      flag: true,
      icon: "tianjia2",
      callBack: () => {
        createChatVisible.value = true;
      },
    },
    {
      flag: true,
      icon: "setting",
      callBack: () => {
        setVisible.value = true;
      },
    },
  ];
  return res;
});

const setVisible = ref(false);
const createChatVisible = ref(false);

const updateAiMode = (data) => {
  console.log("data == aiMode.value :>> ", data, aiMode.value);

  if (data == "default") {
    if (customData.value == null) {
      customData.value = {
        gpt: gpt.value,
        temperature: temperature.value,
        count: count.value,
        key: key.value,
        url: url.value,
      };
    }
    gpt.value = "gpt-3.5-turbo";
    count.value = "4";
    temperature.value = "1";
    key.value = "sk-rtW2xHFoijpQ6v1huuJlWM8zJDHVfcpi5jtIigB4c668YeR0";
    url.value = "https://api.closeai-proxy.xyz";
  } else if (data == "custom") {
    // aiStore().resetting();
    console.log("customData.value :>> ", customData.value);

    gpt.value = customData.value?.gpt || "gpt-3.5-turbo";
    temperature.value = customData.value?.temperature || "1";
    count.value = customData.value?.count || "4";
    key.value = customData.value?.key || "";
    url.value = customData.value?.url || "";

    customData.value = null;
  }
};
</script>
<style lang="scss" scoped></style>
