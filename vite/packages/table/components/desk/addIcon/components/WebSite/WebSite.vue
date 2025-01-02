<template>
  <div class="flex mb-3 gap-2">
    <xt-button v-for="(item, index) in navTypes"
               w="110"
               h="32"
               radius="16"
               class="p-1 mr-3 text-sm shaking-element"
               @click="setTopType(item.id)"
               :style="{
                'background': currentTopTypeId === item.id ? 'var(--active-bg)' : 'transparent',
                'color': currentTopTypeId === item.id ? 'rgba(255, 255, 255, 0.85) !important' : 'var(--primary-text)' }"
               :key="index" :icon="item.logo">
    {{ item.title }}
    </xt-button>
  </div>
  <template v-for="(item, index) in navTypes">
    <div class="mb-4" v-if="item.id===currentTopTypeId && currentTopTypeId!==0">
      <xt-tab v-model="currentSubTypeId" :list="convertSubTypes(item.children)"></xt-tab>
    </div>
  </template>
  <IconList :list="list" @clickItem="addIcon"></IconList>
  <Empty v-if="list.length === 0"></Empty>
</template>

<script setup lang='ts'>
import {ref, onMounted, computed, watch} from 'vue'
import Empty from '../Empty.vue';
import {getNavList} from '../../../../../page/app/addIcon/api/api'
import {navTypes} from '../../hook/defaultData'
import {useReplace} from '../../hook/useReplace';
import IconList from '../IconList.vue';
import {useFilterList} from '../../hook/useFilterList';
import navDb from '../../../../../js/lib/navDb'
import {cdnUrl} from '../../../../../consts'
const emit = defineEmits(['addIcon'])

const props = defineProps({
  value: String
})
const currentTopTypeId = ref(0)
const currentSubTypeId = ref('0')
// 获取所有的图标
const navTypes = ref({})

// 索引
const clickIndex = ref(0)

// 当前图标的类型
const tag = computed(() => {
  return navTypes[clickIndex.value].tag
})

// 当前图标的列表
const list = ref([])

// 筛选列表
// const filterList = computed(() => {
//   let arr = list.value
//   if (!arr) {
//     arr = []
//   }
//   return list.value.filter(item =>{
//     return item?.name.toLowerCase().includes(props.value.toLowerCase())
//   })
// })

watch(()=>{
  return props.value
}, async (value) => {
  if (value !== '') {
    list.value =convertNavToIcon(await navDb.searchNavByWords(value))
  }else{
    await getCurrentNavList()
  }
})

const getCurrentNavList=async () => {

  const rs = await navDb.getNavsByType(Number(currentSubTypeId.value),currentTopTypeId.value)
  list.value = convertNavToIcon(rs)
}

// 切换
const setTopType = async (typeId: number) => {
  currentTopTypeId.value = typeId
  currentSubTypeId.value = '0'
  await getCurrentNavList()
}

onMounted(async () => {
  navTypes.value = await navDb.getNavTypesTree()
  currentTopTypeId.value = navTypes.value[0].id
  currentSubTypeId.value = '0'
  getCurrentNavList()
})
const convertNavToIcon=(list)=>{
   return list.map((item)=>{
    return {
      "id": item.id,
      "name": item.title,
      "summary": item.summary || '网站',
      "icon": cdnUrl('/nav_icon/'+item.logo),
      "url":item.url,
      info:item.summary||'',
      value:item.url,
      type:'link',
      open:{
        mode:'default',
        value:item.url
      }
    }
  })
}
watch(() => currentSubTypeId.value, async (val) => {
  console.log('切换导航类', val)
  const rs = await navDb.getNavsByType(Number(val),currentTopTypeId.value)
  list.value=convertNavToIcon(rs)

}, {
  immediate: true,
  deep: true,
})
const convertSubTypes = (types) => {
  return [{name: '全部', value: '0', children: []}, ...types.map(type => {
    return {
      name: type.title,
      value: String(type.id)
    }
  })]
}

// 添加图标
const addIcon = (item) => {
  emit('addIcon', item)
}

</script>
<style lang='scss' scoped></style>
