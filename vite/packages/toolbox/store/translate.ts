import { defineStore } from "pinia";
import { getResult } from "../api/translate";

export const translate = defineStore("translate", {
  state: () => ({
    inputValue: "",
    resultValue: "",
  }),
  actions: {
    async startTranslation() {
      let res: any = await getResult({
        toLang: "zh",
        queryStr: this.inputValue,
      });
      let { data, code } = res;
      if (code === 1000) {
        this.resultValue = data.trans_result[0].dst;
      }
    },
  },
});
