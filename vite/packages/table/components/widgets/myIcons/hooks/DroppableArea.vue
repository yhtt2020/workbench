<!-- DroppableArea.vue -->

<template>
    <div class="droppable" @mouseup="handleDrop">
        <slot></slot>
    </div>
</template>
<script>
export default {
    methods: {
        // 处理放置事件
        handleDrop() {
            this.$emit('drop');
        },
    },
};
</script>
  
<style scoped>
/* 样式定义 */
.droppable {
    /* width: 100%;
    height: 200px; */
}
</style>
  