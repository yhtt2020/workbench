<template>
  <xt-modal
      v-model="modelValue"
      title="添加到分组"
      boxClass="rounded-xl p-4"
      :mask="isMask"
      :maskIndex='maskIndex'
      :index="index"
      :header="true"
      :footer="true"
      v-if="modelValue"
      @no="modelValue = false"
      @close="modelValue = false"
      @ok="addHandle" >
      <div class="relative px-2 xt-modal rounded-xl" style="width: 466px; height: 380px;">
          <div class="flex justify-between w-full">
              <xt-select v-model="defaultDesk" :zIndex="2001" borderClass="w-[200px]" :list="chooseList"></xt-select>
              <xt-select v-model="defaultFolder" :zIndex="2001" borderClass="w-[200px]" :list="folderList"></xt-select>
          </div>
          <!-- 预览组件 -->
          <xt-preDesk :chooseIndex="cardData" class="mt-4 overflow-hidden" :key="defaultFolder"></xt-preDesk>
      </div>
  </xt-modal>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  toRefs,
  watch,
} from 'vue'
import { storeToRefs  } from 'pinia'
import { nanoid } from 'nanoid';
import _ from 'lodash-es'
import { message } from 'ant-design-vue';

import { registerFolder } from "../../../apps/folder/src/hooks/register";
import { defaultData,useIconConversionFile } from '../../hooks/useDataConversion';

import { cardStore } from '../../../store/card';
import { homeStore } from '../../../store/home';
import { navStore } from '../../../store/nav';

// 获取当前所有桌面
const useCardStore = cardStore()
const { desks } = storeToRefs(useCardStore)

// 获取当前桌面id
const useHomeStore = homeStore()
const { currentDeskId } = storeToRefs(useHomeStore)

// 获取导航栏数据
const useNavStore = navStore()
const { copyFootNav,sideNavigationList,rightNavigationList,navigationToggle } = storeToRefs(useNavStore)

// 回调函数
const emit = defineEmits(['ok'])

export interface previewType {
  list: Array<any>,   // 添加的图标数组
  previewFlag: boolean,  // 是否显示
  index: number,    // 层级
  maskIndex:number,  // 遮罩层层级
  isMask: boolean,    // 是否显示遮罩层
  card?:object,  // 卡片数据
  navDisabled?:boolean // 导航栏是否禁止选择
  isFavorite?:boolean // 是否是收藏夹（包括添加图标），如果不是，则自己传入card的数据内容
}

const props = withDefaults(defineProps<previewType>(), {
  list: () => [],
  previewFlag: false,
  index:2000,
  maskIndex:1999,
  isMask: true,
  card:{
    icon: "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
    name: '文件夹',
    id: '170000000',
    cardName: 'folder',
    customData:{
      customSize: '2x2',
      list: [],
      model: "custom",
      
    }
  },
  navDisabled:false,
  isFavorite:false
})

const { list , previewFlag,index,maskIndex,isMask,card,navDisabled,isFavorite } = toRefs(props)

// 默认数据
const defaultDesk : any = ref('')   // 默认桌面
const defaultFolder = ref('')  // 默认文件夹
const createNew = ref({
  name: '新建文件夹',
  value: 'create',
  id: '170000000',
  cardName: 'folder',
  customData:{
    customSize: '2x2',
    list: [],
    icon: "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
    model: "custom",
    name: '文件夹',
  },
  deskId:nanoid(6)
})  // 新建文件夹
const desksList = ref([])  // 桌面数组
const modelValue = ref(true)

// 导航栏数组
const navList = ref([
  {
      name:"底部导航栏",
      value:"foot",
      disabled: navDisabled.value ? false : navigationToggle.value[2],
      list:copyFootNav.value
  },
  {
      name:"左侧导航栏",
      value:"left",
      disabled:navDisabled.value ? false : navigationToggle.value[0],
      list:sideNavigationList.value
  } ,
  {
      name:"右侧导航栏",
      value:"right",
      disabled:navDisabled.value ? false : navigationToggle.value[1],
      list:rightNavigationList.value
  }
])

// 获取导航栏数据
const navObj = ref({
  'foot':copyFootNav.value,
  'left':sideNavigationList.value,
  'right':rightNavigationList.value
})

