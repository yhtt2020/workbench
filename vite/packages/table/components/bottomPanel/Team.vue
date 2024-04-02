<template>
  <Avatar :item="item" :size="size"/>
    <!-- 文件夹 -->
    <teleport to='body'>
    <div
    style="position: absolute; z-index: 500 !important"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
      }"
      class="rounded-xl pointer"
      id="folder"
    >
    <Folder
      @clickFile="close"
      @close = "close"
      :customData="customData"
      :customIndex="bottomKey"
      :secondary="true"
      v-if="visible"
      :expand="{ disabled: true }"
      :navBar="{
        resize: false,
        sizeOption: false,
        isDel: true,
        hierarchy: true,
        close: true,
        disableHeader: true,
      }"
      :auto="true"
      />
    </div>
    <TeamTip :key="teamKey" v-model:visible="store.showTeamTip"></TeamTip>
    <MyProp :showMyProp="store.showMyProp" @closeMyProp="closeMyProp"></MyProp>
  </teleport>
</template>

<script setup lang='ts'>
import { ref,computed,toRefs,onMounted,watch } from 'vue'
import Avatar from '../../components/desk/navigationBar/components/Avatar.vue'
import Folder from '../../apps/folder/src/Folder.vue';
import TeamTip from '../TeamTip.vue'
import MyProp from '../team/MyProp.vue'
import { defaultFolderData } from '../../apps/folder/src/components/options';
import { nanoid } from 'nanoid';

import { useComStore } from './comStore';
// import { storeToRefs } from 'pinia';
const store = useComStore()
// const {showTeamTip,showMyProp} = storeToRefs(store)

const props = defineProps<{
  item: any,
  x: number,
  y: number,
  visible: boolean,
  size:{
    type:Number,
    default:52
  }
}>()

const { item, x, y,visible } = toRefs(props)

// watch(() => visible.value, (val) => {
//   if (val) {
//     console.log('item', item.value, x.value, y.value,visible.value);
//   }
// })

const emit = defineEmits(['close'])

// 文件夹数据列表
const list = ref([
  {
    icon: '/img/bottomPanel/my.png',
    name: '我的',
    value: 'socialMy',
    type: 'systemApp',
    id:nanoid(6)
  },
  {
    icon: '/img/bottomPanel/team.png',
    name: '小队',
    type: 'fixed',
    id:nanoid(6),
    value:'team'
  },
  {
    icon: '/img/bottomPanel/rank.png',
    name: '榜单',
    value: 'rank',
    type: 'systemApp',
    id:nanoid(6)
  },
  {
    icon: '/img/bottomPanel/prop.png',
    name: '我的道具',
    type: 'fixed',
    id:nanoid(6),
    value:'myProp'
  },
  {
    icon: '/img/bottomPanel/market.png',
    name: '道具商城',
    value: 'prop',
    type: 'systemApp',
    id:nanoid(6)
  },
  {
    icon:'/img/task/star.png',
    name: '任务',
    value: 'task',
    type:'systemApp',
    id:nanoid(6)
  }
])


const bottomKey = ref(Date.now())

const customData = computed(() => {
  return {
    ...defaultFolderData,
    list:list.value,
    customSize:'2x2',
    name:'社区中心',
    layout:'rows',
  }
})

// 关闭文件夹
const close = (item) => {
  emit('close')
}

// 关闭我的道具弹窗
const closeMyProp = () => {
  store.showMyProp = false
}

// watch(
//   () => store.showTeamTip,
//   () => {
//     console.log('showTeamTip',store.showTeamTip);
//   }
// )
// watch(
//   () => store.showMyProp,
//   () => {
//     console.log('showMyProp',store.showMyProp);
//   }
// )


// onMounted(() => {
//   console.log('mounted',customData.value);
// })
</script>

<style lang='scss' scoped></style>
