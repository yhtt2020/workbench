<template>
 <div class="flex flex-col justify-between px-3 pt-3 pb-4" style="width:500px;">
  <div class="flex w-full h-10 items-center justify-center" style="position: relative;margin-bottom: 46px;">
   <!-- 左侧返回按钮 -->
   <div v-if="id === 'chat'" class="flex items-center pointer active-button rounded-lg justify-center back h-10 w-10" @click="backCreate">
    <communityIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;color: var(--secondary-text);"/>
   </div>
   <span class="font-16-400" style="color: var(--primary-text);">创建社群</span>
   <div class="flex items-center pointer active-button rounded-lg justify-center close h-10 w-10" @click="closeCreateCom">
    <communityIcon icon="fluent:dismiss-16-filled" style="font-size: 1.5rem;color: var(--secondary-text);"/>
   </div>
  </div>
  <div class="flex items-center flex-col">
   <div class="flex items-center flex-col justify-center" style="margin-bottom: 24px;">
    <!-- 替换成图标选择器 -->
    <div class="rounded-lg flex pointer items-center justify-center" style="width: 64px;height: 64px; position:relative"  @click="modelValue = true">
     <div class="overflow-hidden">
       <a-avatar :src="avatarUrl" style="height:64px;width: 64px;border-radius: 0;" :style="{'filter': bgColor?`drop-shadow(#${bgColor} 80px 0)`:'',transform:bgColor?'translateX(-80px)':''}"></a-avatar>
     </div>
     <communityIcon icon="fluent:camera-16-regular" width="20" height="20"
     style="font-size: 1.5rem;width:24px;height:24px;background:var(--active-bg);position: absolute;bottom:-3px;right:-3px;border: 2px solid var(--primary-text);border-radius: 50%;"
     color="var(--secondary-text)"/>
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

<script>
import { mapActions,mapWritableState } from 'pinia'
import {fileUpload} from '../../../components/card/hooks/imageProcessing'
import { message } from 'ant-design-vue'
import { communityStore } from '../store/communityStore'
import { Icon as communityIcon } from '@iconify/vue'
import SelectIcon from '../../../../selectIcon/page/index.vue'

export default {
 props:['id'],

 components:{
   communityIcon,
   SelectIcon,
 },

 data(){
   return{
     //
     iconVisible:false,
     innerHeight:100,

     communityName:'',
     avatarUrl:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/jmPD-I__T-SMyc-LMzn',
     //  传入表情选择器
     isCustom:true,
     customTitle:'推荐图片尺寸：256*256，不能超过4MB',
     // 改变图标颜色
     bgColor:'',
     modelValue:false,
   }
 },

 computed:{

 },

 mounted(){
   this.$nextTick(()=>{
     const inputDom = document.querySelector('.search')
     inputDom.focus()
   })
 },

 methods:{
   ...mapActions(communityStore,['communityCreate','getMyCommunity']),

   closeCreateCom(){
     this.$emit('close')
   },
   backCreate(){
     this.$emit('back')
   },
   // 更换头像
   async updateGroupAvatar(){
     document.querySelector('#groupFileID').click()
   },
   async getFileInfo(evt){
     const files = evt.target.files[0]
     const res  = await fileUpload(files)
     // console.log('获取头像::>>',res)
     this.avatarUrl = res
   },

   // 获取头像
   getAvatar(avatar){
     if(avatar?.indexOf('color=') >= 0){
       let color = avatar.substr(avatar.indexOf('color=') + 7 ,6)
       this.bgColor = color
     }else{
       this.bgColor = ''
     }
     this.avatarUrl = avatar
   },

   // 创建社群
   async finshCreateCommunity(evt){
     const chineseCharReg = /[\u4e00-\u9fa5]/g; // 匹配2-16个汉字
     const chineseCharCount = (this.communityName.match(chineseCharReg) || []).length;
     // // const nonChineseCharReg = /[^\u4e00-\u9fa5]/g; // 匹配4-32个字符
     // // const nonCharCount = (this.communityName.match(nonChineseCharReg) || []).length;
     // console.log('排查问题',chineseCharCount);
     // console.log('查看条件',chineseCharCount >= 2 && chineseCharCount <= 16);
     // // const totalCount = chineseCharCount + nonCharCount
     if(chineseCharCount >= 2 && chineseCharCount <= 16){
       const option = {
        name:this.communityName,
        icon:this.avatarUrl
       };
       // console.log('查看参数',option);
       const res = await this.communityCreate(option);
       console.log('排查结果',res);
       if(res.status === 1){
        message.success(`${res.info}`);
        await this.getMyCommunity();
       }else{
        message.error(`${res.info}`);
       }
     }else{
       message.error('社群名称长度的范围需要在2-16个字符之间');
     }
     this.$emit('close');
   }


 }
}

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
