<template>
    <Tab
      mode="col"
      v-model:data="selectTab"
      :list="tabList"
      :showName="showName"
      itemClass="mb-2 h-14"
    ></Tab>
</template>

<script>
import Tab from "../../../components/card/components/tab/index.vue";
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["selectTab", "isFull"]),
    showName() {
      console.log("this.isFull :>> ", this.isFull);
      return this.isFull ? false : true;
    },
  },
  components: { Tab },

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
          value: "Model",
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
