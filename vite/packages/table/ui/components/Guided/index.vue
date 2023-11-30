<template>
  <Teleport to="body">
    <XtView type="popup" title="客户端下载" :showFull="false" @close="close()">
      <div style="width: 552px">
        <div class="xt-bg-2 rounded-xl flex flex-col p-3 mb-3">
          <div class="">当前功能暂不支持Web版，推荐下载客户端体验完整功能</div>
          <div class="text-sm xt-text-2 mt-2">部分功能需要系统API支持</div>
        </div>
        <div class="flex flex-wrap justify-between">
          <div
            style="width: 49%; height: 126px"
            class="rounded-xl p-3 xt-bg-2 mb-3 flex p-3"
            v-for="item in appList"
          >
            <div class="mr-3">
              <div
                class="xt-modal rounded-xl"
                style="width: 56px; height: 56px"
              ></div>
            </div>
            <div class="flex flex-col">
              <div class="text-base xt-text">{{ item.name }}</div>
              <div class="text-sm xt-text-2">{{ item.info }}</div>
            </div>
          </div>
        </div>
        <div class="flex justify-center my-1">
          <XtButton
            @click="download()"
            type="theme"
            style="width: 240px"
            :disabled="item?.disabled"
            >前往下载</XtButton
          >
        </div>
      </div>
    </XtView>
  </Teleport>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      appList: [
        {
          name: "桌面应用快捷启动",
          img: "",
          info: "一键导入系统桌面图标，即可在工作台中整理和启动。",
        },
        {
          name: "效率助手",
          img: "",
          info: "同步Steam游戏库，一键启动游戏，游戏专属桌面搭建。",
        },
        {
          name: "游戏助手",
          img: "",
          info: "剪贴板历史记录、自定义系统快捷键指令，各类效率小工具任你选择。",
        },
        {
          name: "系统性能监控",
          img: "",
          info: "配合AIDA64，即可实现工作台实时监控系统性能指标。",
        },
      ],
    };
  },
  methods: {
    download() {
      window.open("https://www.apps.vip/download/");
      this.close();
    },
    close() {
      this.$emit("close");
    },
    check() {
      let noWebAppList = ["音频", "捕获", "系统性能监控", "网易云"];
      if (noWebAppList.includes(item.cname)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
