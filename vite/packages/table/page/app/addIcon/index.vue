<template>
  <!-- 遮罩 -->
  <div
    class="w-full h-full xt-mask-2 fixed top-0 left-0"
    @click="close()"
  ></div>
  <!-- 添加图标 -->
  <div
    class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 p-3 xt-modal rounded-xl xt-text"
    style="box-shadow: 0px 0px 10px 0px rgb(0 0 0 / 50%)"
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
    <main class="flex mt-3 h-full" style="">
      <!-- 左侧 -->
      <div style="" class="h-full">
        <div
          class="overflow-y-auto xt-container"
          style="border-right: 1px solid var(--divider)"
          :style="height"
        >
          <div
            :style="{
              'border-right':
                item.component == navName ? '1px solid var(--active-bg)' : '',
            }"
            v-for="item in navList"
          >
            <div
              class="flex justify-center items-center rounded-xl cursor-pointer h-12 w-120 mr-2"
              :key="item.name"
              @click="navName = item.component"
              :class="{ 'xt-bg-2': item.component == navName }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="pl-2 w-full h-full">
        <slot> <component ref="apps" :is="navName"></component></slot>
      </div>
    </main>
    <!-- 底部 -->
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
import Links from "./modules/Links.vue";
import MyApps from "./modules/MyApps.vue";
import Desktop from "./modules/Desktop.vue";
import QingApps from "./modules/QingApps.vue";
import { cardStore } from "../../../store/card.ts";
import { myIcons } from "../../../store/myIcons.ts";
import { mapActions, mapWritableState } from "pinia";
export default {
  emits: ["update:navName"],
  props: {
    desk: {},
    navList: {
      type: Array,
      default: () => {
        return [
          { name: "网址导航", component: "Links" },
          { name: "我的应用", component: "MyApps" },
          { name: "桌面图标", component: "Desktop" },
          { name: "轻应用", component: "QingApps" },
        ];
      },
    },
    navName: {
      type: String,
      default: "Links",
    },
  },
  data() {
    return {
      screenHeight: 0,
    };
  },
  components: {
    Links,
    MyApps,
    Desktop,
    QingApps,
  },
  watch: {
    navName: {
      deep: true,
      handler(newValue, old) {
        this.$emit("update:navName", newValue);
      },
    },
  },
  computed: {
    ...mapWritableState(myIcons, ["iconOption", "iconList"]),
    height() {
      let h = 48;
      if (this.screenHeight > 901) {
        h += 415;
      } else if (this.screenHeight > 600) {
        h += 272;
      } else {
        h += 136;
      }
      return {
        height: `${h}px`,
      };
    },
  },
  mounted() {
    this.screenHeight =
      window.innerHeight || document.documentElement.clientHeight;
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions(cardStore, ["addCard"]),
    handleResize() {
      this.screenHeight =
        window.innerHeight || document.documentElement.clientHeight;
    },
    close() {
      this.$emit("close");
    },
    async commitIcons() {
      if (!this.desk) {
        this.$emit("getSelectApps");
        this.close();
        return;
      }
      let app = this.$refs.apps;
      console.log(" app.selectApps 2222222 :>> ", app.selectApps[0].open);
      // return
      if (app.selectApps.length !== 0) {
        for (let i = 0; i < app.selectApps.length; i++) {
          let iconOption = { ...this.iconOption };
          iconOption.titleValue = app.selectApps[i].name;
          iconOption.link = app.selectApps[i].link || "fast";
          iconOption.src = app.selectApps[i].icon;
          if (app.selectApps[i].open) {
            iconOption.open = app.selectApps[i].open;
          } else {
            iconOption.linkValue = app.selectApps[i].path;
          }
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
