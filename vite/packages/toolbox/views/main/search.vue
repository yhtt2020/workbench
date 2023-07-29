<template>
  <div style="height: 60px" class="xt-bg-2 xt-text flex items-center">
    <template v-if="useTool">
      <XtIcon
        @click="back()"
        class="mx-2"
        icon="xiangzuo"
        type=""
        w="26"
        h="26"
        size="24"
      ></XtIcon>
      <div class="xt-active-bg-2 xt-base-btn px-2 w-auto" style="height: 44px">
        <img
          :src="'/tools/' + useTool.img + '.png'"
          style="width: 32px; height: 32px"
          class="mr-2"
          alt=""
        />
        <div style="white-space: nowrap">{{ useTool.name }}</div>
      </div>
    </template>

    <XtInput
      :focus="true"
      v-model:data="search"
      placeholder="试试输入、粘贴、拖放内容到此处"
      @enter="searchEnter()"
    >
      <template #suffix v-if="search">
        <XtIcon
          @click="clear()"
          type=""
          class="xt-text"
          icon="guanbi"
          w="24"
          h="24"
          size="24"
        ></XtIcon>
      </template>
    </XtInput>
  </div>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { main } from "../../store/main";
import { calculator } from "../../store/calculator";
import { translate } from "../../store/translate";
import { timeConversion } from "../../store/timeConversion";
export default {
  mounted() {},
  computed: {
    ...mapWritableState(main, ["useTool"]),
    ...mapWritableState(calculator, ["computeList", "selectIndex"]),
    ...mapWritableState(translate, ["inputValue"]),
    ...mapWritableState(timeConversion, ["time", "timeStamp"]),
  },
  data() {
    return {
      search: "",
    };
  },
  methods: {
    ...mapActions(translate, ["startTranslation"]),
    ...mapActions(timeConversion, ["timeKeyup", "timeStampKeyup"]),
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
      this.clear();
    },
    // 翻译
    useTranslate() {
      this.inputValue = this.search;
      this.startTranslation();
      this.clear();
    },
    // 时间戳转换
    useTimeConversion() {
      this.timeStamp = this.search;
      this.timeStampKeyup();
      this.clear();
    },
    // 搜索回车

    searchEnter() {
      let name = this.useTool.route;
      if (name === "calculator") {
        this.useCalculator();
      }
      if (name === "translate") {
        this.useTranslate();
      }
      if (name === "timeConversion") {
        this.useTimeConversion();
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
