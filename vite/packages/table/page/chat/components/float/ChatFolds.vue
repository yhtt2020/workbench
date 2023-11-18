<template>
 <div class="collapse-container" style="position: relative;">
   <div class="header pl-2 mb-2 flex  justify-between rounded-md h-8" @click.stop="toggleCollapse">
     <div class="flex items-center">
      <div class="flex items-center justify-center" :class="['icon', { 'rotate': collapsed }]">
        <FoldIcon  icon="fluent:caret-down-12-filled" style="font-size: 1.5rem;"/>
      </div>
      <span class="font-14 ml-2 xt-text-2 xt-font font-400" >
       {{ title }}
      </span>
     </div>
   </div>

   <div style="position:absolute; top:6px;right:10px;" v-if="no !== 1">
    <ChatDropDown newIcon="fluent:more-horizontal-16-filled" :list="dorpList"></ChatDropDown>
   </div>
   <transition name="collapse">
    <!-- class="content" -->
    <div v-if="!collapsed" >
      <slot></slot>
    </div>
   </transition>
 </div>

 <PacketSetting ref="packRef" :no="no" :item="content !== undefined ? content : undefined "/>
 <AddUnClassCategory ref="unClassRef" :no="no" :item="content !== undefined ? content : undefined"/>
</template>

<script>
import { ref,reactive } from 'vue';
import { Icon as FoldIcon } from '@iconify/vue';
import { communityStore } from '../../store/communityStore'
import { message,Modal } from 'ant-design-vue'

import ChatDropDown from './Dropdown.vue';
import PacketSetting from '../knownCategory/PacketSettings.vue';
import AddUnClassCategory from '../add/AddUnClassCategory.vue';


export default {
 props:['title','content','show','no'],
 components: {
  FoldIcon,ChatDropDown,PacketSetting,AddUnClassCategory,
 },
 setup(props,ctx) {
   const collapsed = ref(false);
   const dorpShow = ref(false)
   const community = communityStore()
   const packRef = ref(null)
   const unClassRef = ref(null)

   const dorpList = ref([
    { 
      newIcon:'fluent:apps-add-in-20-filled',title:'添加新应用',
      callBack:()=>{
        unClassRef.value.openUnClassModal()
      }
    },
    { 
      newIcon:'fluent:settings-16-regular',title:'分组设置',
      callBack:()=>{
        packRef.value.openSetModal()
      }
    },
    { 
      newIcon:'akar-icons:trash-can',title:'删除分组',type:'deletePacket',color:'var(--error)',
      callBack:()=>{
        Modal.confirm({
          content:'删除分类操作不可撤销，分类被删除后，子应用将被移动到顶层。是否确定删除？',
          centered:true,
          onOk:()=>{
            const id = props.content.id
            const communityNo = props.no
            community.removeCategory(id,communityNo)
            message.success('删除成功')
          }
        })
      }
    }
   ])

   const toggleCollapse = () => {
     collapsed.value = !collapsed.value;
   };

   return {
     collapsed,dorpShow,dorpList,packRef,unClassRef,
     toggleCollapse
   };
 }
};
</script>

<style lang="scss" scoped>
.collapse-container {
 margin-bottom: 10px;
}

.header {
 cursor: pointer;
 display: flex;
 align-items: center;
 &:hover{
  background: var(--active-secondary-bg);
 }
}

.icon {
 transition: transform 0.3s;  /* 添加过渡效果 */
}

.rotate {
 transform: rotate(-90deg);  /* 旋转图标 */
}

/**
.content {
 padding: 10px;
}
**/

/* 定义过渡效果样式 */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.1s ease;
  height: auto;
  opacity: 1;
}

.collapse-enter-from,
.collapse-leave-to {
  height: 0;
  opacity: 0;
}

</style>