// 获取桌面
const resetDesk = () => {
  const list = desks.value.map( item => {
      return {
          value: item.id,
          name: item.name
      }
  })
  return list
}

// 获取当前显示导航栏列表
const chooseList = computed(() => {
  const list = navList.value.filter((item) => {
      return item.disabled === true
  })
  return [
      ...desksList.value,
      ...list
  ]

})

// 获取每个桌面文件夹列表
const deskFolders = computed(() => {
// 与原本的桌面数据脱钩，防止后续操作对数据造成污染
const deskList = _.cloneDeep(desks.value)
const obj = deskList.map((item) => {
  const list : any = [];
  item.cards.forEach((card : any) => {
      if(card.name === 'folder') {
          card.value = card.id
          card.cardName = 'folder',
          card.deskId = card.id,
          card.name = card.customData?.name
          list.push(card)
      }
  })
  return {
    [item.id]: [createNew.value, ...list],
  };
});
return obj;
})

// 获取导航栏中的文件夹列表
const navFolders = computed(() => {
const obj = navList.value.reduce((acc, item) => {
  if (item.disabled === true) {
    const list : any = [];
    const navList = _.cloneDeep(item.list)
    navList.forEach((i : any ) => {
      if (i.type === 'folder') {
        list.push({
          name: i.name,
          value: i.id,
          id: i.id,
          cardName: 'folder',
          customData:{
            customSize: '2x2',
            list: [],
            icon: "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
            model: "custom",
            name: '文件夹',
          },
          deskId:i.id
        })
      }
    });
    acc[item.value] = [createNew.value, ...list];
  }
  return acc;
}, {});
return obj;
})

// 合并桌面和文件夹的列表
const showList = computed(() => {
  const obj = Object.assign({}, ...deskFolders.value, navFolders.value );
  return obj
})

// 获取当前选择的文件夹列表
const folderList = computed(() => {
  if(typeof defaultDesk.value === 'object') {
      const tag = defaultDesk.value.value
      return showList.value[tag]
  } else {
      return showList.value[defaultDesk.value]
  }
})

// 
const cardData = computed(() => {
  if( isFavorite.value){
    return defaultData.value
  } 
  return card.value
})

// 获取当前选中的文件夹
const defaultData = computed(() => {
  if(folderList.value) {
      const folder = folderList.value.findIndex((item) => {
          let tag = isStart(defaultFolder.value)
          return item.value === tag
      })
      return folderList.value[folder]
  }
  return
})

// 默认数据为对象，判断是否为对象
const isStart = (item) => {
  if(typeof item === 'object') {
      const tag = item.value
      return tag
  } else {
      return item
  }
}

// 添加图标
const addHandle = () => {
  // 获取当前选中的文件夹id
  const tag = isStart(defaultFolder.value)
  // 获取当前选中的桌面id
  const target = isStart(defaultDesk.value)
  // 初始化图标数据
  const item = defaultData
  // 当为create，即为新建文件夹
  if(tag === 'create'){
      // 判断是否是导航栏
      if( navObj.value[target] ){
          // 传入导航栏文件夹的相关数据
          item.type = 'folder'
          item.children = list.value
          item.id = nanoid(6)
          item.name = '文件夹'
          navObj.value[target].unshift(item)
      } else {
          const desk = desks.value.find(item => item.id === target)
          registerFolder(desk,list.value)
      }
  } else {
      if( navObj.value[target] ){
          const navItem = navObj.value[target].find(item => item.id === tag)
          if(navItem) {
              list.value.forEach(item => {
                  navItem.children.push(item)
              })
          }
      } else {
          const desk = desks.value.find(item => item.id === target)
          const card = desk.cards.find(item => item.id === tag)
          if(card) {
              card.customData.list = card.customData.list.concat(list.value)
          }
      }
  }
  message.success('添加成功')
  emit('ok')
}

// 当桌面切换后，重置默认文件夹
watch(() => defaultDesk.value, () => {
  defaultFolder.value = folderList.value[0]
})

// 处理默认数据 --- 默认桌面以及默认文件夹
onMounted(() => {
  desksList.value = resetDesk()
  defaultDesk.value = desksList.value.find(item => item.value === currentDeskId.value)
  defaultFolder.value = folderList.value[0]
})

</script>

<style lang="scss" scoped></style>
