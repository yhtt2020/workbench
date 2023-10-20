<template>
 <div class="flex flex-col my-3" style="width:667px;">
  <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
   <div class="back-button w-10 h-10 flex items-center rounded-lg pointer active-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
    <ChatIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;"/>
   </div>
   <span class="font-16-400" style="color:var(--primary-text);">选择群聊</span>
   <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer active-button justify-center"  style="background: var(--secondary-bg);" @click="closeGroup">
    <ChatIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;" />
   </div>
  </div>

  <div class="flex px-6">
   <div class="flex flex-col" style="width: 293px;">
    <a-input class="h-10 search" ref="searchRef" v-model:value="searchKeyWord" spellcheck="false" style="border-radius: 12px;" placeholder="搜索群名称、ID" @input="searchGroup" @pressEnter="searchGroup">
     <template #suffix>
       <ChatIcon icon="fluent:search-20-filled" style="font-size: 1.25rem;color:var(--secondary-text);" class="pointer" @click="searchGroup"/>
     </template>
    </a-input>

    <span class="my-4 font-14-400" style="color:var(--secondary-text);">{{title}}</span>

    <vue-custom-scrollbar :settings="settingsScroller" style="height:335px;">
     <div class="flex flex-col">
       <div v-for="(item,index) in filterList" :class="{'select-bg':isSelected(index)}" class="flex rounded-lg items-center px-4 py-3 mb-3" @click="leftListClick(item)">
        <a-avatar shape="square" :size="40" :src="item.avatar"></a-avatar>
        <span class="font-16-400 ml-4" style="color:var(--primary-text);">{{ item.name }}</span>
       </div>
     </div>
    </vue-custom-scrollbar>
   </div>
   
   <a-divider type="vertical" style="height:442px; margin: 0 16px; background-color:var(--divider);" />
   
   <div class="flex flex-col justify-between" style="width: 293px;">
    <span class="category-14-400" style="color:var(--secondary-text);">已选({{ selectGroup.length }}个)</span>
    <vue-custom-scrollbar :settings="settingsScroller" style="height:335px;">
     <div class="flex flex-col">
      <div v-for="item in selectGroup" class="flex  items-center justify-between px-4 py-3 mb-2">
        <div class="flex items-center">
         <a-avatar shape="square" :size="40" :src="item.avatar"></a-avatar>
         <span class="font-16-400 ml-4" style="color:var(--primary-text);">{{ item.name }}</span>
        </div>
        <div class="flex items-center pointer justify-center" @click="removeGroup(item)">
         <ChatIcon icon="zondicons:minus-solid" style="font-size: 1.25rem;color:var(--disable-text);" />
        </div>
      </div>
     </div>
    </vue-custom-scrollbar>
     
    <div class="flex items-center justify-end">
     <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeGroup">
      取消
     </XtButton>
 
     <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="submit">
      确定
     </XtButton>
    </div>
   </div>
  </div>

  

 </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia'
import _ from 'lodash-es'
import { channelClass } from '../../../../js/chat/createChannelClass'
import { message } from 'ant-design-vue'
import { communityStore } from '../../store/communityStore'
import { Icon as ChatIcon} from '@iconify/vue'

