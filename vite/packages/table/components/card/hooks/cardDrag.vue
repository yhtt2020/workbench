<template>
  <div
    class="boxs no-drag"
    ref="textRef"
    style="margin-top: 8px"
    :style="{ width: w, height: h }"
  >
    <slot :row="1123"></slot>
    <svg
      @mousedown.stop
      t="1684744355055"
      ref="dragRef"
      class="icon drag-boxs no-drag"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="10063"
    >
      <path
        d="M469.333333 256a85.333333 85.333333 0 1 1-85.333333-85.333333 85.333333 85.333333 0 0 1 85.333333 85.333333z m-85.333333 170.666667a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m256-341.333334a85.333333 85.333333 0 1 0-85.333333-85.333333 85.333333 85.333333 0 0 0 85.333333 85.333333z m0 85.333334a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z"
        p-id="10064"
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      w: "100%",
      h: "360px",
    };
  },
  props: {
    className: {
      type: String,
      default: "1",
    },
  },
  mounted() {
    this.drag();
  },
  methods: {
    dragCallBack(e) {
      if (e == "card1") {
        this.w = `${540}px`;
        this.h = `${140}px`;
      } else if (e == "card double") {
        this.w = `${542}px`;
        this.h = `${360}px`;
      } else if (e == "card") {
        this.w = `${250}px`;
        this.h = `${360}px`;
      } else if (e == "card small") {
        this.w = `${250}px`;
        this.h = `${140}px`;
      } else if (e) {
        let str = e.split(",");
        let width = Math.round(str[0] / 280);
        let height = Math.round(str[1] / 205);
        this.w = width * 280 + (width - 1) * 10 - 30 + "px";
        this.h = height * 205 + (height - 1) * 10 - 60 + "px";
      }
    },
    drag() {
      let that = this;
      let a = this.$refs.textRef;
      let dragRef = this.$refs.dragRef;
      let name = "";
      dragRef.addEventListener(
        "mousedown",
        (el) => {
          el.stopPropagation();
          el.preventDefault();
          let oldX = el.clientX;
          let oldY = el.clientY;
          let h = a.clientHeight;
          let w = a.clientWidth;
          let width, height;
          document.onmousemove = function (e) {
            e.stopPropagation();
            let x = e.clientX;
            let y = e.clientY;
            width = x - oldX + w;
            height = h - oldY + y;
            if (width > 250) that.w = `${width}px`;
            if (height > 140) that.h = `${height}px`;
            name = `${width},${height}`;
            height = height > 140 ? height : 140;
            width = width > 250 ? width : 250;
            that.$emit("reSizeInit", `${width},${height}`);
          };
          document.onmouseup = function (e) {
            e.stopPropagation();
            document.onmousemove = null;
            document.onmouseup = null;
            that.dragCallBack(name);
          };
        },
        { capture: true }
      );
    },
  },
  beforeUnmount() {
    let dragRef = this.$refs.dragRef;
    dragRef.removeEventListener("mousedown", () => {});
  },
};
</script>

<style lang="scss" scoped>
.drag-boxs {
  width: 20px;
  height: 20px;
  z-index: 99999999999999;
  position: absolute;
  bottom: 0;
  right: 0;
  color: var(--primary-text);
  cursor: move;
  display: none;
}

.boxs:hover .drag-boxs {
  display: block;
}

.boxs {
  position: relative;
}
</style>
