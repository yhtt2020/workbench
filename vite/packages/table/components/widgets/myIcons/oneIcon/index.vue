<template>
  <div
    class="item xt-text xt-hover no-drag"
    @click="iconClick($event)"
    :data-index="index"
  >
    <div class="image" :style="[backgroundState]" :data-index="index">
      <img
        :src="src"
        alt=""
        :style="radiusState"
        style="object-fit: cover"
        :data-index="index"
      />
    </div>
    <div class="title" :data-index="index">{{ titleValue }}</div>
  </div>
</template>

<script>
import { message } from "ant-design-vue";
export default {
  props: {
    isRadius: { type: Boolean },
    radius: { type: Number },
    isBackground: { type: Boolean },
    backgroundColor: { type: String },
    titleValue: { type: String },
    link: { type: String },
    linkValue: {},
    open: {},
    src: { type: String },
    backgroundIndex: { type: Number },
    index: { type: Number },
  },
  computed: {
    // 动态切换圆角状态
    radiusState() {
      if (this.isRadius) return { borderRadius: this.radius + "px" };
      else return { borderRadius: "0px" };
    },
    // 动态切换背景状态
    backgroundState() {
      if (this.isBackground) return { background: this.backgroundColor };
      else return { background: "none" };
    },
  },
  methods: {
    openBrowser() {
      switch (this.open.type) {
         // 默认浏览器
         case "default":
          browser.openInSystem(this.linkValue);
          break;
        // 嵌入浏览器
        case "internal":
          browser.openInTable(this.linkValue);
          break;
        // 想天浏览器
        case "thinksky":
          browser.openInInner(this.linkValue);
          break;
        default:
          console.log("错误啦！~");
      }
    //  return
      switch (this.link.type) {
        // 轻应用
        case "lightApp":
          ipc.send("executeAppByPackage", {
            package: this.link.value,
          });
          break;
        // 酷应用
        case "coolApp":
          this.$router.push({ name: "app", params: this.linkValue.data });
          break;
        case "systemApp":
          if (this.linkValue.event === "fullscreen") {
            // 这里
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

        case "localApp":
          require("electron").shell.openPath(this.linkValue.path);
          break;
        default:
          require("electron").shell.openPath(this.linkValue.path);
      }
    },
    // 单图标点击
    iconClick(event) {
      if (event.ctrlKey && event.button === 0) {
        this.$emit("custom-event");
        return;
      }
      if (this.link === "link") {
        // 链接
        this.$emit("onIconClick");
        this.openBrowser()
      } else if (this.link === "fast" || this.link === "nav") {
        // 其他应用
        this.$emit("onIconClick");
        this.openApp(this.linkValue);
      } else message.error("你还未设置链接/快捷方式");
    },
    // 打开app 里面有需要注意查看的
    openApp() {
      this.$emit("onIconClick");
      if (typeof this.linkValue === "object" && this.linkValue.type) {
        switch (this.linkValue.type) {
          case "systemApp":
            if (this.linkValue.event === "fullscreen") {
              // 这里
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

<style lang="scss" scoped>
.item {
  width: 114px;
  height: 96px;
  border: 0px solid red;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;

  .image {
    margin-top: 10px;
    height: 56px !important;
    width: 56px !important;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 56px;
      height: 56px;
    }
  }

  .title {
    margin-top: 4px;
    padding: 0 5px;
    width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
    height: 18px;
    line-height: 18px;
  }
}
</style>
