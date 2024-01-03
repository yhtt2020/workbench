<template>
 <xt-modal v-model="editorVisible" ref="modelRef" :mask="false" :boxClass="'p-0'" :custom="true">
   <xt-left-menu style="margin: 0 !important;border-radius: 12px !important;" :list="menuList" 
    end="1" model="id" leftClass="xt-bg-m rounded-l-xl" leftMargin="mr-0 py-3" w="64" :style="!isFull ? {width:'800px',height:'720px'}:{ width:'100%',height:'100%' }"
   >  
     <template v-if="messageType === 'send'">
       <NoticeSend @close="editorVisible = false"/>
     </template>

     <template v-else>
       <NoticeHistory @close="editorVisible = false"/>
     </template>
   </xt-left-menu>
 </xt-modal>
</template>

<script setup>
import { computed, ref } from 'vue';

import NoticeHistory from './history/NoticeHistory.vue';
import NoticeSend from './send/NoticeSend.vue';

const editorVisible = ref(false);
const modelRef = ref(null);
const messageType = ref('send');

const list = ref([
 { 
  newIcon:'fluent:send-32-regular', type:'send',
  callBack:(item)=>{ messageType.value = item.type }
 },
 { 
  newIcon:'fluent:clock-16-regular',type:'history',
  callBack:(item)=>{ messageType.value = item.type }
 },
 { 
  newIcon:'fluent:full-screen-maximize-16-filled',index:'full',flag:true,
  callBack:()=>{ modelRef.value.updateFullState() },
 }
])

const isFull = computed(()=>{
  return modelRef.value.isFull;
})

const menuList = computed(()=>{
 if(isFull.value){
   const mapList = list.value.map((item)=>{
    if(item.index === 'full'){
     return { newIcon:'fluent:full-screen-minimize-16-filled', callBack:item.callBack, index:'full',flag:true, };
    }
    else { return item };
   })
   return mapList;
 }
 else { return list.value };
})

const openEditorModal = () =>{
 editorVisible.value = true;
}

defineExpose({
 openEditorModal
})
</script>

<style lang="scss" scoped>
:deep(.xt-bt){
 border-top: none !important;
}
:deep(.xt-br){
 border-right: none !important;
}

:deep(.menu-item){
 cursor: pointer !important;
}
</style>