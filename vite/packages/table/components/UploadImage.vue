<template>
  <!-- 图片上传组件 -->
  <a-upload :style="size" class="pointer" 
   @change="uplaodImageChange" :before-upload="beforeUpload" 
   :show-upload-list="false"
  >
    <Icon icon="tianjia2" style="font-size: 2.3em;"></Icon>
  </a-upload>
</template>

<script>
import { mapActions } from 'pinia';
import api from '../../../src/model/api';
import { message } from 'ant-design-vue';
import cache from './card/hooks/cache';
import { frameStore } from '../store/avatarFrame';
export default {
  name:'UploadImage',
  methods:{
    ...mapActions(frameStore,['saveAvatarUrl']),
    uplaodImageChange(info){  // info 上传文件的所有信息  
      const formData = new FormData();
      formData.append("file", info.fileList[0].originFileObj)
      api.getCosUpload(formData,(err,res)=>{
        if(!err){
          message.error('数据上传失败')
        }else{
          const avatarUrl = 'http://'+ res.data.data
          cache.set('avatar_url',avatarUrl)
          this.saveAvatarUrl()
        }
      })
    },
    beforeUpload(file){  // 上传之前的准备工作 
      const regex =  /^image\/(jpeg|png|jpg)$/;  // 通过正则表达式匹配是否指定的png jpg jpeg的类型文件  
      const isFileType = !regex.test(file.type)
      if(isFileType){ 
        message.error('只能上传JPG和PNG格式图片');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('上传图片不能大于2MB');
      }
      return isFileType && isLt2M;
    },
  },
}
</script>

<style lang="scss" scoped>

</style>