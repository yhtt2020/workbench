<template>
  <div
    class="xt-border h-full xt-bg-2 p-3 xt-text text-base overflow-hidden overflow-y-auto xt-scrollbar"
  >
    <div class="h-12 flex" v-for="(i, index) in calculators" :key="index">
      <!-- <a-input
        :key="index"
        class="xt-text flex-1"
        placeholder="请输入计算式，如 99+99 "
        style="height: 48px"
        :class="border"
        v-model:value="computeList[index]"
        @focus="handleFocus(index)"
        @change="handleChange()"
        @blur="handleBlur(index)"
      ></a-input> -->
      <Tinput
        :key="index"
        class="xt-text flex-1"
        placeholder="请输入计算式，如 99+99 "
        style="height: 48px"
        :class="border"
        v-model:data="computeList[index]"
        @focus="handleFocus(index)"
        @change="handleChange()"
        @blur="handleBlur(index)"
      ></Tinput>
      <div
        v-if="countList[index]"
        class="px-3 flex items-center success cursor-pointer xt-active res truncate"
        style="
          max-width: 30%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        "
        @click="copyToClipboard(countList[index])"
        @mouseover="showCopy()"
        @mouseout="hideCopy()"
      >
        {{ countList[index] }}
      </div>
    </div>
    <div
      class="absolute left-1/2 -translate-x-1/2 res-copy"
      style="bottom: 22px"
    >
      点击复制
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import { useCalculatorStore } from "../../../store/globalSearch";
import { mapWritableState } from "pinia";
import Mexp from "math-expression-evaluator";

export default {
  computed: {
    ...mapWritableState(useCalculatorStore, [
      "computeList",
      "countList",
      "calculators",
      "selectIndex",
    ]),
  },
  data() {
    return {};
  },
  watch: {
    computeList: {
      handler() {
        let formula = this.computeList[this.selectIndex];
        formula = this.pretreatment(formula);
        const mexp = new Mexp();
        const lexed = mexp.lex(formula); // 对表达式进行词法分析
        const postfixed = mexp.toPostfix(lexed); // 将词法分析得到的结果转换为后缀表达式
        const result = mexp.postfixEval(postfixed); // 使用后缀表达式求值
        this.countList[this.selectIndex] = result;
        // const regex =
        //   /^\(*[+-]?(?:\d{1,15}|\d{1,3}(?:,\d\d\d){1,4})(?:\.\d{1,15})?%?\)*(?:\s*[+*/^%-]\s*\(*[+-]?(?:\d{1,15}|\d{1,3}(?:,\d\d\d){1,4})(?:\.\d{1,15})?%?\)*)+$/;
        // const match = regex.exec(formula);
        // if (match) {
        //   res = eval(match[0]);
        // } else {
        //   res = formula;
        // }
        // this.countList[this.selectIndex] = res;
        // this.countList[this.selectIndex] = math.eval(formula);
        this.handleChange();
      },
      deep: true,
    },
  },
  methods: {
    // 复制状态显示
    showCopy() {
      const resCopy = document.querySelector(".res-copy");
      resCopy.style.display = "block";
    },
    hideCopy() {
      const resCopy = document.querySelector(".res-copy");
      resCopy.style.display = "none";
    },
    pretreatment(str) {
      return str.replace(/[（）]/g, (match) => {
        if (match === "（") return "(";
        if (match === "）") return ")";
        return match;
      });
    },
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
.res {
  &:hover {
    background: var(--success);
    border-radius: 12px;
    color: var(--primary-text);
  }
}
.res-copy {
  display: none;
}
input {
  border: none;
  background: none;
}
.ant-input:focus {
  box-shadow: none;
}
</style>
