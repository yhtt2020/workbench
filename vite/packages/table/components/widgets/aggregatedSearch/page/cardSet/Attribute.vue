<script setup lang="ts">
import { ref, inject, onMounted, nextTick, computed } from "vue";
import Sortable from "sortablejs";
import { openWithList } from "../../config/data";
const data: any = inject("data");

const sortableRef = ref();

onMounted(() => {
  setTimeout(() => {
    new Sortable(sortableRef.value, {
      animation: 150,
      // 开始拖拽时
      onStart: function (evt: any) {},
      // 结束拖拽时
      onEnd({ oldIndex, newIndex }: any) {
        let sourceList = data.value.sourceList;
        let movedItem = sourceList.splice(oldIndex, 1)[0]; // 从旧位置移除
        sourceList.splice(newIndex, 0, movedItem); // 插入到新位置
      },
    });
  }, 100);
});
</script>

<template>
  <xt-option-box>
    <xt-option-info
      title="记住上次使用的搜索方式"
      isSwitch
      v-model:switch="data.lastUse"
    />
    <hr />
    <xt-option-info title="网页默认打开方式" />
    <xt-option-select
      v-model:select="data.openWith"
      :list="openWithList"
    />
    <div class="mb-3"></div>
  </xt-option-box>
  <div class="flex justify-between text-sm mb-3">
    <div>搜索引擎</div>
    <div class="tt-text-2">长按拖拽排序</div>
  </div>
  <div class="flex flex-col w-full tt-bg-2 rounded-xl p-3" ref="sortableRef">
    <div
      v-for="item in data.sourceList"
      :key="item.name"
      class="w-full h-12 flex justify-between items-center cursor-move"
    >
      <div class="flex">
        <xt-mix-icon :icon="item.icon" type="select" class="mr-3" />
        {{ item.name }}
      </div>
      <xt-mix-icon icon="fluent:line-horizontal-3-20-filled" class="mr-3" />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
