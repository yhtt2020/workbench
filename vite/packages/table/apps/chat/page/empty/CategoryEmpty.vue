<!-- 频道创建空状态 -->
<script setup>
import { ref, toRefs } from "vue";

import AddNewAppPage from "../add/AddNewAppPage.vue";
import AddCategory from "../../components/create/CreateCategory.vue";

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
  no: {
    type: String,
    required: true,
  },
});
const { role,no } = toRefs(props);

const addNewAppRef = ref(null);
const newCategoryRef = ref(null);
const emptyList = ref([
  {
    icon: "fluent:people-add-16-regular",
    name: "邀请其他人",
    callBack: () => {},
  },

  {
    icon: "fluent:apps-add-in-20-filled",
    name: "添加新应用",
    callBack: () => {
      addNewAppRef.value.openNewAppFirstStep();
    },
  },
  {
    icon: "fluent:add-16-filled",
    name: "添加新分组",
    callBack: () => {
      newCategoryRef.value.openCategoryModal();
    },
  },
]);
</script>

<template>
  <template v-if="role !== 'member'">
    <template v-for="item in emptyList">
      <xt-button
        w="184"
        h="44"
        style="border-radius: 8px; margin-bottom: 12px"
        @click="item.callBack"
      >
        <div class="flex items-center justify-center">
          <xt-ify-icon :icon="item.icon" size="20" class="mr-3" />
          <span class="font-16 xt-text xt-font">
            {{ item.name }}
          </span>
        </div>
      </xt-button>
    </template>
  </template>

  <template v-else>
    <div class="flex items-center justify-center flex-col">
      <xt-ify-icon icon="fluent-emoji:sleeping-face" size="64" class="mb-4" />
      <span class="xt-text xt-font font-16">暂无社群内容</span>
    </div>
  </template>

  <AddNewAppPage ref="addNewAppRef" />
  <AddCategory ref="newCategoryRef" :no="no"/>
</template>

<style scoped>
</style>