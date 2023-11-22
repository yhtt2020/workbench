<template>
 <a-dropdown :trigger="['click']" :placement="title !== undefined ? 'bottom':'bottomRight'" :overlayStyle="{ zIndex:'10000 !important',minWidth:'0px !important'}" @visible-change="callBackData">
  <div v-if="enableButton === false" class="flex pointer items-center" :class="title !== undefined ? 'justify-between':'justify-center'">
   <span class="font-16 font-500 xt-font " :class="title !== undefined ? 'xt-active-text' : ''">{{ title }}</span>
   <DorpIcon :icon="newIcon" :class="title !== undefined ? 'xt-active-text' : 'xt-text-2'" style="font-size: 1.25rem;"></DorpIcon>
  </div>

  <xt-button class="xt-bg category-button" v-else :style="unbutton ? {width:'0',height:'0'} : {height:'40px',width:'40px'}">
    <div class="flex items-center justify-center">
      <DorpIcon :icon="newIcon" :class="title !== undefined ? 'xt-active-text' : 'xt-text-2'" style="font-size: 1.25rem;"></DorpIcon>
    </div>
  </xt-button>

  <template #overlay>
   <a-menu class="custom-dropdown-menu flex-col flex items-center justify-center" style="background: var(--secondary-bg);">
    <template v-for="(item,index) in list">
     <a-menu-item v-if=" index <  list.length - 2 " style="color: var(--secondary-text);width:184px;margin-bottom: 8px;" class="rounded-lg flex items-center h-11 drop-item"
     @click="item.callBack">
       <DorpIcon :icon="item.newIcon" style="font-size: 1.25rem;"/>
       <span class="pl-4 font-16 font-400" style="color:var(--primary-text);"> {{ item.title }}</span>
     </a-menu-item>

     <a-divider v-if="index ===  list.length - 2 && list.length === 5" style="height: 1px; margin: 0 0 8px 0;  background-color: var(--divider);"></a-divider>

     <a-menu-item v-if=" index >= list.length - 2 "  style="color: var(--secondary-text);width:184px;margin-bottom: 8px;" class="rounded-lg flex items-center h-11 drop-item"
      @click="item.callBack">
       <DorpIcon :icon="item.newIcon" style="font-size: 1.25rem;"/>
       <span class="pl-4 font-16 font-400" :style="item.type === 'deletePacket' ? { color:'var(--error)' } : { color:'var(--primary-text)' }"> {{ item.title }}</span>
     </a-menu-item>
    </template>
   </a-menu>
  </template>
 </a-dropdown>
</template>

<script>
import {Icon as DorpIcon} from '@iconify/vue'

export default {
 props:['newIcon','list','title','enableButton','id','unbutton'],
 components:{
  DorpIcon
 },
 methods:{
  callBackData(){
    if(this.id !== null ){
      this.$emit('callbackParams',this.id)
    }else{
      return;
    }
    
  }
 }
}
</script>

<style lang="scss" scoped>
.custom-dropdown-menu{
 border-radius: 10px !important;
 background-color:var(--secondary-bg) !important;
 box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
 width: 200px;
 padding: 8px 0;
}

:deep(.select){
 background: var(--active-secondary-bg);
 color: var(--active-text) !important;
}

:deep(.drop-item){
  &:last-of-type{
   margin-bottom:0 !important;
  }
}

:deep(.ant-dropdown-menu-title-content){
 display:flex;
 align-items:center;

}


:deep(.ant-dropdown-menu-item){
 &:hover{
   background-color: var(--active-secondary-bg) !important;
 }
}

:deep(.ant-divider-horizontal){
 min-width:78% !important;
 width:78% !important;
}
</style>