<template>
 <div class="flex flex-col justify-between px-3 pt-3 pb-4" style="width:500px;">
  <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom: 46px;">
   <!-- 左侧返回按钮 -->
   <div v-if="id === 'chat'" class="flex items-center pointer active-button rounded-lg justify-center back h-10 w-10" @click="backCreate">
    <xt-ify-icon icon="fluent:chevron-left-16-filled" size="20" class="xt-text-2"/>
   </div>
   <span class="font-16-400" style="color: var(--primary-text);">创建社群</span>
   <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeCreateCom">
    <xt-ify-icon icon="fluent:dismiss-16-filled" size="20" class="xt-text-2"/>
   </div>
  </div>
  <div class="flex items-center flex-col">
   <div class="flex items-center flex-col justify-center" style="margin-bottom: 24px;">
    <!-- 替换成图标选择器 -->
    <div class="rounded-lg flex pointer items-center justify-center" style="width: 64px;height: 64px; position:relative"  @click="modelValue = true">
     <div class="overflow-hidden">
       <a-avatar :src="avatarUrl" style="height:64px;width: 64px;border-radius: 0;" :style="{'filter': bgColor?`drop-shadow(#${bgColor} 80px 0)`:'',transform:bgColor?'translateX(-80px)':''}"></a-avatar>
     </div>
     <xt-ify-icon icon="fluent:camera-16-regular" size="20" style="background:var(--active-bg);position: absolute;bottom:-3px;right:-3px;border: 2px solid var(--primary-text);border-radius: 50%;"/>
    </div>
    <xt-selectIcon :menus="['icon','emoji']" v-model="modelValue" @getAvatar="getAvatar" isUpload="true"></xt-selectIcon>
    <div class="flex items-center justify-center font-16"  style="color:var(--secondary-text);margin-top: 12px;"> 推荐图片尺寸：256*256，不能超过4MB </div>
    <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
   </div>
   <a-input v-model:value="communityName" spellcheck="false" placeholder="输入社群名称"  class="h-12 search"  style="width: 340px; margin-bottom:46px; border-radius: 12px;text-align: center;"></a-input>
   <a-input hidden="" :disabled="true" placeholder="ID:UH7631" class="h-12 search"  style="width: 340px;margin-top: 12px; margin-bottom:46px; border-radius: 12px;text-align: center;"></a-input>
  </div>
  <div class="flex items-center justify-end ">
    <xt-button h="40" w="64" class="xt-font font-16 font-400 mr-3"  @click="closeCreateCom">取消</xt-button>
    <xt-button h="40" w="64" class="xt-font font-16 font-400" type="theme" @click="finshCreateCommunity($event)">确定</xt-button>
  </div>
 </div>
</template>

<script setup>
import { ref,computed,onMounted,nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import {fileUpload} from '../../../components/card/hooks/imageProcessing';
import { communityStore } from '../store/communityStore';
import { message } from 'ant-design-vue';

const com = communityStore();

const props = defineProps({
  id:{
    type:String,
  }
});
const emits = defineEmits(['close','back']);

/**ref初始数据定义**/ 
const iconVisible = ref(false);
const innerHeight = ref(100);
const communityName = ref('');
const avatarUrl = ref('https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn');
//  传入表情选择器
const  isCustom = ref(true);
const customTitle = ref('推荐图片尺寸：256*256，不能超过4MB');
// 改变图标颜色
const bgColor = ref('');
const modelValue = ref(false);


/**事件**/ 
// 关闭
const closeCreateCom = () =>{ emits('close');};
// 返回
const backCreate = () =>{ emits('back') };
// 更换头像
const updateGroupAvatar = () =>{
  document.querySelector('#groupFileID').click();
};
const getFileInfo = async (evt) =>{
  const files = evt.target.files[0];
  const res  = await fileUpload(files);
  avatarUrl.value = res;
};
// 获取头像
const getAvatar = (avatar) =>{
  if(avatar?.indexOf('color=') >= 0){
    let color = avatar.substr(avatar.indexOf('color=') + 7 ,6);
    bgColor.value = color;
  }
  else{
    bgColor.value = ''
  }
  avatarUrl.value = avatar
};
// 创建社群
const finshCreateCommunity = async() =>{
  const textRegex  = /^.{2,16}$/;
  if(communityName.value !== '' && textRegex.test(communityName.value)){
    const createOption = {name:communityName.value,icon:avatarUrl.value};
    const res = await com.communityCreate(createOption);
    console.log('创建社群',res);
    if(res.status === 1){
      message.success(`${res.info}`);
      com.getMyCommunity();
      emits('close');
    }
    else {
      message.warning(`${res.info}`);
    }
  }
  else {
    message.warning('社群名称不能为空,并且字符长度在2~16之间');
  }
};

onMounted(()=>{
  nextTick(()=>{
    const inputDom = document.querySelector('.search');
    inputDom.focus();
  });
});
</script>

<style lang="scss" scoped>
.back{
 position: absolute;
 top:0;
 left:0;
 background: var(--secondary-bg);
}
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
 font-size: 16px;
 font-weight: 400;
}

:deep(.search){
 color: var(--secondary-text);
 &::placeholder{
   color: var(--secondary-text);
 }
}
</style>
