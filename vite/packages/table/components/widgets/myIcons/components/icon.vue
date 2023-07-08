<template>
  <div class="cursor-pointer rounded-xl xt-hover" :data-index="index">
    <div
      class="xt-text no-drag flex items-center justify-center rounded-xl"
      :style="[iconSize, backgroundState]"
      style="border: 0px solid red !important"
      @click="iconClick($event)"
      :data-index="index"
    >
      <img
        :src="src"
        alt=""
        :style="[imgSize, radiusState, imgStateStyle]"
        :data-index="index"
      />
    </div>
    <div
      v-if="isTitle"
      class="text-center xt-text h-5 truncate mx-auto"
      :style="[textSize]"
      :data-index="index"
    >
      {{ titleValue }}
    </div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
import editProps from "../hooks/editProps";

export default {
  mixins: [editProps],
  props: {
    isReSize: { type: Boolean, default: false },
    index: { type: Number },
  },
  computed: {
    // 动态切换圆角状态
    radiusState() {
      if (this.isRadius)
        return {
          borderRadius: this.radius + "%",
        };
      else return { borderRadius: "0px" };
    },
    // 动态切换背景状态
    backgroundState() {
      if (this.isBackground) return { background: this.backgroundColor };
      else return { background: "none" };
    },
    iconSize() {
      return this.getSizeValues(this.size).iconSize;
    },
    textSize() {
      return this.getSizeValues(this.size).textSize;
    },
    imgSize() {
      return this.getSizeValues(this.size).imgSize;
    },
    imgStateStyle() {
      return {
        "object-fit": this.imgState,
      };
    },
  },
  methods: {
    getSizeValues(size) {
      if (this.isReSize) {
        size = "mini";
      }

      const sizeValues = {
        mini: {
          w: 134,
          h: 96,
          imgW: 66,
          imgH: 56,
          ratio: 1,
        },
        mini1: {
          w: 280,
          h: 96,
          imgW: 270,
          imgH: 66,
          ratio: 1,
        },
        small: {
          w: 280,
          h: 205,
          imgW: 270,
          imgH: 175,
          ratio: 2,
        },
        default: {
          w: 280,
          h: 420,
          imgW: 270,
          imgH: 390,
          ratio: 2,
        },
        long: {
          w: 570,
          h: 205,
          imgW: 560,
          imgH: 175,
          ratio: 2,
        },
        big: {
          w: 570,
          h: 420,
          imgW: 560,
          imgH: 390,
          ratio: 2,
        },
      };

      let { w, h, imgW, imgH, ratio } = sizeValues[size];

      h = this.isTitle ? h - 20 : h;
      imgH = this.isTitle ? imgH : imgH + 20;
      return {
        ratio: ratio,
        iconSize: {
          width: `${w}px`,
          height: `${h}px`,
        },
        textSize: {
          width: `${w - 20}px`,
        },
        imgSize: {
          width: `${imgW}px`,
          height: `${imgH}px`,
          border: "0px solid red",
        },
      };
    },
    newOpenApp() {
      switch (this.open.type) {
        // 默认浏览器
        case "default":
          browser.openInSystem(this.open.value);
          break;
        // 嵌入浏览器
        case "internal":
          browser.openInTable(this.open.value);
          break;
        // 想天浏览器
        case "thinksky":
          browser.openInInner(this.open.value);
          break;
        // 轻应用
        case "lightApp":
          ipc.send("executeAppByPackage", {
            package: this.open.value,
          });
          break;
        // 酷应用
        case "coolApp":
          this.$router.push({ name: "app", params: this.open.value });
          break;
        // 本地应用
        case "tableApp":
          require("electron").shell.openPath(
            require("path").normalize(this.open.value)
          );
          break;
        // 系统应用
        // case "systemApp":
        //   if (this.open.value.event === "fullscreen") {
        //     tsbApi.window.setFullScreen(this.full);
        //   } else if (this.open.value.event === "/status") {
        //     this.$router.push({ path: "/status" });
        //   } else if (this.linkValue.data) {
        //     this.$router.push({ name: "app", params: this.linkValue.data });
        //   } else this.$router.push({ name: this.linkValue.event });
        //   break;
        default:
          this.openApp();
      }
      return;
    },
    // 单图标点击
    iconClick(event) {
      if (event.ctrlKey && event.button === 0) {
        this.$emit("custom-event");
        return;
      }
      if (this.open !== undefined && this.open.value !== "") {
        // 链接
        this.$emit("onIconClick");
        this.newOpenApp();
      } else if (this.link !== "") {
        // 其他应用
        this.$emit("onIconClick");
        this.openApp(this.linkValue);
      } else message.error("你还未设置链接/快捷方式");
    },
    // 复制来到 旧版打开app
    openApp() {
      this.$emit("onIconClick");
      if (typeof this.linkValue === "object" && this.linkValue.type) {
        switch (this.linkValue.type) {
          case "systemApp":
            if (this.linkValue.event === "fullscreen") {
              // 这里不知道啥意思
              if (this.full) this.full = false;
              else this.full = true;
              tsbApi.window.setFullScreen(!this.full);
            } else if (this.linkValue.event === "/status") {
              if (this.$route.path === "/status") this.$router.go(-1);
              else this.$router.push({ path: "/status" });
            } else if (this.linkValue.data) {
              this.$router.push({ name: "app", params: this.linkValue.data });
            } else this.$router.push({ name: this.linkValue.event });
            break;
          case "coolApp":
            this.$router.push({ name: "app", params: this.linkValue.data });
            break;
          case "localApp":
            require("electron").shell.openPath(this.linkValue.path);
            break;
          case "lightApp":
            ipc.send("executeAppByPackage", {
              package: this.linkValue.package,
            });
            break;
          default:
            require("electron").shell.openPath(this.linkValue.path);
        }
      } else if (this.linkValue) {
        this.linkValue.path
          ? require("electron").shell.openPath(this.linkValue.path)
          : require("electron").shell.openPath(
              require("path").normalize(this.linkValue)
            );
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
