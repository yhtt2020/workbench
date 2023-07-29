import { defineStore } from "pinia";
import { getResult } from "../api/translate";

export const translate = defineStore("translate", {
  state: () => ({
    inputValue: "",
    resultValue: "",
    fromLang: {
      lang: "auto",
      name: "自动检测",
    },
    toLang: {
      lang: "zn",
      name: "中文",
    },
  }),
  actions: {
    async startTranslation() {
      let res: any = await getResult({
        fromLang: this.fromLang.lang,
        toLang: this.toLang.lang,
        queryStr: this.inputValue,
      });
      let { data, code } = res;
      if (code === 1000) {
        this.resultValue = data.trans_result[0].dst;
      }
    },
  },
});
