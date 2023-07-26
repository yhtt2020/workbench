<template>
  <div class="h-full flex flex-col">
    <div class="mb-2">
      <XtButton type="theme">翻译</XtButton>
    </div>
    <div class="flex flex-grow justify-between">
      <XtTextarea
        class="h-full"
        style="width: 49%"
        placeholder="请输入"
      ></XtTextarea>
      <XtTextarea class="h-full" style="width: 49%"></XtTextarea>
    </div>
  </div>
</template>

<script>
// C:\Users\16110\Desktop\demo1 (2)\browser\vite\packages\table\consts.ts
// C:\Users\16110\Desktop\demo1 (2)\browser\src\util\axios.js
import { sUrl } from "../../../../table/consts";
import service from "../../../../table/components/card/hooks/request";
const translateApi = sUrl("/app/translate");
// import service from "@/request";
import { getTranslate } from "./api/api";
console.log("object :>> ", service);
export default {
  async mounted() {
    // let res = await getTranslate({
    //   toLang: "zh",
    //   queryStr: "like",
    // });
    // console.log("res :>> ", res);
  },
};
</script>

<style lang="scss" scoped></style>
