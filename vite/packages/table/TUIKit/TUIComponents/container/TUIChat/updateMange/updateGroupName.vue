<template>
 <div class="flex items-center flex-col" style="color: var(--primary-text);">
  <div class="flex items-center flex-col justify-center" style="margin-bottom: 24px;">
    <div class="rounded-lg flex items-center justify-center" 
     style="width: 64px;height: 64px; position:relative" :style="groupInfo.role !== 'Member' ? {cursor:'pointer'}:{}"
     @click="updateGroupAvatar($event)"
    >
     <a-avatar shape="square" :size="64" :src="groupInfo.avatar"></a-avatar>
     <div class="flex items-center rounded-full p-3 justify-center" v-if="groupInfo.role !== 'Member' "
      style="width:24px;height:24px;position: absolute;bottom:-3px;right:-3px;background: var(--active-bg);border: 2px solid var(--primary-text);"
     >
      <CameraOutlined style="font-size:1em;"/>
     </div>
    </div>
    <div class="flex items-center justify-center font-16" v-if="groupInfo.role !== 'Member' " style="color:var(--secondary-text);margin-top: 12px;"> 推荐图片尺寸：256*256，不能超过4MB </div>
    <input type="file" ref="groupFileRef" style="display:none;" @change="getFileInfo($event)">
  </div>
  
  <a-input v-model:value="groupRef" :spellcheck="false" :disabled="groupInfo.role === 'Member'" style="color: var(--primary-text);border-radius: 12px !important;"></a-input>
  <a-button v-if="groupInfo.role !== 'Member' " @click="saveGroupName" style="background: var(--active-bg); width: 100%; height: 48px; margin-top: 24px;border-radius: 12px !important;">保存</a-button> 

 </div>
</template>

<script>
// import { mapActions,mapWritableState } from 'pinia'
import { defineComponent,toRefs,ref,reactive,computed} from 'vue'
import api from '../../../../../../../src/model/api'
import { CameraOutlined  } from '@ant-design/icons-vue';
import { fileUpload } from '../../../../../components/card/hooks/imageProcessing'
import { Upload } from 'ant-design-vue';

const groupName =  defineComponent({
 props:['groupInfo','server'],
 
 components:{
  CameraOutlined,Upload
 },

 setup(props,ctx){
  const server = props.server.TUICore
  const groupRef = ref(props.groupInfo.groupName);
  const groupFileRef = ref(null)
  const data = reactive({
    avatar:''
  })
  const saveGroupName = async (evt) =>{  // 保存群组名称修改后的数据
    if(data.avatar !== ''){
      const option = {
       groupID:props.groupInfo.groupID,
       name:groupRef.value,
      }
    
     await server.tim.updateGroupProfile(option)
  
     ctx.emit('updateGroupInfo')
     ctx.emit('close')
    }else{
      evt.preventDefault()
    }

  }

  // 点击群聊头像更换
  const updateGroupAvatar = async (evt) =>{  
    console.log('排查无法点击问题',props.groupInfo.role !== 'Member');
    if(props.groupInfo.role !== 'Member'){
      // console.log('获取input节点',groupFileRef.value.click());
      groupFileRef.value.click()
    }else{
      evt.preventDefault();
    }
  }

  // 获取上传文件的回调函数
  const getFileInfo = async(evt) =>{
    const files = evt.target.files[0]
    const res  = await fileUpload(files)
    data.avatar = res
    const option = {
      groupID:props.groupInfo.groupID,
      avatar:`${data.avatar}`,
    }
    await server.tim.updateGroupProfile(option)
    ctx.emit('updateGroupInfo')
    ctx.emit('close')
  }
  

  return{
   groupRef,groupFileRef,
   ...toRefs(data),saveGroupName,updateGroupAvatar,getFileInfo,
  }
 }
})
export default groupName
</script>

<style lang="scss" scoped>

</style>