<template>
  <teleport to='body' >
   <Modal v-if="editorVisible" v-model:visible="editorVisible" :blurFlag="true">
    <div class="flex flex-col my-4" style="width:712px;height: 552px;">
     <ModalTop title="编辑社群(开发中)" @close="editorVisible = false"/>
     <div class="flex px-6 pb-6 justify-between">
      <div class="flex flex-col" style="width: 320px;">
       <div class="w-full flex items-center mb-9 justify-center ">
         <div class="w-16 h-16 relative pointer">
          <a-avatar shape="square" :size="64" :src="avatar"></a-avatar>
          <div class="update-icon rounded-full flex items-center justify-center w-6 h-6">
           <EditorIcon icon="fluent:camera-16-regular" style="font-size: 1.3rem;"/>
          </div>
         </div>
       </div>
       <a-input v-model:value="editorValue"  spellcheck="false" class="h-12 xt-bg xt-text font-16 font-400 xt-font text-center" style="margin-bottom: 24px;border-radius: 12px;"></a-input>
       <div class="textarea-container">
        <a-textarea v-model:value="summary" :maxLength="maxLength" class="xt-text xt-bg font-16 font-400 xt-font" spellcheck="false" style="border-radius: 10px;height: 80px;"/>
        <span class="char-count xt-text-2 font-14 font-400 xt-font">{{ currentLength }}/{{ maxLength }}</span>
       </div>
       <span class="mt-6 xt-font xt-text font-16 font-400 mb-4">封面</span>
       <div class="flex">
         <div class="w-16 h-16 rounded-md mr-3" style="border: 1px dashed rgba(255,255,255,0.1);">
          <img :src="cover" class="w-full h-full object-cover rounded-md"/>
         </div>
         <div class="flex flex-col justify-center">
           <span class="xt-font xt-text-2 font-14 font-400">推荐尺寸：560 x 300 px，</span>
           <span class="xt-font xt-text-2 font-14 font-400">最大不超过 2 MB</span>
         </div>
       </div>
      </div>
      <div class="flex" style="width: 320px; ">
       <div class="w-full xt-bg-2  rounded-md" style="padding: 30px 20px;height: 400px;">
         <div class="h-full xt-bg rounded-xl" style="width: 280px;height: 340px;">
          <div style="width: 280px;height: 150px;" class="relative">
           <img :src="cover" class="w-full h-full object-cover rounded-t-xl"/>
           <div class="w-12 h-12 flex items-center justify-center" style="position: absolute; bottom:-16px;left:16px;">
            <a-avatar shape="square" :size="48" :src="avatar"></a-avatar>
           </div>
          </div>
          <div class="flex flex-col pb-4 px-4" style="margin-top: 30px;">
           <span class="xt-text font-18 font-500 xt-font">{{ editorValue }}</span>
           <div class="flex" style="padding: 14px 0 15px 0;">
            <span class="xt-theme-bg-2 mr-3.5 rounded-md py-0.5 px-1.5" style="color:var(--active-bg)">
             社群号:{{ content.no }}
            </span>
            <span  class="rounded-md" style="padding: 3px 5px; background: rgb(250, 173, 20,0.2);color:rgb(250, 173, 20);">
             {{ content.level }}级
            </span>
           </div>
           <div class="summary xt-font xt-text font-14 font-400  pb-2">
            {{ summary }}
           </div>
           <div class="flex w-full justify-between  ">
            <span class="xt-text-2 xt-font font-12 font-400">{{ content.memberNum}}人</span>
            <span class="xt-text-2 xt-font font-12 font-400">{{join}}</span>
           </div>
          </div>
         </div>
       </div>
      </div>
     </div>
     <div class="flex px-6 items-center justify-end w-full">
      <xt-button w="64" h="40" class="category-button mr-3" @click="editorVisible = false">取消</xt-button>
      <xt-button w="64" h="40" type="theme" @click="saveEditor">保存</xt-button>
     </div>
    </div>
   </Modal>
  </teleport>
</template>

<script>
import { Icon as EditorIcon } from '@iconify/vue'

import Modal from '../../../../components/Modal.vue';
import ModalTop from '../ModalTop.vue';

export default {
 components:{
  ModalTop,Modal,EditorIcon,
 },

 props:['no','content'],

 data(){
  return{
   editorVisible:false,
   editorValue:'',
   summary:'《荒野大镖客》是一款由Rockstar Games开发和发行的动作冒险游戏。',
   maxLength:50,
   cover:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG',
   avatar:'',
   join:'',
  }
 },

 mounted(){
 },

 computed:{
  currentLength(){
   console.log('查看summary',this.summary.length);
   return this.summary.length
  }
 },

 methods:{
  openEditorModal(){
   this.editorVisible = true;
   this.editorValue = this.content.name !== undefined ? this.content.name : '';
   this.summary = this.content.summary !== undefined ? this.content.summary : this.summary;
   this.avatar = this.content.avatar !== undefined ? this.content.avatar : '';
   this.join = this.content.type === 'public' ? '公开加入' : '私密加入';
  },
  // 保存社群信息的修改
  saveEditor(){
    
  }
 },
};
</script>

<style lang="scss" scoped>
/**
:deep(.ant-input) {
 color: var(--secondary-text) !important;
 &::placeholder {
  color: var(--secondary-text) !important;
 }
}
**/
.textarea-container {
 position: relative;
 & textarea::-webkit-scrollbar {
  width: 2px !important;
 }
 & textarea::-webkit-scrollbar-thumb{
  background: var(--secondary-bg) !important;
 }
 & textarea::-webkit-scrollbar-thumb:hover{
  background: #6666 !important;
 }
 & textarea{
  padding: 9px 8px 4px 15px !important;
 }
}
.char-count {
 position: absolute;
 bottom: 5px;
 right: 20px;
}
.update-icon{
 position: absolute;
 right:-3px;
 bottom:-6px;
 border: 2px solid var(--primary-text);
 background: var(--active-bg);
}
.summary{
 display: -webkit-box;
 -webkit-box-orient: vertical;
 -webkit-line-clamp: 2;
 white-space: break-spaces;
 overflow: hidden;
 max-width: 248px;
}
</style>