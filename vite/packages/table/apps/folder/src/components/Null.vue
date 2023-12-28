<template>
  <div class="flex justify-center items-center flex-col h-full">
    <xt-ify-icon
      v-if="cardSize.height !== 1"
      icon="fluent-emoji:inbox-tray"
      size="56"
      class="mb-3"
    />
    <div class="xt-bg-t-2 rounded-xl text-sm mb-3 p-2" style="max-width: 452px">
      你可以拖动工作台桌面图标或windows程序或文件图标到此处；或者进入分组设置选择自动整理模式，为你自动整理桌面图标。
    </div>
    <xt-button type="theme" w="84" h="32" radius="8" @click="editClick">
      添加图标</xt-button
    >
  </div>

  <EditNewNavigation
    v-if="editVisible"
    @setQuick="editVisible = false"
    @addIcon="addIcon"
    :isFolder="false"
  ></EditNewNavigation>
</template>

<script setup>
import EditNewNavigation from "../../../../components/desk/navigationBar/EditNewNavigation.vue";
import { useNavigationStore } from "../../../../components/desk/navigationBar/navigationStore";
import { watch, toRefs, ref } from "vue";
import { defaultData } from "./options";
import { nanoid } from "nanoid";

const props = defineProps({
  cardSize: {},
});
const navigationStore = useNavigationStore();
const editVisible = ref(false);
const emits = defineEmits([""]);

const { cardSize } = toRefs(props);

const editClick = () => {
  navigationStore.selectNav = "desktop";
  editVisible.value = true;
};

const addIcon = (data) => {
  const { name, icon, type, value } = data;
  let fileInfo = {
    ...defaultData,
    id: nanoid(6),
    name,
    icon,
    type,
    value,
  };
  emits("createFile", fileInfo);
};
</script>

<style lang="scss" scoped></style>
