<template>
 <div class="flex flex-col justify-between px-3 pt-3 pb-4" style="width:500px;">
  <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom: 46px;">
   <!-- 左侧返回按钮 -->
   <div hidden="" class="flex items-center pointer active-button rounded-lg justify-center back h-10 w-10" >
    <LeftOutlined style="font-size: 1.25em;" />
   </div>

   <span class="font-16-400" style="color: var(--primary-text);">创建社群</span>

   <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeCreateCom">
    <CloseOutlined style="font-size: 1.25em;" />
   </div>
  </div>
  
  <div class="flex items-center flex-col">

   <div class="flex items-center flex-col justify-center" style="margin-bottom: 24px;">
    <div class="rounded-lg flex pointer items-center justify-center" 
     style="width: 64px;height: 64px; position:relative"  @click="updateGroupAvatar()"
    >
    <!--  -->
     <a-avatar shape="square" :size="64" :src="avatarUrl"></a-avatar>
     <div class="flex items-center rounded-full p-3 justify-center"
      style="width:24px;height:24px;position: absolute;bottom:-3px;right:-3px;background: var(--active-bg);border: 2px solid var(--primary-text);"
     >
      <CameraOutlined style="font-size:1em;"/>
     </div>
    </div>
    <div class="flex items-center justify-center font-16"  style="color:var(--secondary-text);margin-top: 12px;"> 推荐图片尺寸：256*256，不能超过4MB </div>
    <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
   </div>

   <a-input v-model:value="communityName" placeholder="输入社群名称" class="h-12 search"  style="width: 340px; margin-bottom:46px; border-radius: 12px;text-align: center;"></a-input>
   
   <a-input hidden="" :disabled="true" placeholder="ID:UH7631" class="h-12 search"  style="width: 340px;margin-top: 12px; margin-bottom:46px; border-radius: 12px;text-align: center;"></a-input>
  
  </div>

  <div class="flex items-center justify-end ">
    <XtButton style="width:64px;color:var(--secondary-text);" class="h-10 font-16-400" @click="closeCreateCom">取消</XtButton>
    <XtButton class="h-10 ml-3" style="width:64px;background: var(--active-bg);color:var(--active-text);" @click="createCommunity">确定</XtButton>
  </div>

 </div>
</template>

<script>
import { defineComponent, reactive,toRefs } from 'vue'
import { LeftOutlined, CloseOutlined, CameraOutlined} from '@ant-design/icons-vue'
import { sUrl } from '../../../consts'
import { postMock,post} from '../../../js/axios/request'
import {fileUpload} from '../../../components/card/hooks/imageProcessing' 
import { message } from 'ant-design-vue'

const createGroupUrl = sUrl('/app/community/create')
export default defineComponent({
 components:{
  LeftOutlined,CloseOutlined,CameraOutlined
 },
 setup (props,ctx) {


  const data = reactive({
    communityName:'',
    avatarUrl:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/ERRU-oLYf-1bKi-Va_l'
  })

  const closeCreateCom = () =>{
    ctx.emit('close')
  }

  // 创建社群
  const createCommunity = async(evt) =>{
    const chineseCharReg = /[\u4e00-\u9fa5]/g; // 匹配2-16个汉字
    const nonChineseCharReg = /[^\u4e00-\u9fa5]/g; // 匹配4-32个字符
    const chineseCharCount = (data.communityName.match(chineseCharReg) || []).length;
    const nonCharCount = (data.communityName.match(nonChineseCharReg) || []).length;
    const totalCount = chineseCharCount + nonCharCount

    const option = {
      name:data.communityName,
      icon:data.avatarUrl
    }

    if((chineseCharCount >= 2 && chineseCharCount <= 16 && totalCount <= 32) || (totalCount >= 4 && totalCount <= 32)){
      const res = await postMock(createGroupUrl,option)
      // console.log('排查结果',res)
      if(res.status === 1){
       message.success(`${res.info}`)
       ctx.emit('close')
      }else{
      
      }
    }else{
      evt.preventDefault();
      message.error('不能超过2-16个汉字')
    }
    
    
  }


  // 获取头像
  const updateGroupAvatar = async () =>{  
    document.querySelector('#groupFileID').click()
  }

  // 头像上传后返回
  const getFileInfo = async(evt) =>{
    const files = evt.target.files[0]
    const res  = await fileUpload(files)
    console.log('获取头像::>>',res)
    data.avatarUrl = res
  }

  return {
    ...toRefs(data),
   closeCreateCom,createCommunity,updateGroupAvatar,
   getFileInfo
  }
 }
})
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
 font-family: PingFangSC-Regular;
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