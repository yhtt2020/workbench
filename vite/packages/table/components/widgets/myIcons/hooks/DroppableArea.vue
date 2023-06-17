<template>
    <div @mouseup="handleDrop">
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
</style>
  
