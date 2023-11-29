<template>
  <div class="flex items-center flex-col" style="color: var(--primary-text);">
    <template v-if="isAdmin">
      <div class="flex items-center flex-col justify-center" style="margin-bottom: 24px;position:relative;">
        <div class="flex items-center flex-col justify-center" style="margin-bottom: 28px;">
          <!-- 替换成图标选择器 -->
         <div class="rounded-lg flex pointer items-center justify-center" style="width: 64px;height: 64px; position:relative"  @click="modelValue = true">
          <!--头像 -->
          <!-- <a-avatar shape="square" :size="64" :src="avatarUrl"></a-avatar> -->
          <div class="overflow-hidden">
           <a-avatar :src="avatar" :size="64" style="height:64px;width: 64px;border-radius: 0;" :style="{'filter': bgColor?`drop-shadow(#${bgColor} 80px 0)`:'',transform:bgColor?'translateX(-80px)':''}"></a-avatar>
          </div>
          <UpdateIcon icon="fluent:camera-16-regular" width="20" height="20" style="font-size: 1.5rem;width:24px;height:24px;position: absolute;bottom:-3px;right:-3px;border: 2px solid var(--primary-text);background:var(--active-bg);border-radius: 50%;" color="var(--secondary-text)"/>
         </div>
         <xt-select-icon :menus="['icon','emoji']" v-model="modelValue" @getAvatar="getAvatar" isUpload="true"></xt-select-icon>
         <!-- <SelectIcon @isIconShow="iconVisible = false" :goodVisible="true" :windowHeight="innerHeight" @getAvatar="getAvatar" v-show="iconVisible" :isCustom="isCustom" :customTitle="customTitle"></SelectIcon> -->
         <!-- <div class="flex items-center justify-center font-16"  style="color:var(--secondary-text);margin-top: 12px;"> 推荐图片尺寸：256*256，不能超过4MB </div> -->
         <input type="file" id="groupFileID" style="display:none;" @change="getFileInfo($event)">
         </div>
      </div>

      <a-input v-model:value="groupName" ref="groupRef" :spellcheck="false"  style="color: var(--primary-text); text-align: center; border-radius: 12px !important;"></a-input>

      <xt-button  @click="saveGroupName" style="background: var(--active-bg); width: 100%; height: 48px; margin-top: 24px;border-radius: 12px !important;">保存</xt-button> 
    </template>

    <template v-else>
      <div class="flex flex-col w-full items-center justify-center">
        <a-avatar shape="square" :size="64" :src="info.avatar"></a-avatar>
        <a-input v-model:value="info.groupName" :spellcheck="false" :disabled="true" style="margin-top: 12px;color: var(--primary-text);border-radius: 12px !important;text-align: center;"></a-input>
      </div>
    </template>

  </div>
</template>

<script>
import {Icon as UpdateIcon} from '@iconify/vue'
import SelectIcon from '../../../../../../selectIcon/page/index.vue'
import { fileUpload } from '../../../../../components/card/hooks/imageProcessing'

export default {
  props:['info'],

  components:{
    UpdateIcon,SelectIcon
  },
  
  data(){
    return{
      avatar:this.info.avatar,
      modelValue:false,
      innerHeight:100,
      bgColor:'',
      isCustom:true,
      groupName:this.info.groupName,
      server:window.$TUIKit,
    }
  },

  mounted(){
    this.$nextTick(()=>{
       if(this.isAdmin){
        console.log('查看问题',this.$refs.groupRef);
        this.$refs.groupRef.focus()
       }
    })
  },

  computed:{
    isAdmin(){
      if(this.info){
        return this.info.role !== 'Member'
      }
    }
  },

  methods:{
    onShowSelect(){
      this.iconVisible= !this.iconVisible
      this.innerHeight = window.innerHeight
    },

    // 获取头像
    getAvatar(avatar){
     if(avatar.indexOf('color=') >= 0){
      let color = avatar.substr(avatar.indexOf('color=') + 7 ,6)
      this.bgColor = color
     }else{
      this.bgColor = ''
     }
     this.avatar = avatar
    },

    // 更换头像
    async updateGroupAvatar(){
     document.querySelector('#groupFileID').click()
    },
    async getFileInfo(evt){
     const files = evt.target.files[0]
     const res  = await fileUpload(files)
     this.avatar = res
    },


    // 保存进行更改
    async saveGroupName(){
      const option = {
       groupID:this.info.groupID,
       name:this.groupName,
       avatar:this.avatar
      }
      // console.log('排查参数是否正确',option);
      await this.server.tim.updateGroupProfile(option)
      this.$emit('updateGroupInfo')
      this.$emit('close')
    }

  },

  watch:{
    'info':{
      handler(newVal){
        // console.log('排查props参数变化',newVal);
        this.avatar = newVal.avatar,
        this.groupName = newVal.groupName
      },
      immediate:true,
      deep:true,
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.float-icon){
  top:72px !important;
}
</style>