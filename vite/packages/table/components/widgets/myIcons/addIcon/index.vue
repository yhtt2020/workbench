<template>
  <div class="w-full h-full" @click="close()"></div>
  <div
    class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 p-3 xt-modal rounded-xl"
    style="width: 728px"
  >
    <header
      class="flex items-center justify-center h-12 w-full relative text-lg"
    >
      批量导入图标
      <div
        class="absolute rounded-xl xt-bg-2 flex items-center justify-center right-0 cursor-pointer h-12 w-12"
      >
        <div class="text" style="color: #fff">· · ·</div>
      </div>
    </header>
    <main class="border border-blue-400 flex" style="height: 500px">
      <div
        class="pr-2"
        style="width: 120px; border-right: 1px solid var(--divider)"
      >
        <div
          class="flex justify-center items-center rounded-xl cursor-pointer h-12"
          v-for="item in navList"
          :key="item.name"
          @click="navName = item.name"
          :class="{ 'xt-bg-2': item.name == navName }"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="w-full pl-2" style="height: 460px">
        <!-- <div class="flex container" style="width: 600px; overflow-x: auto">
          <div v-for="item in 50">{{ item }}</div>
        </div> -->
        <Apps ref="apps"></Apps>
      </div>
    </main>
    <footer class="flex items-center justify-center">
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
import Apps from "./apps.vue";
import { cardStore } from "../../../../store/card.ts";
import { myIcons } from "../../../../store/myIcons.ts";
import { mapActions, mapWritableState } from "pinia";

export default {
  props: ["desk"],
  components: {
    Apps,
  },
  data() {
    return {
      navList: [{ name: "网址导航" }, { name: "我的应用" }],
      navName: "网址导航",
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
      this.iconList = [];
      if (app.selectApps.length !== 0) {
        for (let i = 0; i < app.selectApps.length; i++) {
          let iconOption = { ...this.iconOption };
          iconOption.titleValue = app.selectApps[i].name;
          iconOption.link = "nav";
          iconOption.linkValue = app.selectApps[i].path;
          iconOption.src = app.selectApps[i].icon;
          // this.pushIcons(iconOption);
          this.addIcon(iconOption);
        }
      }
      this.close();
    },
    close() {
      this.$emit("close");
    },
    pushIcons(item) {
      // setTimeout(() => {
      //   this.addIcon(item)
      // }, 0.1);
      requestAnimationFrame(() => {
        setTimeout(this.addIcon(item), 0); // 设置更短的延迟时间
      });
    },
    generateSnowflakeId() {
      const timestamp = Date.now().toString(); // 获取当前时间戳并转换为字符串
      const randomPart = Math.floor(Math.random() * 10000).toString(); // 生成一个随机数并转换为字符串
      const snowflakeId = timestamp + randomPart; // 组合时间戳和随机数作为雪花 ID
      return snowflakeId;
    },
    // 添加单图标组件
    addIcon(icon) {
      // let random =
      //   Math.floor(Math.random() * 10) * Math.floor(Math.random() * 50);
      let random = 0;
      this.addCard(
        {
          name: "myIcons",
          id:
            Date.now() -
            Math.floor(Math.random() * 50) * Math.floor(Math.random() * 100),
          // id:this.generateSnowflakeId(),
          customData: { iconList: [{ ...icon }] },
        },
        this.desk
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
