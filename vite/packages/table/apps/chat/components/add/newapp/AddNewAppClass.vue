<!-- 最后一个步骤,选择频道目录分类 -->
<template>
  <xt-modal v-if="classVisible" v-model="classVisible" custom>
    <div class="flex flex-col p-4" style="width: 500px">
      <div class="w-full flex items-center justify-between">
        <xt-button
          w="32"
          h="32"
          @click="returnPreviousStep"
          style="border-radius: 8px"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:chevron-left-16-filled"
              size="20"
              class="xt-text"
            />
          </div>
        </xt-button>
        <span class="xt-text xt-font font-16">选择分组</span>
        <xt-button
          w="32"
          h="32"
          style="border-radius: 8px"
          @click="classVisible = false"
        >
          <div class="flex items-center justify-center">
            <xt-ify-icon
              icon="fluent:dismiss-16-filled"
              class="xt-text"
              size="20"
            />
          </div>
        </xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref } from "vue";
const emit = defineEmits(["prev"]);
const classVisible = ref(false);
const openCategoryClassModal = () => {
  classVisible.value = true;
};
const returnPreviousStep = () => {
  emit("prev");
  classVisible.value = false;
};
defineExpose({
  openCategoryClassModal,
});
</script>

<style lang="scss" scoped>
</style>