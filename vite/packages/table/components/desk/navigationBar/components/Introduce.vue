<template>
  <div class="w-full h-full">
    <div v-if="selectTag === 'recommendation'">
      <div class="flex justify-center"><xt-new-icon icon="fluent-emoji:rocket" size="50" /></div>
      <div class="flex justify-between p-2 mt-5 rounded-lg xt-bg-2">
        <div class="xt-text">你可以直接拖拽Windows系统文件或应用快捷方式到导航栏；我们还为你推荐了以下应用图标供你添加选择。</div>
        <div class="pointer" style="color:var(--active-bg)">全部添加</div>
      </div>
    </div>
    <div class="xt-text-2 w-[790px] h-[52px] xt-bg-2 rounded-xl flex items-center p-4" v-if="tagText">
      {{ tagText }}</div>
    <!-- {{ sideBar[currentIndex].tag == 'webNavigation' }} -->
    <div class="flex " v-if="selectTag == 'webNavigation'">
      <xt-button w="80" h="32" radius="16" class="p-1 mr-3 text-sm shaking-element" @click="onClick(index)"
        :style="{ 'background': clickIndex === index ? 'var(--active-bg)' : 'transparent' }"
        v-for="(item, index) in webMenus" :key="index">{{ item.name }}</xt-button>
    </div>
    <div class="flex flex-wrap mt-3">
      <selectIcon v-for="(item, index) in filterList" :item="item" :recommendation="props.recommendation" />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from 'vue'
import selectIcon from './selectIcon.vue'
import { webMenus } from '../index'
const props = defineProps({
  recommendation: String,
  selectList: Array
})
const clickIndex=ref(0)
const onClick=(index)=>{
  clickIndex.value=index
  console.log(list.value)
}
const tagText = computed(() => {
  // const currentTag = props.recommendation.tag
  switch (selectTag.value) {
    case 'coolApp':
      return '基于工作台深度优化和适配的应用，支持多选批量添加。'
      break;
    case 'lightApp':
      return '来自「想天浏览器」的轻应用，支持多选批量添加。'
      break;
    case 'systemApp':
      return '工作台内置功能项，支持直接添加到桌面，支持多选批量添加。'
    default:
      break;
  }
})
const selectTag=computed(()=>{
  return props.recommendation.tag
})
const list = computed(() => {
  if (selectTag.value === 'webNavigation') {
    const clickTag = webMenus[clickIndex.value].tag;
    const temp = [];

    return props.selectList.map((item) => {
      if (item.hasOwnProperty(clickTag)) {
        temp.push(...item[clickTag]);
      }
      return temp;
    });
  } else {
    // 如果 selectTag.value 不等于 'webNavigation'，返回一个默认值（这里返回一个空数组）
    return [];
  }
});
const filterList=computed(()=>{
  if(selectTag.value === 'webNavigation'){
    return list.value[0]
  }else{
    return props.selectList
  }
})
</script>
<style lang='scss' scoped></style>