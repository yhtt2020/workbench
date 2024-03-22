<template>
  <!-- 应用模式中的拖拽 -->
  <div
    class="w-full h-full rounded-xl"
    @drop.prevent.stop="handleDrop"
    @dragenter.prevent.stop="handleDragenter"
    @dragleave.prevent.stop="handleDragleave"
    @dragover.prevent
    ref="linkDrop"
  >
    <slot></slot>
  </div>
</template>

<script setup>

// 处理drop放置
const handleDrop = (dragEvent) =>{
  let link = dragEvent.dataTransfer.getData('text/plain');
  console.log('放置',link);
}

// 处理darg进入
const handleDragenter = (dragEvent) =>{
  console.log('进入',dragEvent);
}

// 处理darg离开
const handleDragleave = (dragEvent) =>{
  console.log('离开',dragEvent);
}
</script>

<style lang="scss" scoped>
</style>