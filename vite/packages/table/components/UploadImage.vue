<template>
  <div class="avatar-box rounded-md pointer relative" @click="uploadAvatar">
    <template v-if="currentAvatar !== ''">
      <a-avatar :src="currentAvatar" :size="48"></a-avatar>
      <div class="absolute flex items-center justify-center"
       v-if="currentAvatar !== ''" @click.stop="clearAvatar"
       style="top: 4px ; right:4px;"
      >
        <xt-ify-icon icon="fluent:dismiss-16-regular" size="16"></xt-ify-icon>
      </div>
    </template>
    <template v-else>
      <xt-ify-icon icon="fluent:add-16-regular" size="32"></xt-ify-icon>
    </template>
  </div>
  <input type="file" style="display: none;" class="uploadImage" @change="getUploadImage($event)"/>
</template>

<script setup lang="ts"> 
import { ref, watch } from "vue";
import { fileUpload } from '../components/card/hooks/imageProcessing';
import { message } from 'ant-design-vue';

export interface tabProps {
  modelValue: any;
  avatar:string,
}
const props = withDefaults(defineProps<tabProps>(), {
  avatar:'',
});

const currentAvatar = ref(props.modelValue);
const emits = defineEmits(["update:modelValue", "cb"]);

watch(()=>props.modelValue,(newVal)=>{
  currentAvatar.value = newVal;
})
watch(currentAvatar, () => {
  emits("update:modelValue", currentAvatar.value);
  emits("cb", currentAvatar.value);
});

// 清空头像
const clearAvatar = () =>{
  emits("update:modelValue", currentAvatar.value = '');
  emits("cb", currentAvatar.value = '');
}

// 触发上传头像
const uploadAvatar = () =>{
  const el:any = document.querySelector(".uploadImage");
  el.click();
}
const getUploadImage = async(evt:any) =>{
  const file = evt.target.files[0];
  console.log("file",file);
  
  // 通过正则表达式匹配是否指定的png jpg jpeg的类型文件  
  const regex =  /^image\/(jpeg|png|jpg)$/;
  const isFileType = !regex.test(file.type);
  // 限制图片尺寸仅限于2MB
  
  const isLt2M = Math.ceil(file.size / 1024 / 1024) > 2;
  console.log("isLt2M",isLt2M,Math.ceil(file.size / 1024 / 1024));
  

  if(isFileType){
    message.error('只能上传JPG和PNG格式图片');
  }
  else if(isLt2M){
    message.error('上传图片不能大于2MB');
  }
  else {
    await fileUpload(file).then((res)=>{
      emits("update:modelValue", currentAvatar.value = res);
      emits("cb", currentAvatar.value = res);
    }) 
  }
}


</script>

<style lang="scss" scoped>
.avatar-box{
  width: 72px;
  height: 72px;
  background: var(--secondary-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px !important;
}
</style>