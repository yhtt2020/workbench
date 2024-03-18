<template>
  <template v-if="list.length !== 0">
    <div class="grid-container">
      <div
        v-for="(item,index) in list"
        class="grid-item xt-bg-2 rounded-xl pointer flex items-center justify-center relative"
        @click="openApp(item)"
      >
        <xt-menu
          name="name"
          :menus="menuList"
          @contextmenu="(currentItem = item), (currentIndex = index)"
        >
          <div class="flex items-center flex-col justify-center ">
            <img
              :src="item.icon"
              style="width: 64px; height: 64px"
              class="object-cover rounded-xl mb-3"
              alt=""
            />
            <span
              class="font-16 xt-font xt-text truncate"
              style="max-width: 100px"
              >{{ item.name }}</span
            >
          </div>
          <div class="absolute  top-1 right-1" v-if="false">
            <xt-ify-icon icon="fluent:star-16-filled" size="20" style="color: var(--warning);"></xt-ify-icon>
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
import { computed, ref, toRefs } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";
import { startApp } from "../../../ui/hooks/useStartApp";

import AddFolderEmpty from "../empty/AppFolderEmpty.vue";

const communityNav = communityNavStore();
const { appModalList } = storeToRefs(communityNav);

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  listType: {
    type: String,
  },
});
const { list, listType } = toRefs(props);

// 当前子项数据
const currentItem = ref(null);
const currentIndex = ref(null);

// 右键菜单操作
const detailMenus = ref([
  {
    newIcon: "fluent:open-16-regular",
    name: "打开",
    callBack: () => {
      openApp(currentItem.value);
    },
  },
  {
    newIcon: "fluent:star-16-regular",
    name: "添加到收藏",
    callBack: () => {
      addFolder();
    },
  },
  {
    newIcon: "fluent:desktop-16-regular",
    name: "添加到桌面",
  },
  {
    name: "添加到导航栏",
    newIcon: "fluent:tablet-16-regular",
    children: [
      {
        newIcon: "fluent:panel-left-contract-16-regular",
        name: "左侧导航",
      },
      {
        newIcon: "fluent:panel-right-contract-16-regular",
        name: "右侧导航",
      },
      {
        newIcon: "fluent:tablet-16-regular",
        name: "底部导航",
      },
    ],
  },
  {
    newIcon: "fluent:compose-16-regular",
    name: "编辑",
  },
  {
    newIcon: "fluent:delete-16-regular",
    name: "删除",
    color: "var(--error)",
    callBack: () => {
      // window.$ui.confirm('','',{
      //   ok:()=>{

      //   }
      // });
      const n_id = currentItem.value.n_id;
      const index = appModalList.value[1]?.list.findIndex((item) => {
        return item.n_id === n_id;
      });
      appModalList.value[1]?.list?.splice(index, 1);
    },
  },
]);
const likeMenu = ref([
  {
    newIcon: "fluent:open-16-regular",
    name: "打开",
    callBack: () => {
      openApp(currentItem.value);
    },
  },
  {
    newIcon:'fluent:star-16-filled',
    name: "取消收藏",
    callBack:()=>{
      removeFolder(currentItem.value);
    }
  },
  {
    newIcon: "fluent:desktop-16-regular",
    name: "添加到桌面",
  },
  {
    newIcon: "fluent:tablet-16-regular",
    name: "添加到导航栏",
    children: [
      {
        name: "左侧导航",
      },
      {
        name: "右侧导航",
      },
      {
        name: "底部导航",
      },
    ],
  },
]);
const menuList = computed(() => {
  if (listType.value === "like") {
    return likeMenu.value;
  } else {
    return detailMenus.value;
  }
});

// 添加收藏
const addFolder = () => {
  const id = currentItem.value?.id;
  const index = appModalList.value[0]?.list.findIndex((item)=>{ return item.id === id });
  if(index === -1){
    appModalList.value[0]?.list.push(currentItem.value);
  }
};
// 打开应用模式中应用
const openApp = (data) => {
  startApp(data.type, data.value, data.router);
};

// 是否收藏
const isHide = (index) =>{
  // const arr1 = appModalList.value[0]?.list;
  // const arr2 = appModalList.value[1]?.list;
  // console.log('测试',list.value.includes(arr2[index]));
  // return list.value.includes(arr2[index]);
}

// 取消收藏
const removeFolder = (data) =>{
  const id = data?.id;
  const index = appModalList.value[0]?.list.findIndex((item)=>{ return item.id === id });
  appModalList.value[0]?.list?.splice(index,1);
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