<template>
  <xt-modal v-model="buttonVisible" title="添加按钮链接" :scrollbarPadding="{paddingRight:'0px',paddingLeft:'0px'}">
   <div style="width: 500px;" class="flex items-center flex-col justify-center">
    <a-input spellcheck="false" v-model:value="linkName" class="h-10" style=" min-width: 452px; margin-bottom: 16px;border-radius: 10px;" placeholder="请输入按钮名称"></a-input>
    <a-textarea class="h-10" spellcheck="false" v-model:value="linkValue"  style="border-radius: 10px;min-width: 452px;" placeholder="请输入链接地址"></a-textarea>
   </div>
   <div style="height: 54px;"></div>
   <div class="flex w-full justify-end items-center  ">
    <xt-button w="64" h="40" class="mr-3" style="border-radius:10px;" @click="buttonVisible = false">
     <div class="flex items-center justify-center xt-text-2 font-400 font-14">
      取消
     </div>
    </xt-button>
    <xt-button w="64" h="40" type="theme" @click="addButtonLink" style="border-radius:10px;">
     <div class="flex items-center justify-center  font-400 font-14">
      确定
     </div>
    </xt-button>
   </div>
  </xt-modal>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';

const notice = noticeStore();
const { msgSetting } = storeToRefs(notice);

const buttonVisible = ref(false);
const linkName = ref('');
const linkValue = ref('');

// 开启按钮链接添加弹窗
const openButtonModal = () =>{
 buttonVisible.value = true;
}


// 添加按钮链接
const addButtonLink = () =>{
 msgSetting.value.urls.push({close:false,type:'link',title:linkName.value,href:linkValue.value});
 linkName.value = ''
 linkValue.value = ''
 buttonVisible.value = false
}


defineExpose({
 openButtonModal
})
</script>

<style lang="scss" scoped>
</style>