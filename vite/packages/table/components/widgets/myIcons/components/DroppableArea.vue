<template>
  <div
    class="droppable"
    @mouseup="handleDrop"
    @mouseleave="handleLeave"
    @mouseover="handleHover"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    // 处理放置事件
    handleDrop(event) {
      this.$emit("drop", event);
    },

    // 处理离开事件
    handleLeave() {
      this.$emit("leave");
    },

    // 处理鼠标经过事件
    handleHover(event) {
      console.log("2 :>> ", 2);
      this.$emit("hover", event);
    },
  },
};
</script>
