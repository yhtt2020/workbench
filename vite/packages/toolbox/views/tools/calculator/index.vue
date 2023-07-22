<template>
  <div
    class="xt-border h-full xt-bg-2 p-3 xt-text text-base overflow-hidden overflow-y-auto xt-scrollbar"
  >
    <div class="h-12 flex" v-for="(i, index) in calculators" :key="index">
      <a-input
        :key="index"
        class="xt-text flex-1"
        placeholder="请输入计算式，如 99+99 "
        style="height: 48px"
        :class="border"
        v-model:value="computeList[index]"
        @focus="handleFocus(index)"
        @change="handleChange()"
        @blur="handleBlur(index)"
      ></a-input>
      <div
        class="px-3 flex items-center success overflow-hidden cursor-pointer xt-active"
        style="max-width: 30%"
        @click="copyToClipboard(countList[index])"
      >
        {{ countList[index] }}
      </div>
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";

export default {
  data() {
    return {
      computeList: [null],
      countList: [null],
      selectIndex: 0,
      calculators: 1,
    };
  },
  mounted() {
    let calculator = this.$cache.get("calculator");
    if (calculator) {
      const { computeList, countList, calculators } = calculator;
      this.computeList = computeList;
      this.countList = countList;
      this.calculators = calculators;
    }
  },
  watch: {
    computeList: {
      handler() {
        let formula = this.computeList[this.selectIndex];
        let res = 0;
        const regex =
          /^\(*[+-]?(?:\d{1,15}|\d{1,3}(?:,\d\d\d){1,4})(?:\.\d{1,15})?%?\)*(?:\s*[+*/^%-]\s*\(*[+-]?(?:\d{1,15}|\d{1,3}(?:,\d\d\d){1,4})(?:\.\d{1,15})?%?\)*)+$/;
        const match = regex.exec(formula);
        if (match) {
          res = eval(match[0]);
        } else {
          res = formula;
        }
        this.countList[this.selectIndex] = res;
        let calculator = {
          computeList: this.computeList,
          countList: this.countList,
          calculators: this.calculators,
        };
        this.$cache.set("calculator", calculator);
      },
      deep: true,
    },
  },
  methods: {
    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          message.success("已成功复制到剪切板");
        })
        .catch((err) => {});
    },
    handleFocus(i) {
      this.selectIndex = i;
    },
    handleBlur(index) {
      if (
        this.computeList[index] === "" &&
        index !== this.computeList.length - 1
      ) {
        this.computeList.splice(index, 1);
        this.countList.splice(index, 1);
        this.calculators--;
      }
    },
    handleChange() {
      let computeList = this.computeList;
      if (computeList[computeList.length - 1] !== "") {
        this.computeList.push("");
        this.countList.push("");
        this.calculators++;
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
  box-shadow: none;
}
</style>
