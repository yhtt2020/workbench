<template>
 <div class="flex flex-col">
  <div class="textarea-container">
   <a-textarea v-model:value="noticeValue" :spellcheck="false" placeholder="暂无群公告" :disabled="noticeInfo.role !== 'Owner' && noticeInfo.role !== 'Admin'" :rows="8" :maxlength="maxLength" @input="handleInput" style="color: var(--primary-text);border-radius: 12px;"></a-textarea>
   <span class="char-count">{{ currentLength }} / {{ maxLength }}</span>
  </div>
  <a-button type="primary" v-if="noticeInfo.role !== 'Member' " @click="saveGroupNotice" style="width: 100%; height: 48px; margin-top: 24px;border-radius: 12px !important;">保存</a-button> 
 </div>
</template>

<script lang="ts">
import { defineComponent,reactive,computed,toRefs,watch, } from 'vue'

export default defineComponent({
 props:['noticeInfo','server'],

 setup(props,ctx){
  const server = props.server.TUICore.tim
  
  const data = reactive({
    noticeValue:props.noticeInfo.notification,
    maxLength:300,
  })

  watch( () => props.noticeInfo.notification,(newVal)=> {
    data.noticeValue = newVal
  } )

  const currentLength = computed(() => {  // 计算当前文本输入框的字数
   return data.noticeValue.length;
  })
 
  // 修改群组公告
  const saveGroupNotice = async () =>{
    const option = {
      groupID:props.noticeInfo.groupID,
      notification: data.noticeValue,
    }

    await server.updateGroupProfile(option)
    ctx.emit('close')
    ctx.emit('updateGroupInfo')
  }

  // 监听文本输入框数据变化
  const handleInput = (evt: any) =>{
    data.noticeValue = evt.target.value.slice(0, data.maxLength)
  }



  return{
   currentLength,
   ...toRefs(data),saveGroupNotice,handleInput
  }
 }
})
</script>

<style lang="scss" scoped>

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
}

.char-count {
 position: absolute;
 bottom: 5px;
 right: 5px;
}

</style>