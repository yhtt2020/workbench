<template>
  <xt-modal v-model="createVisible" title="创建社群" :index="500">
    <template #nav>
      <xt-button v-if="id === 'chat'"  @click="backCreate" w="40" h="40" style="border-radius: 8px;">
        <div class="flex items-center justify-center">
          <xt-ify-icon icon="fluent:chevron-left-16-filled" size="20" class="xt-text-2"/>
        </div>
      </xt-button>
    </template>
    <div class="flex flex-col" style="width:500px;">
      <!-- 替换成图标选择器 -->
      <div class="flex flex-col items-center justify-center w-full mb-4">
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

      <!-- 输入框 -->
      <div class="flex items-center justify-center w-full mb-4">
        <a-input v-model:value="communityName" spellcheck="false" placeholder="输入社群名称"  class="h-12 search"  style="width: 340px;  border-radius: 12px;text-align: center;"></a-input>
        <a-input hidden="" :disabled="true" placeholder="ID:UH7631" class="h-12 search"  style="width: 340px;margin-top: 12px;  border-radius: 12px;text-align: center;"></a-input>
      </div>

      <!-- 底部按钮 -->
      <div class="flex items-center justify-end ">
        <xt-button h="40" w="64" class="xt-font font-16 font-400 mr-3"  @click="closeCreateCom">取消</xt-button>
        <xt-button h="40" w="64" class="xt-font font-16 font-400" type="theme" @click="finshCreateCommunity($event)">确定</xt-button>
      </div>
    </div>
  </xt-modal>
</template>

<script setup>
import { ref,getCurrentInstance, onMounted,nextTick} from 'vue';
import { storeToRefs } from 'pinia';
import {fileUpload} from '../../../components/card/hooks/imageProcessing';
import { communityStore } from '../store/communityStore';
import { message } from 'ant-design-vue';

const { proxy } = getCurrentInstance();
const emits = defineEmits(['back']);
const props = defineProps({
  id:{
    type:String,
  }
});
const com = communityStore();

/**ref初始数据定义**/ 
const iconVisible = ref(false);
const innerHeight = ref(100);
const communityName = ref('');
const avatarUrl = ref('https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn');
const createVisible = ref(false);
//  传入表情选择器
const  isCustom = ref(true);
const customTitle = ref('推荐图片尺寸：256*256，不能超过4MB');
// 改变图标颜色
const bgColor = ref('');
const modelValue = ref(false);

// 触发开启弹窗
const openCreateModal = () =>{
  createVisible.value = true;
};
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
const closeCreateCom = () =>{
  createVisible.value = false;
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
  proxy.$bus.on('createModal',()=>{
    openCreateModal();
  });
  nextTick(()=>{
    if(createVisible.value){
      const inputDom = document.querySelector('.search');
      inputDom.focus();
    }
  });
})
</script>

