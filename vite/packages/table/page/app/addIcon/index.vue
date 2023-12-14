<template>
  <xt-modal @no="close()" title="批量添加图标" :modelValue="1"  :footer="false">
    <main class="flex h-full p-1" style="min-width: 200px !important">
      <div style="" class="h-full">
        <div
          class="overflow-y-auto xt-container"
          style="border-right: 1px solid var(--divider)"
          :style="leftTabHeight"
        >
          <div
            :style="{
              'border-right':
                item.component == name ? '1px solid var(--active-bg)' : '',
            }"
            v-for="item in navList"
          >
            <div
              class="flex items-center justify-center h-12 mr-2 cursor-pointer rounded-xl w-120"
              :key="item.name"
              @click="name = item.component"
              :class="{ 'xt-bg-2': item.component == name }"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-full h-full pl-2">
        <xt-task :modelValue="m02013"></xt-task>
        <component
          ref="apps"
          :is="name"
          :type="type"
          @updateData="updateData"
        ></component>
      </div>
    </main>
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
            <img :src="renderIcon(item.icon)" class="w-12 h-12 mr-3 rounded-xl" alt="" />
          </div>
        </template>
      </div>
    </div>
    <footer class="flex items-center justify-center mt-2">
      <XtTab
        v-if="name == 'Links'"
        style="width: 380px; height: 48px"
        boxClass="my-2 p-1 xt-bg-2"
        v-model:modelValue="type"
        :list="linkList"
      ></XtTab>
      <xt-task id="M0201" no="5" @cb="commitIcons">
        <XtButton type="theme" class="ml-2" @click="commitIcons()">
          确认
        </XtButton>
      </xt-task>
    </footer>
  </xt-modal>
</template>

<script>
import Links from "./modules/Links.vue";
import MyApps from "./modules/MyApps.vue";
import Desktop from "./modules/Desktop.vue";
import QingApps from "./modules/QingApps.vue";
import { cardStore } from "../../../store/card.ts";
import { myIcons } from "../../../store/myIcons.ts";
import { scrollable } from "./hooks/scrollable";
import { mapActions, mapWritableState } from "pinia";
import { useBase64AsImage } from "../../../../table/components/card/hooks/base64";
import { taskStore } from "../../../apps/task/store";
import {renderIcon} from '../../../js/common/common'
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
      name: this.navName,
      screenWidth: 0,
      screenHeight: 0,
      selectApps: {},
      type:"default",
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
    ...mapWritableState(taskStore, ["taskID", "step"]),
    m02013() {
      if (this.taskID == "M0201" && this.step == 3) {
        this.name = "Desktop";
        return this.taskID == "M0201"
      }
    },

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
      if (this.name == "Links") w += 128;
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
    console.log('初始化');
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
    renderIcon,
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
        this.selectApps[key].forEach(async (item) => {
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
