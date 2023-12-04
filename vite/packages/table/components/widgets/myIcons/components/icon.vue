<template>
  <div class="box cursor-pointer rounded-xl xt-hover black xt-base-btn flex-col justify-around" :data-index="index"
    @click.stop="iconClick($event)" :style="[iconSize]">
    <div class="xt-text overflow-hidden no-drag flex items-center justify-center rounded-xl w-full"
      :style="[bgSize, backgroundState]" :data-index="index">
      <img v-if="src && src.length > 0" :src="renderIcon(src)" alt="" :style="[imgSize, radiusState, imgStateStyle]"
        :data-index="index" />
    </div>
    <div v-if="isTitle" class="text-center xt-text h-5 truncate mx-auto" :style="[textSize]" :data-index="index">
      {{ titleValue }}
    </div>
  </div>

  <XtGuided v-if="visible" @close="visible = false"></XtGuided>
</template>

<script>
import { message } from "ant-design-vue";
import editProps from "../hooks/editProps";
import { sizeValues } from "./iconConfig";
import {renderIcon} from '../../../../js/common/common'
export default {
  mixins: [editProps],
  props: {
    isReSize: { type: Boolean, default: false },
    state: { type: Boolean, default: false },
    index: { type: Number },
  },
  data() {
    return {
      visible: false,
    };
  },
  computed: {
    // 动态切换圆角状态
    radiusState() {
      if (this.state) return;
      if (this.isRadius)
        return {
          borderRadius: this.radius + "%",
        };
      else return { borderRadius: "0px" };
    },
    // 动态切换背景状态
    backgroundState() {
      if (this.state) return;
      if (this.isBackground) return { background: this.backgroundColor };
      else return { background: "none" };
    },
    iconSize() {
      return this.getSizeValues(this.size).iconSize;
    },
    textSize() {
      let textSize = this.getSizeValues(this.size).textSize;
      if (this.size == "icons1" || this.size == "icons2") {
        textSize["font-size"] = "12px";
        textSize["margin-top"] = "4px";
      } else {
        textSize["font-size"] = "14px";
      }
      return textSize;
    },
    imgSize() {
      return this.getSizeValues(this.size).imgSize;
    },
    bgSize() {
      return this.getSizeValues(this.size).bgSize;
    },
    imgStateStyle() {
      return {
        "object-fit": this.imgState,
      };
    },
  },
  watch: {
    imgShape(newV) { },
  },
  methods: {
    renderIcon,
    getSizeValues(size) {
      if (this.isReSize) {
        size = "mini";
      }

      let { w, h } = sizeValues[size];

      let imgW = sizeValues[size][this.imgShape].w;
      let imgH = sizeValues[size][this.imgShape].h;

      if (this.imgShape !== "square") {
        imgH = this.isTitle ? imgH : imgH + 20;
      }
      let bgH =
        this.size == "icons1" || this.size == "icons2"
          ? imgH
          : this.isTitle
            ? h - 20
            : h;
      return {
        bgSize: {
          width: `${w}px`,
          height: `${bgH}px`,
        },
        iconSize: {
          width: `${w}px`,
          height: `${h}px`,
        },
        textSize: {
          width: `${w - 20}px`,
          "font-size": "1px",
        },
        imgSize: {
          width: `${imgW}px`,
          height: `${imgH}px`,
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
    closeModal() {
      window.open("https://www.apps.vip/download/");
      this.visible = false;
    },
    // 单图标点击
    iconClick(event) {
      if (event.ctrlKey && event.button === 0) {
        this.$emit("custom-event");
        return;
      }
      // 先检测是不是web端
      // if (!this.$isXT) {
      //   let arr = ["default", "internal", "thinksky"];
      //   if (this.link == "link" && arr.includes(this.open.type)) {
      //     window.open(this.open.value);
      //   } else {
      //     this.visible = true;
      //   }
      //   return;
      // }

      if (this.open !== undefined && this.open.value !== "") {
        // 链接
        console.log("lianjie :>> ");
        this.newOpenApp();
      } else if (this.link !== "") {
        // 其他应用
        this.openApp(this.linkValue);
      } else message.error("你还未设置链接/快捷方式");
    },
    // 复制来到 旧版打开app
    openApp() {
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
