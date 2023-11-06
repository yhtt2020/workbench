<template>
  <!-- 可拖拽元素 -->
  <div
    ref="draggable"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @click="handleClick"
    class="draggable"
  >
    <slot></slot>
  </div>
  <teleport to="body">
    <!-- 拖拽元素 -->
    <div v-show="isDragging" class="follow-container">
      <div
        ref="follow"
        class="follow"
        :style="{
          transform: `translate(${followPosition.x - followWidth / 2}px, ${
            followPosition.y - followHeight / 2
          }px)`,
          width: `${followWidth}px`,
          height: `${followHeight}px`,
        }"
      >
        <template v-if="isSelect && length > 1">
          <div class="icons">{{ length }}</div>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </div>
    </div>
  </teleport>
</template>

<script>
import { mapWritableState, mapActions } from "pinia";
import { cardStore } from "../../../../store/card";
import { useFreeLayoutStore } from "../../../desk/freeLayout/store";
export default {
  emits: ["drag-start", "drag-end", "click"],
  data() {
    return {
      isDragging: false,
      followPosition: { x: 0, y: 0 },
      followWidth: 0,
      followHeight: 0,
      dragStartTimer: null,
      draggedElement: null,
      tempContainer: null,
    };
  },
  props: {
    isSelect: { type: Boolean },
    length: { type: Number },
  },
  computed: {
    ...mapWritableState(cardStore, ["currentDeskId"]),
  },
  methods: {
    ...mapActions(useFreeLayoutStore, ["isFreeLayout"]),
    // 鼠标按下事件处理方法
    handleMouseDown(event) {
      if (this.isFreeLayout) return;
      this.followPosition = { x: event.clientX, y: event.clientY }; // 初始化拖拽元素坐标
      event.preventDefault();
      event.stopPropagation();
      this.dragStartTimer = setTimeout(() => {
        document.body.style.cursor = "move"; // 拖拽手指
        this.$emit("drag-start", event);
        event.preventDefault();
        event.stopPropagation();
        this.isDragging = true; // 打开拖拽状态

        // 获取可拖拽元素并创建拖拽元素
        let draggableElement;
        if (this.isSelect) {
          draggableElement = document.querySelector(".icons");
        } else {
          draggableElement = this.$refs.draggable;
        }
        const draggableRect = draggableElement.getBoundingClientRect();

        this.followWidth = draggableRect.width;
        this.followHeight = draggableRect.height;
        if (this.isSelect && this.length > 1) {
          this.followWidth = 56;
          this.followHeight = 56;
        }

        // 创建拖拽元素
        this.draggedElement = document.createElement("div");
        this.draggedElement.classList.add("follow");
        // this.draggedElement.style.width = this.followWidth + "px";
        // this.draggedElement.style.height = this.followHeight + "px";

        // this.draggedElement.style.width = 135 + "px";
        // this.draggedElement.style.height = 135 + "px";

        this.draggedElement.style.pointerEvents = "none"; // 防止拖拽元素干扰鼠标事件

        // 将拖拽元素添加到文档中
        document.body.appendChild(this.draggedElement);
      }, 1000);

      // 监听鼠标移动和抬起事件
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
    },
    // 鼠标抬起事件处理方法
    handleMouseUp() {
      clearTimeout(this.dragStartTimer);
      document.removeEventListener("mousemove", this.handleMouseMove);
      this.dragStartTimer = null;
      if (this.isDragging) {
        this.isDragging = false;
        // 触发拖拽结束事件
        this.$emit("drag-end");
        if (this.draggedElement) {
          this.draggedElement.remove();
          this.draggedElement = null;
        }
        document.body.style.cursor = "default";
      }

      // 移除鼠标移动和抬起事件监听
      document.removeEventListener("mousemove", this.handleMouseMove);
      document.removeEventListener("mouseup", this.handleMouseUp);
    },
    // 鼠标移动事件处理方法
    handleMouseMove(event) {
      if (this.isDragging) {
        this.followPosition = {
          x: event.clientX,
          y: event.clientY,
        };
      }
    },
    // 点击事件处理方法
    handleClick(event) {
      if (!this.isDragging) {
        // this.$emit("iconClick");
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 监听鼠标移动和抬起事件
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("mouseup", this.handleMouseUp);
      this.tempContainer = document.querySelector("body");
    });
  },
  beforeDestroy() {
    // 移除事件监听和定时器
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    clearTimeout(this.dragStartTimer);
  },
};
</script>

<style scoped>
.follow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999999999;
}

.follow {
  position: absolute;
  pointer-events: none;
  /* zoom: 0.66; */
  z-index: 999999999;
}

.icons {
  color: var(--primary-text);
  background: var(--primary-bg);
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  border-radius: 12px;
}
</style>
