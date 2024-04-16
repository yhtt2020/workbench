<!-- 频道创建空状态 -->
<script setup>
import { ref, toRefs } from "vue";

import AddNewApp from "../../components/add/AddNewApp.vue";


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
const { role } = toRefs(props);

const addNewAppRef = ref(null);

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
      addNewAppRef.value.openAddNewApp();
    },
  },
  {
    icon: "fluent:add-16-filled",
    name: "添加新分组",
    callBack: () => {},
  },
]);

// 选择下一步
const emptyAppNext = (data) =>{
  console.log('data',data);
  switch (key) {
    case value:
      
      break;
  
    default:
      break;
  }
}

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

  <AddNewApp ref="addNewAppRef" @next="emptyAppNext"/>
</template>

<style scoped>
</style>