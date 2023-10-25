<!-- 可拖拽区域组件 -->
<script setup lang="ts">


</script>

<template>
  <div :ref="drop" class="container">
    <DraggableBox
      v-for="data in getCurrentDesk"
      :id="data.id"
      :key="data.id"
      :left="data.left"
      :top="data.top"
      :data="data"
      :currentDesk="currentDesk"
    >
      <template #item="{ item }">
        <slot name="item" :item="item"> {{ item }}</slot>
      </template>
    </DraggableBox>
  </div>
</template>
