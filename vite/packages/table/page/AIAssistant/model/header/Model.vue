<template>
  <div class="flex justify-between">
    <div class="flex items-center">
      <XtTab
        style="width: 320px; height: 48px"
        boxClass="p-1 xt-bg-2"
        :list="modelList"
        v-model:data="model"
      ></XtTab>
      <XtInput
        class="ml-4"
        style="width: 288px; height: 48px"
        v-model:data="searchValue"
      >
        <Icon
          icon="sousuo"
          style="font-size: 20px"
          class="cursor-pointer"
        ></Icon>
      </XtInput>
    </div>
    <div class="flex items-center">
      <div
        class="icons xt-btn w-12 h-12 xt-text text-lg"
        @click="addModelVisible = true"
      >
        <Icon icon="tianjia2"></Icon>
      </div>
    </div>
  </div>
  <XtPopup
    v-if="addModelVisible"
    @close="addModelVisible = false"
    title="新建模板"
  >
    <edit></edit>
  </XtPopup>
</template>
<script>
import edit from "../edit.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["model", "isUseModel"]),
  },
  components: {
    edit,
  },
  data() {
    return {
      addModelVisible: "",
      searchValue: "",
      modelList: [
        {
          value: "default",
          name: "系统预设",
        },
        {
          value: "my",
          name: "我的模板",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
