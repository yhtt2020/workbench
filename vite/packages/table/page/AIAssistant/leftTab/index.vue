<template>
  <xt-left-menu
    :list="menuList"
    last="1"
    end="3"
    model="id"
    class="w-full"
    style="min-height: 752px; min-width: 1000px"
  >
    <slot></slot>
  </xt-left-menu>

  <xt-old-modal
    v-if="createChatVisible"
    v-model="createChatVisible"
    title="新建模板"
    :isFooter="false"
  >
    <CreateTopic @close="createChatVisible = false"></CreateTopic>
  </xt-old-modal>
  <!-- 系统设置 -->
  <xt-modal v-if="setVisible" v-model="setVisible" title="AI助手设置">
    <div
      style="width: 500px"
      :style="{
        height: aiMode == 'custom' ? '66vh' : 'auto',
      }"
    >
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
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { aiStore } from "../../../store/ai";
import CreateTopic from "../chat/left/createTopic.vue";
import Edit from "./edit.vue";
// import { SettingFilled } from "@ant-design/icons-vue";

const {
  selectTab,
  openMode,
  gpt,
  temperature,
  count,
  key,
  url,
  customData,
  aiMode,
} = storeToRefs(aiStore());

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
const menuList = ref([
  {
    icon: "message",
    callBack: () => {
      selectTab.value = "Chat";
    },
  },
  {
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
]);

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
