<template>
  <div
    class="boxs no-drag w-full h-full"
    ref="textRef"
    :style="{ width: w, height: h }"
  >
    <slot></slot>
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
      currentSize: this.size,
    };
  },
  props: {
    size: {
      type: String,
      default: "",
    },
    disabled: {},
    minW: {
      type: Number,
      default: 2,
    },
    minH: {
      type: Number,
      default: 2,
    },
    odd: {
      default: false,
    },
  },
  watch: {
    size(newV) {
      this.dragCallBack(newV);
    },
    currentSize(newV) {
      this.$emit("update:size", newV);
    },
  },
  mounted() {
    this.drag();
    // 初始化
    this.dragCallBack(this.size);
  },
  methods: {
    dragCallBack(e) {
      let str = e.split("x");
      let width = str[0];
      let height = str[1];
      this.w = width * 134 + (width - 1) * 12 - 28 + "px";
      this.h = height * 96 + (height - 1) * 12 - 46 - 14 + "px";
    },
    findN(value, num = 134) {
      value = parseFloat(value);
      let res = (value - (num + 12)) / (num + 12) + 1;
      return Math.round(res);
    },
    drag() {
      if (this.disabled) return;
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
            width = x - oldX + w;
            height = h - oldY + e.clientY;
            // 限制范围
            let minW = that.findN(width, 136);
            let minH = that.findN(height, 96);
            if (that.minW > minW) {
              minW = that.minW * 134 + (that.minW - 1) * 12 - 28;
            }
            if (that.minH > minH) {
              minH = that.minH * 96 + (that.minH - 1) * 12 - 28;
            }

            if (width >= minW) that.w = `${width}px`;
            else width = minW;
            if (height > minH) that.h = `${height}px`;
            else height = minH;
            let newW = that.findN(width, 136);
            let newH = that.findN(height, 96);

            if (!that.odd && newH % 2 == 1) {
              newH += 1;
            }
            if (!that.odd && newW % 2 == 1) {
              newW += 1;
            }
            name = `${newW}x${newH}`;
            that.currentSize = name;
            that.$emit("reSize", name);
          };
          document.onmouseup = function (e) {
            e.stopPropagation();
            document.onmousemove = null;
            document.onmouseup = null;
            that.currentSize = name;
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
