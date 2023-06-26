<template>
  <!-- 遮罩 -->
  <div class="w-full h-full" @click="close()"></div>
  <!-- 添加图标 -->
  <div
    class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 p-3 xt-modal rounded-xl"
    style="width: 728px"
  >
    <!-- 头部 -->
    <header
      class="flex items-center justify-center h-12 w-full relative text-lg"
    >
      批量导入图标
      <div
        class="absolute rounded-xl xt-bg-2 flex items-center justify-center right-0 cursor-pointer h-12 w-12"
        @click="close()"
      >
        <Icon class="icon" icon="guanbi1"></Icon>
      </div>
    </header>
    <!-- 主体 -->
    <main class="flex mt-3" style="">
      <!-- 左侧 -->
      <div
        class="pr-2"
        style="width: 130px; border-right: 1px solid var(--divider)"
      >
        <div
          class="flex justify-center items-center rounded-xl cursor-pointer h-12 w-120"
          v-for="item in navList"
          :key="item.name"
          @click="navName = item.component"
          :class="{ 'xt-bg-2': item.component == navName }"
        >
          {{ item.name }}
        </div>
      </div>
      <!-- 右侧 -->
      <div class="pl-2 w-full h-full">
        <component ref="apps" :is="navName"></component>
      </div>
    </main>
    <footer class="flex items-center justify-center mt-2">
      <div
        class="xt-bg-2 flex items-center justify-center rounded-xl cursor-pointer m-1 h-12 w-120"
        @click="close()"
      >
        取消
      </div>
      <div
        class="xt-active-bg flex items-center justify-center rounded-xl cursor-pointer m-1 h-12 w-120 xt-active-text"
        @click="commitIcons()"
      >
        确认
      </div>
    </footer>
  </div>
</template>

<script>
import Apps from "./modules/apps.vue";
import Links from "./modules/links.vue";

import { cardStore } from "../../../store/card.ts";
import { myIcons } from "../../../store/myIcons.ts";
import { mapActions, mapWritableState } from "pinia";

export default {
  props: ["desk"],
  components: {
    Apps,
    Links,
  },
  data() {
    return {
      navList: [
        { name: "网址导航", component: "Links" },
        { name: "我的应用", component: "Apps" },
      ],
      navName: "Links",
    };
  },
  computed: {
    ...mapWritableState(myIcons, ["iconOption", "iconList"]),
  },
  methods: {
    ...mapActions(cardStore, ["addCard"]),
    close() {
      this.$emit("hideAddCard");
    },
    async commitIcons() {
      let app = this.$refs.apps;
      if (app.selectApps.length !== 0) {
        for (let i = 0; i < app.selectApps.length; i++) {
          let iconOption = { ...this.iconOption };
          console.log(' :>> ',app.selectApps[i] );
          iconOption.titleValue = app.selectApps[i].name;
          iconOption.link = "nav";
          iconOption.linkValue = app.selectApps[i].path;
          iconOption.src = app.selectApps[i].icon;

          this.addIcon(iconOption);
        }
      }
      this.close();
    },
    close() {
      this.$emit("close");
    },
    // 添加单图标组件
    addIcon(icon) {
      let random =
        Math.floor(Math.random() * 50) * Math.floor(Math.random() * 100);
      this.addCard(
        {
          name: "myIcons",
          id: Date.now() - random,
          customData: { iconList: [{ ...icon }] },
        },
        this.desk
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
