<template>
  <xt-tab
    :list="tabList"
    v-model="selectTab"
    mode="col"
    placement="right"
    itemClass="h-16 w-16"
  ></xt-tab>

  <xt-tab
    style="width: 260px; height: 120px"
    :list="tabList"
    v-model="selectTab"
  ></xt-tab>
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
          tip: "对话聊天",
          icon: "message",
          value: "Chat",
        },
        // {
        //   name: "推荐模板",
        //   icon: "wanggeshitu",
        //   value: "Mode",
        // },
        {
          tip: "我的账号",
          icon: "setting",
          value: "Account",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
