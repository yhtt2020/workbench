<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <Item
      classItem="max-w-[705px] justify-start"
      :menu="newMenu"
      @choose="chooseIcon"
    >
    </Item>
    <Item
      classItem="justify-center"
      className="mt-8"
      :menu="teamMenu"
      @choose="chooseTeam"
    >
    </Item>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, computed } from "vue";
import { menu, teamMenu } from "./Data";
import Item from "./Item.vue";

const emit = defineEmits(["choose"]);

export interface EditType {
  communityRole: boolean;
}

const props = withDefaults(defineProps<EditType>(), {
  communityRole: false,
});

// 选择图标类型回调
const chooseIcon = (item, index) => {
  emit("choose", item, index);
};

// 选择团队图标类型回调
const chooseTeam = (item) => {
  emit("choose", item);
};

const newMenu = computed(() => {

  let newMenu = menu
  
  // web端屏蔽收藏夹入口
  if(window.$usePlat()){
    newMenu.list = (newMenu?.list as any).filter((item:any)=>{
      return item.component !== 'Browser'
    })
  }
  
  // 根据社群桌面角色权限
  if(!props.communityRole){
    return newMenu;
  }
  else {
    const filterMenu = (newMenu?.list as any).filter((newMenu:any)=>{
      return newMenu.component !== 'Windows'
    })
    return {...newMenu,list:filterMenu};
  }
});
//
</script>
<style lang='scss' scoped></style>