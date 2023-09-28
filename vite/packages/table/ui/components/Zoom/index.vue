<template>
  <div
    class="relative no-drag"
    ref="boxRef"
    :style="{ width: w, height: h }"
    style="margin-top: 2px"
  >
    <slot></slot>
    <svg
      @mousedown.stop
      t="1684744355055"
      ref="dragRef"
      class="icon drag-boxs absolute no-drag"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="10063"
      style="bottom: 4px; right: 4px"
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
      w: "280px",
      h: "204px",
    };
  },
  watch: {
    w: {
      handler(newV) {
        this.$emit("update:width", newV);
      },
      // immediate: true,
    },
    h: {
      handler(newV) {
        this.$emit("update:height", newV);
      },
      // immediate: true,
    },
  },
  props: {
    width: {},
    hieght: {},
  },
  mounted() {
    this.drag();
  },
  methods: {
    dragCallBack(e) {
      let str = e.split(",");
      let width = Math.round(str[0] / 280);
      let height = Math.round(str[1] / 205);
      // this.w = width * 280 + (width - 1) * 10 - 30 + "px";
      // this.h = height * 205 + (height - 1) * 10 - 60 + "px";
      this.w = width * 280 + (width - 1) * 10 + "px";
      this.h = height * 204 + (height - 1) * 10 + "px";
    },
    drag() {
      let that = this;
      let boxRef = this.$refs.boxRef;
      let dragRef = this.$refs.dragRef;
      let name = "";
      dragRef.addEventListener(
        "mousedown",
        (el) => {
          el.stopPropagation();
          el.preventDefault();
          let oldX = el.clientX;
          let oldY = el.clientY;
          let h = boxRef.clientHeight;
          let w = boxRef.clientWidth;
          let width, height;
          document.onmousemove = function (e) {
            e.stopPropagation();
            let x = e.clientX;
            let y = e.clientY;
            width = x - oldX + w;
            height = h - oldY + y;
            if (width > 260) that.w = `${width}px`;
            if (height > 204) that.h = `${height}px`;
            width = width > 260 ? width : 260;
            height = height > 204 ? height : 204;
            name = `${width},${height}`;
            // 与外界同步窗口
            // that.$emit("reSizeInit", `${width},${height}`);
          };
          // 结束拖拽
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
};
</script>

<style lang="scss" scoped>
.drag-boxs {
  width: 20px;
  height: 20px;
  z-index: 99999999999999;

  bottom: 0;
  right: 0;
  color: #a09898;
  cursor: move;
}

.drag-boxs:hover {
  color: #fff;
}
</style>
