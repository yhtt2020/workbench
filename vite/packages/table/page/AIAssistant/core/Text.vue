<template>
    <div class="xt-bg-2 w-full p-2 rounded-xl relative mt-1">
      <textarea
        class="w-full block resize-none overflow-y-auto text-base"
        style="
          resize: none;
          background-color: transparent;
          outline: 0px solid transparent;
          outline-offset: 0px;
          border: 0;
          max-height: 200px;
        "
        :class="{ 'xt-scrollbar': isScrollbar }"
        :style="[initHeight ? '' : 'height: 28px;']"
        rows="1"
        spellcheck="false"
        placeholder="开始聊天吧"
        @input="onInput"
        @keydown.enter.exact.prevent="onSearch"
        v-model="search"
      >
      </textarea>
      <Icon
        class="absolute top-1/2 -translate-y-1/2 cursor-pointer"
        @click="isSearch ? onSearch() : test()"
        :icon="isSearch ? 'sousuo' : 'gengduo1'"
        style="font-size: 26px; right: 20px"
      ></Icon>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emits = defineEmits(["onSearch"]);
const isScrollbar = ref(false);
const initHeight = ref(true);
const search = ref("");

const props = defineProps({
  isSearch: {
    type: Boolean,
    required: true,
  },
});
watch(search, (newV) => {
  if (newV) {
    initHeight.value = true;
  }
});
const test = () => {};
// 输入框 动态高度 以及 滚动条状态 处理
const onInput = (e) => {
  const textarea = e.target;
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
  isScrollbar.value = textarea.scrollHeight >= 200;
};

// 搜索
const onSearch = () => {
  if (props.isSearch && search.value.trim()) {
    initHeight.value = false;
    isScrollbar.value = false;
    emits("onSearch", search.value);
    search.value = "";
  }
};
</script>

<style lang="scss" scoped></style>
