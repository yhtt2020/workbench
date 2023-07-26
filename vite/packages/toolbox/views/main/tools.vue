<template>
  <div class="flex flex-wrap">
    <div
      v-for="tool in toolsList"
      :key="tool.route"
      class="xt-text flex flex-col items-center justify-center m-1 cursor-pointer"
      style="width: 100px; height: 100px"
      @click="toolClick(tool)"
    >
      <img
        class="w-12 h-12 mb-2"
        :src="'/packages/toolbox/assets/images/' + tool.img + '.png'"
        alt=""
      />
      <div class="text-sm">{{ tool.name }}</div>
    </div>
  </div>
</template>

<script>
import { mapWritableState } from "pinia";
import { main } from "../../store/main";
export default {
  computed: {
    ...mapWritableState(main, ["useTool"]),
  },
  data() {
    return {
      toolsList: [
        { name: "计算器", img: "calculator", route: "calculator" },
        { name: "时间戳转换", img: "timeConversion", route: "timeConversion" },
        { name: "翻译", img: "translate", route: "translate" },

        // { name: "搜索网格", img: "searchTools", route: "searchTools" },
        // { name: "文件分享", img: "fileFhare", route: "fileFhare" },
        // {
        //   name: "汇率转换",
        //   img: "exchangeConversion",
        //   route: "exchangeConversion",
        // },
        //
        // { name: "文字识别", img: "textRecognition", route: "textRecognition" },
        //
        // {
        //   name: "格式转换",
        //   img: "formatConversion",
        //   route: "formatConversion",
        // },
        //
        // { name: "快递查询", img: "expressQuery", route: "expressQuery" },
        // { name: "压缩图片", img: "compressImage", route: "compressImage" },
        // { name: "一键取色", img: "colorSelection", route: "colorSelection" },
        // {
        //   name: "创建代办",
        //   img: "createRepresentative",
        //   route: "createRepresentative",
        // },
        // { name: "emoji搜索", img: "emojiSearch", route: "emojiSearch" },
        // {
        //   name: "二维码生成",
        //   img: "QRCodeGeneration",
        //   route: "QRCodeGeneration",
        // },
      ],
    };
  },
  methods: {
    toolClick(tool) {
      this.$router.push(tool.route);
      this.useTool = tool;
    },
  },
};
</script>

<style lang="scss" scoped></style>
