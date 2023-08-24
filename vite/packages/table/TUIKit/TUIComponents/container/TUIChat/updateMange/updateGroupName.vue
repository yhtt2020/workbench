<template>
 <div class="flex items-center flex-col" style="color: var(--primary-text);">
  <div class="flex items-center justify-center" style="margin-bottom: 24px;">
    <div class="rounded-lg pointer flex items-center justify-center" style="width: 64px;height: 64px;">
     <a-avatar shape="square" :size="40" :src="groupInfo.avatar"></a-avatar>
    </div>
  </div>
  
  <a-input v-model:value="groupRef" :spellcheck="false" :disabled="groupInfo.role === 'Member'" style="color: var(--primary-text);border-radius: 12px !important;"></a-input>
  <a-button type="primary" v-if="groupInfo.role !== 'Member' " @click="saveGroupName" style="width: 100%; height: 48px; margin-top: 24px;border-radius: 12px !important;">保存</a-button> 

 </div>
</template>

<script>
// import { mapActions,mapWritableState } from 'pinia'
import { defineComponent,toRefs,ref,reactive,computed} from 'vue'

const groupName =  defineComponent({
 props:['groupInfo','server'],
  
 setup(props,ctx){
  const server = props.server.TUICore
  const groupRef = ref(props.groupInfo.groupName);

  const saveGroupName = async () =>{  // 保存群组名称修改后的数据

    const option = {
      groupID:props.groupInfo.groupID,
      name:groupRef.value
    }
    
    await server.tim.updateGroupProfile(option)
     
    ctx.emit('close')
    
  }

  return{
   saveGroupName,groupRef
  }
 }
})
export default groupName
</script>

<style lang="scss" scoped>

</style>