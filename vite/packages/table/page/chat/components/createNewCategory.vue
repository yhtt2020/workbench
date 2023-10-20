<template>
 <div class="flex flex-col my-3" style="width:500px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <span class="font-16-400" style="color:var(--primary-text);">添加分组</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeNewGroup">
    <CategoryIcon icon="fluent:dismiss-16-filled"  style="font-size: 1.25em;color: var(--secondary-text);"/>
   </div>
  </div>

  <div class="flex flex-col px-6">
   <a-input placeholder="分组名称" v-model:value="categoryName" class="h-10 search" style="border-radius: 8px;text-align: center;" @pressEnter="submitCategory"></a-input>
   <div class="mt-4 flex items-center justify-end pt-4">
    <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeNewGroup">取消</XtButton>
    <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="submitCategory">确定</XtButton>
   </div>
  </div>
 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import { Icon as  CategoryIcon } from '@iconify/vue'
import { communityStore } from '../store/communityStore'
import { message } from 'ant-design-vue'

export default {
  props: ["no"],

  components:{
   CategoryIcon
  },

  data() {
    return {
     categoryName:'',
    }
  },

  mounted(){
    this.$nextTick(()=>{
      const inputDom = document.querySelector('.search')
      inputDom.focus()
    })
  },

  methods: {
   ...mapActions(communityStore,['createChannel','getCategoryData']),
   // 关闭弹窗
   closeNewGroup(){
    this.$emit('close')
   },

   // 创建完成
   async submitCategory(){
    if(this.categoryName !== '' && this.no !== '1'){
     const option = {   
      name:this.categoryName, communityNo:this.no,
      type:'category',role:'category',
     }
    //  console.log('排查参数问题',option);
     
     const categoryRes =  await this.createChannel(option)
    //  console.log('查看状态',categoryRes);
   
     if(categoryRes.status === 1){
      message.success(`${categoryRes.info}`)
      await this.getCategoryData(this.no)
      this.closeNewGroup()
     }else{
      message.error(`${categoryRes.info}`)
      this.closeNewGroup()
     }

    }
   }

  },
}
</script>

<style lang="scss" scoped>
.font-16-400 {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.close-channel {
  position: absolute;
  top: 1px;
  right: 12px;
}

.active-button {
  &:active {
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover {
    opacity: 0.8;
  }
}

.font-14-400 {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

:deep(.ant-input){
  color: var(--secondary-text) !important;
  font-size: 1rem;
  &::placeholder{
    color: var(--secondary-text) !important;
  }
}
</style>