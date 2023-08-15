<template>
 <div class="flex flex-col">
  <div class="textarea-container">
   <a-textarea v-model:value="noticeValue" placeholder="暂无群公告" :disabled="notice.role !== 'Owner' && notice.role !== 'Admin'" :rows="8" :maxlength="maxLength" @input="handleInput" style="color: var(--primary-text);border-radius: 12px;"></a-textarea>
   <span class="char-count">{{ currentLength }} / {{ maxLength }}</span>
  </div>
  <a-button type="primary" v-if="notice.role === 'Owner' && notice.role === 'Admin'" @click="saveGroupNotice" style="width: 100%; height: 48px; margin-top: 24px;border-radius: 12px !important;">保存</a-button> 
 </div>
</template>

<script lang="ts">
import { defineComponent,ref,reactive,computed } from 'vue'

export default defineComponent({
 props:['notice','server'],

 setup(props,ctx){
  const server = props.server.TUICore.tim
  
  const noticeValue = ref<string>(props.notice.notification !== "" ? props.notice.notification : "")
  const maxLength = 200;

  const currentLength = computed(() => {  // 计算当前文本输入框的字数
   return noticeValue.value.length;
  })
 

  const saveGroupNotice = async () => {  // 修改群组公告
    const option = {
      groupID:props.notice.groupID,
      notification: noticeValue.value,
    }

    await server.updateGroupProfile(option)
    ctx.emit('close')
    
  }

  const handleInput = (evt: any) =>{  // 监听文本输入框数据变化
   noticeValue.value = evt.target.value.slice(0, maxLength);
  }

  return{
   noticeValue,maxLength,currentLength,
   saveGroupNotice,handleInput
  }
 }
})
</script>

<style lang="scss" scoped>

.textarea-container {
 position: relative;
}

.char-count {
 position: absolute;
 bottom: 5px;
 right: 5px;
}

</style>