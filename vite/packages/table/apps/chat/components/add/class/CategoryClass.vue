<!-- 选择社群一级频道目录的分类 -->
<template>
  <xt-modal v-if="classVisible" v-model="classVisible" custom>
    <div class="flex flex-col p-4" style="width: 500px">
      <div class="w-full flex items-center justify-between mb-4">
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
        <span class="xt-text xt-font font-16">自定义网页链接</span>
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
import { nextTick, ref, toRefs } from "vue";

const emit = defineEmits(["prev"]);

const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);

const classVisible = ref(false);
const openClassModal = () => {
  classVisible.value = true;
  nextTick(() => {
    // 获取分类数据
    console.log("no", no.value);
  });
};

// 返回上一步
const returnPreviousStep = () => {
  classVisible.value = false;
  emit("prev");
};

defineExpose({
  openClassModal,
});
</script>

<style lang="scss" scoped>
</style>