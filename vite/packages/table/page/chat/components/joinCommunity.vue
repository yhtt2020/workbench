<template>
 <div style="width:500px;" class="flex flex-col justify-between px-3 pt-3 pb-4">
  <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom:16px;">
   <span class="font-16-400" style="color: var(--primary-text);">加入社群</span>

   <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeJoinCom">
    <CloseOutlined style="font-size: 1.25em;" />
   </div>
  </div>

  <div class="w-full flex items-center justify-center" style="margin: 0 0 16px 0;">
    <div style="width:452px;" >
      <a-input placeholder="搜索" :spellcheck="false" v-model:value="searchId" class="h-10" style="border-radius: 10px;">
      <!-- @keyup.enter="searchGroup" -->
        <template #suffix>
          <SearchOutlined />
          <!-- @click="searchGroup" -->
        </template>
      </a-input>
    </div>
  </div>

  <div class="w-full flex items-center justify-center mb-6">
    <div style="width:452px; color:var(--secondary-text);" class="font-14-400">
      推荐社群
    </div>
  </div>


 </div>
</template>

<script>
import { defineComponent } from 'vue'
import { CloseOutlined,SearchOutlined } from '@ant-design/icons-vue'

export default defineComponent({
 components:{
  CloseOutlined,SearchOutlined
 },
 setup (props,ctx) {
  const closeJoinCom = () =>{
    ctx.emit('close')
  }  
  
  return {
   closeJoinCom
  }
 }
})
</script>

<style lang="scss" scoped>
.close{
 position: absolute;
 top:0;
 right:-1px;
 background: var(--secondary-bg);
}

.active-button{
 &:active{
  filter: brightness(0.8);
  opacity: 0.8;
 }
 &:hover{
  opacity: 0.8;
 }
}

.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}


:deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 1.15em;
  &::placeholder{
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-input-suffix){
  color: var(--secondary-text) !important;
  font-size: 1.5em;
  cursor: pointer;
}

.font-14-400{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}
</style>