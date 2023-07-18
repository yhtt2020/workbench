<template>
  <XtTab
    :style="widthStyle"
    class="mr-2"
    mode="col"
    v-model:data="selectTab"
    :list="tabList"
    :showName="showName"
    itemClass="mb-2 h-14"
  ></XtTab>
</template>

<script>
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTab", "isFull"]),
    showName() {
      return this.isFull ? false : true;
    },
    widthStyle() {
      if (this.isFull) {
        return {
          width: "60px",
        };
      } else {
        return {
          width: "150px",
        };
      }
    },
  },
  data() {
    return {
      tabList: [
        {
          name: "对话聊天",
          icon: "message",
          value: "Chat",
        },
        {
          name: "推荐模板",
          icon: "wanggeshitu",
          value: "Mode",
        },
        {
          name: "我的账号",
          icon: "setting",
          value: "Account",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
