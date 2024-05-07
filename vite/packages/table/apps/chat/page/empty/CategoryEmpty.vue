<!-- 频道创建空状态 -->
<script setup>
import { computed, ref, toRefs } from "vue";
import _ from "lodash-es";
import { chatCommunityStore } from "../../store/chatCommunity";
import { storeToRefs } from "pinia";

import AddNewAppPage from "../add/AddNewAppPage.vue";
import AddCategory from "../../components/create/CreateCategory.vue";

/**解构store数据**/
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);

const addNewAppRef = ref(null);
const newCategoryRef = ref(null);
/**按钮列表**/
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

/**通过计算属性判断角色权限是否存在,以及是否为管理员**/
const hasRole = computed(() => {
  const findRole = _.find(myCommunity.value, (item) => {
    return Number(item.cno) === Number(no.value);
  });
  if (!findRole) return false;
  else {
    if (findRole.role !== "member") {
      return true;
    } else {
      return false;
    }
  }
});
</script>

<template>

  <!-- 管理员的权限 -->
  <template v-if="hasRole">
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

  <!-- 非管理员权限 -->
  <template v-else>
    <div class="flex items-center justify-center flex-col">
      <xt-ify-icon icon="fluent-emoji:knocked-out-face" size="64" class="mb-4" />
      <span class="xt-text xt-font font-16">暂无社群内容</span>
    </div>
  </template>

  <!-- 添加新应用 -->
  <AddNewAppPage ref="addNewAppRef" />
  <!-- 添加新频道 -->
  <AddCategory ref="newCategoryRef" :no="no"/>
</template>

<style scoped>
</style>