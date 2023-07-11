<template>
  <div class="flex mb-2 justify-between">
    <div class=" flex items-center">
      <Tab
        style="width: 320px; height: 48px"
        boxClass="p-1 xt-bg-2"
        :list="modelList"
        v-model:data="model"
      ></Tab>
      <a-input
        style="width: 288px; height: 48px"
        class="xt-border rounded-xl xt-bg-2 pl-4 mx-2"
        v-model:value="searchValue"
        placeholder="搜索"
      >
        <template #suffix>
          <Icon icon="sousuo" style="font-size: 20px"></Icon>
        </template>
      </a-input>
    </div>
    <div>
        <FullBtn></FullBtn>
    </div>
  </div>
</template>
<script>
import Tab from "../../../components/card/components/tab/index.vue";
import FullBtn from "../components/FullBtn.vue"
import { mapWritableState } from "pinia";
import { aiStore } from "../../../store/ai";
export default {
  computed: {
    ...mapWritableState(aiStore, ["model"]),
  },
  components: {
    Tab,
    FullBtn
  },
  data() {
    return {
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
