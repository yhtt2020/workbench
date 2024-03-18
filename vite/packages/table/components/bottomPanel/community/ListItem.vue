<template>
  <template v-if="list.length !== 0">
    <div class="grid-container" >
      <div v-for="item in list" class="grid-item xt-bg-2 rounded-xl pointer flex items-center justify-center" @click="openApp(item)">
       <xt-menu name="name" :menus="menuList" @contextmenu="currentItem = item,currentIndex = index">
         <div class="flex items-center flex-col justify-center">
           <img :src="item.icon" style="width: 64px;height: 64px;" class="object-cover rounded-xl mb-3" alt=""/>
           <span class="font-16 xt-font xt-text">{{ item.name }}</span>
         </div>
       </xt-menu>
      </div>
    </div>
  </template>
  
  <template v-else>
    <AddFolderEmpty /> 
  </template>
</template>

<script setup>
import { computed, ref, toRefs } from 'vue';


import AddFolderEmpty from "../empty/AppFolderEmpty.vue";

const props = defineProps({
 list:{
  type:Array,
  default:()=>[]
 },
 listType:{
  type:String,
 }
});
const { list,listType } = toRefs(props);

// 当前子项数据
const currentItem = ref(null);
const currentIndex = ref(null);

// 右键菜单操作
const detailMenus = ref([
  {
    newIcon:'fluent:open-16-regular',
    name:'打开',
    callBack:()=>{

    },
  },
  {
    newIcon:'fluent:star-16-regular',
    name:'添加到收藏',
    callBack:()=>{ addFolder() }
  },
  {
    newIcon:'fluent:desktop-16-regular',
    name:'添加到桌面'
  },
  {
    name:'添加到导航栏',
    newIcon:'fluent:tablet-16-regular',
    children:[
      {
        newIcon:'fluent:panel-left-contract-16-regular',
        name:'左侧导航',
      },
      {
        newIcon:'fluent:panel-right-contract-16-regular',
        name:'右侧导航'
      },
      {
        newIcon:'fluent:tablet-16-regular',
        name:'底部导航'
      }
    ] 
  },
  {
    newIcon:'fluent:compose-16-regular',
    name:'编辑'
  },
  {
    newIcon:'fluent:delete-16-regular',
    name:'删除',
    color:'var(--error)',
    callBack:()=>{
      console.log('获取当前删除的数据',currentItem.value);
      console.log('根据类型进行判断',listType);
      /**实现删除逻辑思路
       * 1.获取当前需要删除的数据
       * 2.匹配出当前选中的类型,根据当前类型进行判断是否存在,如果存在就继续删除操作
       * 
       * **/ 
    }
  }
])
const likeMenu = ref([
  {
    newIcon:'fluent:open-16-regular',
    name:'打开',
  },
  {
    name:'取消收藏'
  },
  {
    newIcon:'fluent:desktop-16-regular',
    name:'添加到桌面'
  },
  {
    newIcon:'fluent:tablet-16-regular',
    name:'添加到导航栏',
    children:[
      {
        name:'左侧导航',
      },
      {
        name:'右侧导航'
      },
      {
        name:'底部导航'
      }
    ] 
  },
])

const menuList = computed(()=>{
  if(listType.value === 'like'){
    return likeMenu.value;
  }
  else {
    return detailMenus.value;
  }
})


// 添加收藏
const addFolder = () =>{
  console.log('测试',currentItem.value);
}
// 打开应用模式中应用
const openApp = (data) =>{
  console.log('测试',data);
}

</script>

<style lang="scss" scoped>
.grid-container {
 display: grid;
 grid-template-columns: repeat(5, 133px);
 grid-gap: 16px; 
}
.grid-item {
 width: 133px;
 height: 133px;
}
</style>