<template>
  <div
    class="relative flex-col items-center justify-around cursor-pointer box rounded-xl xt-hover black xt-base-btn"
    :data-index="index"
    @click.stop="iconClick($event)"
    :style="[iconSize]"
  >
    <xt-mix-icon
      :type="isIfy"
      v-model:icon="src"
      :w="imgW"
      :h="imgH"
      :boxW="bgW"
      :boxH="bgH"
      :bg="bg"
      :r="r"
      :style="{ borderRadius: '12px', background: bg }"
      :iconStyle="{ borderRadius: r, ...imgStateStyle }"
      :class="''"
    />
    <img
      src="/public/icons/tag.png"
      alt=""
      class="absolute w-[30px]"
      style="top: 1px; right: -2px"
      v-if="isIfy === 'ify'"
    />
    <div
      v-if="isTitle"
      class="flex-1 mx-auto text-center xt-text items-center"
      :style="[textSize]"
      :data-index="index"
    >
      <div class="wf truncate text-shadow">
        {{ titleValue }}
      </div>
    </div>
  </div>

  <XtGuided v-if="visible" @close="visible = false"></XtGuided>
</template>

<script>
import { message } from "ant-design-vue";
import editProps from "../hooks/editProps";
import { sizeValues } from "./iconConfig";
import { renderIcon } from "../../../../js/common/common";
import { startApp } from "../../../../ui/hooks/useStartApp";
import { checkIsIfyIcon } from "../../../card/hooks/addCardToNav";
export default {
  mixins: [editProps],
  props: {
    isReSize: { type: Boolean, default: false },
    state: { type: Boolean, default: false },
    index: { type: Number },
    newIcon: { type: Boolean },
    edit: {
      default: false,
    },
  },
  // 卡片类图标打开其卡片弹窗
  emits: ["openCard","customEvent","onEdit"],
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
    // 单图标大小 -- 当为ify图标时，控制宽度
    iconSize() {
      // return this.isIfy == "ify" ? this.getSizeValues(this.size).imgSize : this.getSizeValues(this.size).iconSize;
      if (this.isIfy == "ify") {
        return {
          width: this.getSizeValues(this.size).imgSize.width,
          height: this.getSizeValues(this.size).iconSize.height,
        };
      }
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
    imgStateStyle() {
      return {
        "object-fit": this.imgState,
      };
    },
    r() {
      if (this.isRadius) return this.radius + "px";
    },
    bg() {
      if (this.isBackground) return this.backgroundColor;
    },
    imgSize() {
      return this.getSizeValues(this.size).imgSize;
    },
    bgSize() {
      return this.getSizeValues(this.size).bgSize;
    },
    // 为了适配新版
    imgH() {
      let h = parseInt(this.getSizeValues(this.size).imgSize.height);
      h = this.isIfy == "ify" ? h / 2 : h;
      return h;
    },
    imgW() {
      let w = parseInt(this.getSizeValues(this.size).imgSize.width);
      w = this.isIfy == "ify" ? w / 2 : w;
      return w;
    },
    bgW() {
      let w =
        this.isIfy == "ify"
          ? parseInt(this.getSizeValues(this.size).imgSize.width)
          : parseInt(this.getSizeValues(this.size).bgSize.width);
      return w;
    },
    bgH() {
      let h =
        this.isIfy == "ify"
          ? parseInt(this.getSizeValues(this.size).imgSize.height)
          : parseInt(this.getSizeValues(this.size).bgSize.height);
      return h;
    },
    fit() {
      return this.imgState;
    },
    isIfy() {
      return checkIsIfyIcon(this.src).value ? "ify" : "select";
    },
  },
  watch: {
    imgShape(newV) {},
  },
  methods: {
    checkIsIfyIcon,
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
          width: this.isIfy == "ify" ? "" : `${w - 20}px`,
          "font-size": "1px",
        },
        imgSize: {
          width: `${imgW}px`,
          height: `${imgH}px`,
        },
      };
    },
    newOpenApp(TYPE, VALUE) {
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
          console.log("object :>> ", this.open.value);
          startApp("localApp", this.open.value);
          // require("electron").shell.openPath(
          //   require("path").normalize(this.open.value)
          // );
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
    startApp,
    // 单图标点击
    iconClick(event) {
      if (event.ctrlKey && event.button === 0) {
        this.$emit("customEvent");
        return;
      }

      if (this.edit)
      {
        this.$emit('onEdit')
        return;
      }

      if (this.newIcon) {
        console.log(this.newIcon, "open");
        console.log("this.open.type :>> ", this.open.type);
        console.log("this.open.type :>> ", this.open.value);
        this.startApp(this.open.type, this.open.value, this.$router);
      } else if (this.open !== undefined && this.open.value !== "") {
        // 链接
        console.log("lianjie :>> ");
        if (this.open.type === "card") {
          console.log("this.open.value :>> ", this.open.value);
          this.$emit("openCard");
          return;
        }
        // this.newOpenApp();
        this.startApp(this.open.type, this.open.value, this.$router);
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
            startApp("localApp", this.linkValue.path); //require("electron").shell.openPath(this.linkValue.path);
            break;
          case "lightApp":
            ipc.send("executeAppByPackage", {
              package: this.linkValue.package,
            });
            break;
          default:
            startApp("localApp", this.linkValue.path); // require("electron").shell.openPath(this.linkValue.path);
        }
      } else if (this.linkValue) {
        this.linkValue.path
          ? startApp("localApp", this.linkValue.path)
          : startApp("localApp", require("path").normalize(this.linkValue));
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
