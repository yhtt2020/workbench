<template>
  <div class="flex flex-col my-3" style="width:667px;" v-if="nextShow === false">
    <!-- 顶部关闭按钮和返回按钮 -->
    <div class="flex w-full mb-5 h-10 items-center justify-center" style="position: relative;">
      <div class="back-button w-10 h-10 flex items-center rounded-lg pointer category-button justify-center" style="background: var(--secondary-bg);" @click="backChannel">
        <ChatIcon icon="fluent:chevron-left-16-filled" style="font-size: 1.5rem;color:var(--secondary-text);"/>
      </div>

      <span class="font-16 font-400" style="color:var(--primary-text);">选择群聊</span>

      <div class="close-channel w-10 h-10 flex items-center rounded-lg pointer category-button justify-center"  style="background: var(--secondary-bg);" @click="closeChannel">
        <ChatIcon icon="fluent:dismiss-16-filled" style="font-size: 1.25rem;color:var(--secondary-text);"/>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex px-6">
      <div class="flex flex-col" style="width: 293px;">
        <!-- 搜索区域 -->
        <a-input class="h-10 search" ref="searchRef" v-model:value="searchKeyWord" style="border-radius: 12px;" placeholder="搜索群名称、ID" @pressEnter="groupSearch" @input="groupSearch">
          <template #suffix>
            <ChatIcon icon="fluent:search-20-filled" style="font-size: 1.25rem;color:var(--secondary-text);" class="pointer" @click="groupSearch"/>
          </template>
        </a-input>

        <span class="my-4 font-14 font-400" style="color:var(--secondary-text);">{{title}}</span>

        <vue-custom-scrollbar :settings="settingsScroller" style="height:335px;">
          <div class="flex flex-col">
            <div v-for="(item,index) in filterList" :class="{'select-bg':isSelected(index)}" class="flex pointer rounded-lg items-center px-4 py-3 mb-3" @click="leftListClick(item)">
             <a-avatar shape="square" :size="40" :src="item.avatar"></a-avatar>
             <span class="font-16 font-400 ml-4" style="color:var(--primary-text);">{{ item.name }}</span>
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>

      <a-divider type="vertical" style="height:442px; margin: 0 16px; background-color:var(--divider);" />

      <!-- 右侧选中内容 -->
      <div class="flex flex-col justify-between" style="width: 293px;">
        <span class="category-14-400" style="color:var(--secondary-text);">已选({{ selectGroup.length }}个)</span>
        <vue-custom-scrollbar :settings="settingsScroller" style="height:335px;">
          <div class="flex flex-col">
           <div v-for="item in selectGroup" class="flex  items-center justify-between px-4 py-3 mb-2">
             <div class="flex items-center">
              <a-avatar shape="square" :size="40" :src="item.avatar"></a-avatar>
              <span class="font-16 font-400 ml-4" style="color:var(--primary-text);">{{ item.name }}</span>
             </div>

             <div class="flex items-center pointer justify-center" @click="removeGroup(item)">
               <ChatIcon icon="zondicons:minus-solid" style="font-size: 1.25rem;color: var(--disable-text);"/>
             </div>
           </div>
          </div>
        </vue-custom-scrollbar>

        <!-- 底部按钮 -->
        <div class="flex items-center justify-end">
          <XtButton style="width: 64px;height:40px;margin-right: 12px;" @click="closeChannel">
            取消
          </XtButton>
       
          <XtButton style="width: 64px;height:40px; background: var(--active-bg);color:var(--active-text);" @click="selectSubmit">
            选择
          </XtButton>
        </div>
      </div>
      
    </div>

  </div>

  <ChannelClassification v-if="nextShow === true" :no="no" :type="type" :data="selectGroup"  @close="closeChannel" @classBack="nextShow = false">
  </ChannelClassification>

</template>

<script>
import {mapActions,mapWritableState,storeToRefs} from 'pinia'
import { Icon as ChatIcon } from '@iconify/vue'
import _ from 'lodash-es'
import { message } from 'ant-design-vue'
import { communityStore } from '../../store/communityStore'

import ChannelClassification from './ChannelClassification.vue'

export default {
  props:['no','type'],
  components:{
    ChatIcon,ChannelClassification
  },

  data(){
    return{
      selectGroup:[],
      nextShow:false,
      option:{
       communityNo:this.no,
       cache:1
      },
      searchKeyWord:'',
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
      server:window.$TUIKit,
      filterList:[],
      title:'我创建的群聊',
    }
  },

  computed:{},

  mounted(){
    this.$nextTick(()=>{
      this.$refs.searchRef.focus()
    }),
    this.getList()
  },

  methods:{
    // 关闭和返回
    closeChannel(){
      this.$emit('close')
    },
    backChannel(){
      this.$emit('back')
    },

    // 获取初始数据
    getList(){
      const list = this.server.TUIServer.TUIGroup.store.groupList
      // console.log('获取群聊数据',list);
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

    // 选择下一步
    selectSubmit(evt){
      if(this.selectGroup.length !== 0){
        this.nextShow = true
        //  community.getChannel(data.option)
      }else{
       message.warn('没有选择指定的群')
       evt.preventDefault();
      }
    },

    // 清除选中的数据
    removeGroup(item){
      const index = _.findIndex(this.selectGroup,function(o){ return o.groupID === item.groupID })
      this.selectGroup.splice(index,1) 
    },

    // 判断是否选中状态
    isSelected(index){
      return this.selectGroup.includes(this.filterList[index])
    },

    // 群聊搜索
    async groupSearch(evt){
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
    },

   

  }

}
</script>

<style lang="scss" scoped>
.close-channel{
 position: absolute;
 top:1px;
 right:12px;
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