export default {
 components:{
  ChatIcon
 },

 props:['no','id'],


 data(){
  return{
    settingsScroller: {
     useBothWheelAxes: true,
     swipeEasing: true,
     suppressScrollY: false,
     suppressScrollX: true,
     wheelPropagation: true
    },
    selectGroup:[],
    title:'我创建的群聊',
    server:window.$TUIKit,
    filterList:[],
    searchKeyWord:'',

  }
 },

 computed:{},

 mounted(){
  this.getList()
  this.$nextTick(()=>{
    this.$refs.searchRef.focus()
  })
 },

 methods:{
  ...mapActions(communityStore,['getCategoryData']),
  // 返回和关闭
  backChannel(){
    this.$emit('back')
  },
  closeGroup(){
    this.$emit('close')
  },

  // 获取默认群聊数据
  getList(){
    const list = this.server.TUIServer.TUIGroup.store.groupList
    const arr = _.filter(list,function(o){
     return o.selfInfo.role !== 'Member'
    })
    this.filterList = arr
  },

  // 点击左侧选中
  leftListClick(item){
    const index = _.findIndex(this.selectGroup,function(o){ return o.groupID === item.groupID })
    if(index === -1){
     this.selectGroup.push(item)
    }else{
     this.selectGroup.splice(index,1)
    }
  },

  // 判断是否选中状态
  isSelected(index){
    return this.selectGroup.includes(this.filterList[index])
  },

  // 清除选中的群聊
  removeGroup(item){
   const index = _.findIndex(this.selectGroup,function(o){ return o.groupID === item.groupID })
   this.selectGroup.splice(index,1) 
  },

  // 创建子频道数据
  async submit(){
    const option = {type:'group', id:this.id, no:this.no }
    if(this.selectGroup.length > 1){
      // console.log('关联多个群聊');
      const resultStatus = {}
      for(let i=0;i<this.selectGroup.length;i++){
        const groupsOption = {
          ...option,
          content:{
            name:this.selectGroup[i].name,
            props:{
              groupID:this.selectGroup[i].groupID,
              avatar:this.selectGroup[i].avatar,
              type:this.selectGroup[i].type
            }
          }
        }
        const res = await channelClass.secondaryChannel(groupsOption)
        resultStatus.info = res?.info
        resultStatus.status = res?.status
      }
      if(resultStatus?.status === 1){
        message.success(`${resultStatus?.info}`)
        await this.getCategoryData(this.no)
        this.$emit('close')
      }
    }else{
      // console.log('关联单个群聊');
      const groupOption = {
        ...option,
        content:{
          name:this.selectGroup[0].name,
          props:{
            groupID:this.selectGroup[0].groupID,
            avatar:this.selectGroup[0].avatar
          }
        }
      }
      const result = await channelClass.secondaryChannel(groupOption)
      if(result?.status === 1){
        message.success(`${result?.info}`)
        await this.getCategoryData(this.no)
        this.$emit('close')
      }
    }
  },

  // 搜索
  async searchGroup(evt){
    /**
      * 此处需要做两种判断
      * 第一种:过滤社群中是否关联过得去群聊,需要通过后台接口进行检测
      * 第二种:过滤自自己是成员的群聊
      * **/
      if(this.searchKeyWord !== ''){
        this.filterList = [];

        const chineseRegex = /[\u4e00-\u9fa5]/;

        // 判断搜索是否为中文
        if(chineseRegex.test(this.searchKeyWord)){
          // console.log('测试搜索::>>',this.searchKeyWord);
          const list = this.server.store.store.TUIGroup.groupList
          const mapList = list.filter((item)=>{
            return item.name.includes(this.searchKeyWord)
          })
          this.title = '群搜索结果'
          this.filterList = mapList

        }

        else{
          // console.log('获取搜索关键字',this.searchKeyWord);
          const groupID = String(this.searchKeyWord)
          const res = await this.server.tim.searchGroupByID(groupID)
          // console.log('获取搜索的群聊',res);
          this.filterList = [res?.data?.group]
        }

        

      }else{
       this.title = '我创建的群聊'
       this.getList()
       evt.preventDefault()
      }
  }

 }
}
</script>

<style lang="scss" scoped>

.font-16-400{
 font-family: PingFangSC-Regular;
 font-size: 16px;
 font-weight: 400;
}

.close-channel{
 position: absolute;
 top:1px;
 right:12px;
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

.font-14-400{
 font-family: PingFangSC-Regular;
 font-size: 14px;
 font-weight: 400;
}

.back-button{
 position: absolute;
 top: 1px ;
 left: 12px;
}

.select-bg{
 background: var(--active-secondary-bg) !important;
 border:1px solid var(--active-bg) !important;
}

:deep(.ant-input){
 font-size: 1.15em;
 &::placeholder{
   color: var(--secondary-text) !important;
 }
 color: var(--secondary-text) !important;
}
</style>
