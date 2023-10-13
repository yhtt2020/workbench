<template>
  <div class="flex justify-between">
    <div class="flex items-center">
      <XtTab
        style="width: 320px; height: 48px"
        boxClass="p-1 xt-bg-2"
        :list="modelList"
        v-model="mode"
      ></XtTab>
      <XtInput
        class="ml-4"
        style="width: 288px; height: 48px"
        v-model="searchValue"
      >
        <Icon
          icon="sousuo"
          style="font-size: 20px"
          class="cursor-pointer"
        ></Icon>
      </XtInput>
    </div>
    <div class="flex items-center">
      <XtIcon icon="tianjia2" @click="addModelVisible = true"></XtIcon>
    </div>
  </div>
  <!-- <XtPopup
    v-if="addModelVisible"
    @close="addModelVisible = false"
    title="新建模板"
  >
    <edit></edit>
  </XtPopup> -->
</template>
<script>
import edit from "./edit.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["mode"]),
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
          value: "Default",
          name: "系统预设",
        },
        {
          value: "User",
          name: "我的模板",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
