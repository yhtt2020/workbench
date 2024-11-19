<!-- 壁纸源下拉选器 -->
<template>
  <xt-select :list="apiList" zIndex="100001" style="width: 140px;margin-right: 12px;text-align: left;" 
  :border="false" :borderClass="'rounded-md'" v-model="currentApi" @change="updateValue($event)">
  </xt-select>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from 'pinia';
import { pickPaperStore } from '../../store/PickPaperStore';

const pickStore = pickPaperStore()
const { paperApi,paperNick } = storeToRefs(pickStore);

// 壁纸源列表 
const apiList = ref(
 [
  { name: '拾光',  value: 'timeline', synopsis: '时光如歌,岁月如诗' },
  { name: '贪食鬼', value: 'glutton', synopsis: '饕餮盛宴' },
  { name: '贪吃蛇', value: 'snake', synopsis: '' },
  { name: 'wallhaven', value: 'wallhaven', synopsis: 'The best wallpapers on the Net' }
 ]
);

// 取当前缓存中的选中壁纸源
const currentApi = computed(()=>{
  const index = apiList.value.findIndex((item)=>{
    return String(paperApi.value) === String(item.value)
  })
  paperNick.value = apiList.value[index];
  return  apiList.value[index]?.value;
})

const emit = defineEmits(['updateCallback'])

const updateValue = (evt) =>{
  paperApi.value = evt;
  emit('updateCallback');
}
</script>

<style lang="scss" scoped>
:deep(.ant-select-selector) {
  height: 32px !important;
  & .ant-select-selection-item {
    line-height: 32px !important;
  }
}
</style>
