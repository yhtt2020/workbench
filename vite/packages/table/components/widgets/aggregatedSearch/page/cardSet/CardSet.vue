<script setup lang="ts">
import { ref, inject, onMounted, nextTick, computed } from "vue";
import { openWithList } from "../../config/data";
import Sortable from "sortablejs";
const data: any = inject("data");
const emit = defineEmits([
  "close",
  "listSort",
  "update:lastUse",
  "update:openWith",
]);
const sortableRef = ref();
const sourceList = ref(data.value.sourceList);
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      new Sortable(sortableRef.value, {
        animation: 150,
        // 开始拖拽时
        onStart: function (evt: any) {},
        // 结束拖拽时
        onEnd({ oldIndex, newIndex }: any) {
          // console.log(" newIndex, oldIndex :>> ", newIndex, oldIndex);
          emit("listSort", oldIndex, newIndex);
          // let movedItem = sourceList.value.splice(oldIndex, 1)[0]; // 从旧位置移除
          // sourceList.value.splice(newIndex, 0, movedItem); // 插入到新位置
          // [sourceList.value[newIndex], sourceList.value[oldIndex]] = [
          //   sourceList.value[oldIndex],
          //   sourceList.value[newIndex],
          // ];
          // emit("listSort", sourceList);
        },
      });
    }, 100);
  });
});
const updateLastUse = (val) => {
  emit("update:lastUse", val);
};
const updateOpenWith = (val) => {
  emit("update:openWith", val);
};
const close = () => {
  emit("close");
};
const leftMenu = [
  {
    name: "属性设置",
    icon: "fluent:settings-16-regular",
  },
  {
    name: "小组件外观",
    icon: "fluent:color-24-regular",
  },
];
const menuIndex = ref(0);
</script>

<template>
  <xt-modal :model-value="true" @close="close" :mask="false">
    <!-- 导航 -->
    <!-- <template #nav>
      <div class="h-full w-[200px] p-3 tt-main-bg">
        <div
          v-for="(item, index) in leftMenu"
          :key="index"
          class="flex items-center p-3 mb-3 cursor-pointer"
          :class="{
            'tt-theme-bg-2': menuIndex === index,
          }"
          @click="menuIndex = index"
        >
          <xt-mix-icon :icon="item.icon" class="mr-3" />
          {{ item.name }}
        </div>
      </div>
    </template> -->
    <!-- 头部 -->
    <template #header-left>
      <div class="flex items-center">
        <xt-mix-icon :icon="leftMenu[menuIndex].icon" class="mr-3" />
        {{ leftMenu[menuIndex].name }}
      </div>
    </template>
    <div class="w-[468px]"></div>
    <template v-if="menuIndex === 0">
      <xt-option-box>
        <xt-option-info
          title="记住上次使用的搜索方式"
          isSwitch
          v-model:switch="data.lastUse"
          @updateSwitchCb="updateLastUse"
        />
        <hr />
        <xt-option-info title="网页默认打开方式" />
        <xt-option-select
          v-model:select="data.openWith"
          :list="openWithList"
          @cb="updateOpenWith"
        />
        <div class="mb-3"></div>
      </xt-option-box>
      <div class="flex justify-between text-sm mb-3">
        <div>搜索引擎</div>
        <div class="tt-text-2">长按拖拽排序</div>
      </div>
      <div
        class="flex flex-col w-full tt-bg-2 rounded-xl p-3"
        ref="sortableRef"
      >
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

    <xt-option-box>
      <xt-option-info
        title="无边框模式"
        isSwitch
        v-model:switch="data.noBorder"
      />
    </xt-option-box>
    <!--
    <xt-option-box>
      <xt-option-info title="无边框模式" />
      <xt-option-select />
    </xt-option-box> -->
  </xt-modal>
</template>
<style lang="scss" scoped></style>
