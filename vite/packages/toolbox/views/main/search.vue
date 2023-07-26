<template>
  <div style="width: 100%; height: 60px" class="xt-bg-2 flex items-center">
    <template v-if="useTool">
      <!-- <Icon
        icon="xiangzuo"
        style="font-size: 20px; width: 10px"
        class="no-darg xt-text"
      ></Icon>
      <XtIcon
        class="ml-4"
        icon="xiangzuo"
        w="22"
        h="22"
        size="10"
        style="border-radius: 50%"
      ></XtIcon> -->
      <div @click="back()" class="no-darg cursor-pointer" style="padding: 8px;" ><icon icon="xiangzuo" style="font-size: 24px"></icon></div>
      <div
        class="xt-active-bg-2 xt-base-btn px-2 w-auto"
        style="height: 44px"
      >
        <img
          :src="'/packages/toolbox/assets/images/' + useTool.img + '.png'"
          style="width: 32px; height: 32px"
          class="mr-2"
          alt=""
        />
        <div style="white-space: nowrap">{{ useTool.name }}</div>
      </div>
    </template>

    <Tinput
      v-model:data="search"
      placeholder="试试输入、粘贴、拖放内容到此处"
      @enter="searchEnter()"
    >
      <template #suffix v-if="search">
        <div @click="clear()">删除按钮</div>
      </template>
    </Tinput>
    <!-- <a-input
        class="xt-text flex-1 no-darg text-base"
        placeholder="点击上传、粘贴、拖放文件到此处"
        style="height: 48px"
        :class="border"
        v-model:value="search"
        @focus="handleFocus()"
        @change="handleChange()"
        @blur="handleBlur()"
      ></a-input> -->
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { useMainStore } from "../../store/main";
import { useCalculatorStore } from "../../store/globalSearch";
export default {
  computed: {
    ...mapWritableState(useMainStore, ["useTool"]),
    ...mapWritableState(useCalculatorStore, ["computeList", "selectIndex"]),
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    back() {
      this.$router.push("/");
      this.useTool = "";
    },
    clear() {
      this.search = "";
    },
    // 计算器联动
    useCalculator() {
      this.selectIndex = this.computeList.length - 1;
      this.computeList[this.computeList.length - 1] = this.search;
      this.search = "";
    },
    // 搜索回车

    searchEnter() {
      let name = this.useTool.route;
      if (name === "calculator") {
        this.useCalculator();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
input {
  border: none;
  background: none;
}
.ant-input:focus {
  box-shadow: none !important;
}
</style>
