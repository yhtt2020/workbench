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
      lang: "zh",
      name: "中文",
    },
  }),
  actions: {
    async startTranslation() {
      let res: any = await getResult({
        fromLang: this.fromLang.lang,
        toLang: this.toLang.lang,
        queryStr: this.inputValue,
        platform: 'worktable',
      });
      let { data, code } = res;
      if (code === 1000) {
        console.log(data,'返回的数据')
        if(data.status){
          this.resultValue =data.data.trans_result[0].dst
        }else{
          return console.log('error :>> ', res);
        }
      }else {
        console.log('res :>> ', res);
      }
    },
  },
});
