<template>
  <div class="pl-2">
    <template v-for="item in chatList" :key="item.id">
      <div class="flex justify-end mb-3" v-if="item.role === 'user'">
        <div class="flex flex-col">
          <div class="block text-base xt-bg-2 rounded-xl ml-10">
            <GPT :content="item.content"></GPT>
          </div>
          <div class="flex justify-end items-center cursor-pointer my-1">
            <xt-button
              type=""
              icon="fuzhi"
              h="16"
              w="60"
              size="mini"
              :copy="item.content"
              class="xt-text-2"
              >复制
            </xt-button>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="inline-block text-base xt-bg-2 rounded-xl mr-10"

        >
          <GPT :content="item.content"></GPT>
        </div>
        <xt-button
          type=""
          icon="fuzhi"
          h="16"
          w="60"
          size="mini"
          :copy="item.content"
          class="xt-text-2 my-1"
          >复制
        </xt-button>
      </div>
    </template>
  </div>
</template>
<script>
import GPT from "./GPT.vue";
export default {
  components: {
    GPT,
  },

  props: {
    chatList: {
      type: Array,
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped></style>
