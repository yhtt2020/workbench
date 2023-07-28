import { defineStore } from "pinia";
import { getResult } from "../api/translate";

export const translate = defineStore("translate", {
  state: () => ({
    inputValue: "",
    resultValue: "",
    selectLang: {
      lang: "zn",
      name: "中文",
    },
  }),
  actions: {
    async startTranslation() {
      let res: any = await getResult({
        toLang: this.selectLang.lang,
        queryStr: this.inputValue,
      });
      let { data, code } = res;
      if (code === 1000) {
        this.resultValue = data.trans_result[0].dst;
      }
    },
  },
});
