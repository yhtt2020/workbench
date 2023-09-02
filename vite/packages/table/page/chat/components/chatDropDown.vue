<template>
 <a-dropdown trigger="click" >
  <div class="flex pointer items-center justify-center">
   <EllipsisOutlined style="font-size: 1.25em;color:var(--secondary-text);"/>
  </div>
  <template #overlay>
   <a-menu class="custom-dropdown-menu flex-col flex items-center justify-center" style="background: var(--secondary-bg);">
    <a-menu-item v-for="(item,index) in dropDownList" 
     style="color: var(--secondary-text);width:184px;margin-bottom: 8px;" class="rounded-lg flex items-center h-11 drop-item"
     :class="{'select':dropDownIndex === index}"
     @click="selectMenuItem(item,index)"
    >
      <component :key="index" :is="item.icon" style="font-size: 1.5em;"/>
      <span class="pl-4 font-16" style="color:var(--primary-text);"> {{ item.title }}</span>
    </a-menu-item>
   </a-menu>
 </template>
 </a-dropdown>
</template>

<script>
import { defineComponent, reactive, toRefs} from 'vue'
import { EllipsisOutlined,MenuUnfoldOutlined,AppstoreOutlined} from '@ant-design/icons-vue'
import { chatStore } from '../../../store/chat'

export default defineComponent({
 components:{ 
  EllipsisOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined
 },


 setup (props,ctx) {
  const chat = chatStore()

  const data = reactive({
   dropDownList:[
    {icon:'MenuUnfoldOutlined',title:'收起边栏',type:'hidden'},
    {icon:'AppstoreOutlined',title:'切换双列',type:'change'}
   ],
   dropDownIndex:0,
  })

  const selectMenuItem = (item,index) =>{
   data.dropDownIndex = index
   if(item.type === 'change'){
     chat.setDouble(true)
     ctx.emit('updatePage')
   }else{
     
   }
  }

  return {
   ...toRefs(data),selectMenuItem,
  }
 }
})
</script>

<style lang="scss" scoped>
.custom-dropdown-menu{
 border-radius: 10px !important;
 background-color:var(--secondary-bg) !important;
 box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
 width: 200px;
 padding:8px 0;
}

:deep(.select){
 background: var(--active-bg);
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

.font-16{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}
</style>