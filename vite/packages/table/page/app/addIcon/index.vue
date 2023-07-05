<template>
  <!-- 遮罩 -->
  <div
    class="h-full w-full xt-mask-2 fixed top-0 left-0"
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
    <main class="flex mt-3 h-full" >
      <!-- 左侧 -->
      <div style="" class="h-full">
        <div
          class="overflow-y-auto xt-container"
          style="border-right: 1px solid var(--divider)"
          :style="leftTabHeight"
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
        <component
          ref="apps"
          :is="navName"
          :type="type"
          @updateData="updateData"
        ></component>
      </div>
    </main>
    <!-- 底部 -->
    <div class="flex items-center my-3" v-if="selectAppsLenght">
      <div style="width: 130px" class="flex justify-end">
        已选 {{ selectAppsLenght }} ：
      </div>
      <div
        class="flex overflow-x-auto xt-container"
        v-scrollable
        :style="selectedWidth"
      >
        <template v-for="(v, k) of selectApps">
          <div v-for="item in selectApps[k]">
            <img :src="item.icon" class="w-12 h-12 rounded-xl mr-3" alt="" />
          </div>
        </template>
      </div>
    </div>
    <footer class="flex items-center justify-center mt-2">
      <Tab
        v-if="navName == 'Links'"
        style="width: 380px; height: 48px; font-size: 18px"
        v-model:data="type"
        :list="linkList"
      ></Tab>
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
import { scrollable } from "./hooks/scrollable";
import Tab from "../../../components/card/components/tab/index.vue";
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
  provide() {
    return {
      width: () => {
        return this.width;
      },
      height: () => {
        return this.height;
      },
    };
  },
  data() {
    return {
      screenWidth: 0,
      screenHeight: 0,
      selectApps: {},
      type: "internal",
      linkList: [
        {
          value: "internal",
          name: "工作台内打开",
        },
        {
          value: "thinksky",
          name: "想天浏览器",
        },
        {
          value: "default",
          name: "系统默认",
        },
      ],
    };
  },
  directives: {
    scrollable,
  },
  components: {
    Links,
    MyApps,
    Desktop,
    QingApps,
    Tab,
  },
  watch: {
    navName: {
      deep: true,
      handler(newValue, old) {
        this.selectApps = {};
        this.$emit("update:navName", newValue);
      },
    },
  },
  computed: {
    ...mapWritableState(myIcons, ["iconOption", "iconList"]),
    height() {
      let h = this.screenHeight;
      if (h > 901) return 415;
      else if (h > 600) return 272;
      else return 136;
    },
    leftTabHeight() {
      let h = this.height;
      return {
        height: `${h + 60}px`,
      };
    },
    selectedWidth() {
      let w = this.width;
      if (this.navName == "Links") w += 128;
      return {
        width: w + 8 + "px",
      };
    },
    width() {
      let w = this.screenWidth;
      if (w > 1024) return 566;
      else if (w > 768) return 424;
      else return 282;
    },
    selectAppsLenght() {
      let i = 0;
      for (let key in this.selectApps) {
        this.selectApps[key].forEach(() => i++);
      }
      return i;
    },
  },
  mounted() {
    this.screenHeight =
      window.innerHeight || document.documentElement.clientHeight;
    this.screenWidth =
      window.innerWidtht || document.documentElement.clientWidth;
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions(cardStore, ["addCard"]),
    updateData(data) {
      this.selectApps = data;
    },
    handleResize() {
      this.screenHeight =
        window.innerHeight || document.documentElement.clientHeight;
      this.screenWidth =
        window.innerWidtht || document.documentElement.clientWidth;
    },
    close() {
      this.$emit("close");
    },
    // 提交icon 并格式化数据
    async commitIcons() {
      if (!this.desk) {
        this.$emit("getSelectApps", this.selectApps);
        this.close();
        return;
      }
      for (let key in this.selectApps) {
        this.selectApps[key].forEach((item) => {
          let iconOption = { ...this.iconOption };
          iconOption.titleValue = item.name;
          iconOption.link = item.link || "fast";
          iconOption.src = item.icon;
          if (item.open) {
            iconOption.open = item.open;
          } else {
            iconOption.linkValue = item.path;
          }
          this.addIcon(iconOption);
        });
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
