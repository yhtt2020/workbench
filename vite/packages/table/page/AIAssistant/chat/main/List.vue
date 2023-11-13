<template>
  <div class="pl-2">
    <template v-for="item in chatList" :key="item.id">
      <div class="flex justify-end mb-3" v-if="item.role === 'user'">
        <div class="flex flex-col">
          <div class="flex">
            <div class="block text-base xt-bg-2 rounded-xl ml-10 mr-2">
              <GPT :content="item.content"></GPT>
            </div>
            <img
              :src="img"
              alt=""
              style="width: 32px; height: 32px; border-radius: 50%"
            />
          </div>
          <div class="flex justify-end items-center cursor-pointer my-2">
            <xt-button
              type="2222"
              h="16"
              w="60"
              size="mini"
              :copy="item.content"
              class="xt-text-2"
            >
              <xt-base-icon icon="fuzhi" />
              复制
            </xt-button>
          </div>
        </div>
      </div>
      <div v-else class="flex flex-col">
        <div class="flex">
          <img src="/img/gpt.png" alt="" style="width: 32px; height: 32px" />
          <div class="flex-1 w-0">
            <div class="ml-2  inline-block text-base xt-bg-2 rounded-xl mr-10" style="max-width: calc(100% - 20px)">
              <GPT :content="item.content"></GPT>
            </div>
          </div>
        </div>
        <xt-button
          type=""
          h="16"
          w="60"
          size="mini"
          :copy="item.content"
          class="xt-text-2 my-2"
        >
          <xt-base-icon icon="fuzhi" />
          复制
        </xt-button>
      </div>
    </template>
  </div>
</template>
<script setup>
import GPT from "./GPT.vue";
import { appStore } from "../../../../store";
const store = appStore();
let img = store.userInfo.avatar ? store.userInfo.avatar : "/img/user.png";
const props = defineProps({
  chatList: {
    type: Array,
  },
});
</script>

<style lang="scss" scoped></style>
