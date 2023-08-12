<template>
  <div class="flex flex-col" style="padding: 12px; width: 650px; height: 530px;" v-if="isNextShow === false">
    <!-- 顶部关闭 -->
    <div class="top-close" style="margin: 16px 0;">
      <div class="font-16 flex items-center justify-center" style="color:var(--primary-text);width: 95%;">选择联系人</div>
      <div class="flex rounded-lg active-button pointer items-center w-12 h-12 justify-center"
        style="background: var(--secondary-bg);" @click="closeContact"
      >
        <Icon icon="guanbi" style="color: var(--primary-text);width: 24px;height: 24px;"></Icon>
      </div>
    </div>

    <!-- 中间内容 左侧 右侧 -->
    <div class="flex  justify-between">
      <div class="left-group">
        <div class="font-14" style="color: var(--secondary-text);padding-left: 16px;margin-bottom: 16px;">最近聊天</div>
        
        <div class="flex items-center  justify-center" style="color: var(--primary-text);margin-top: 50px;" v-if="friendList.length === 0">
          <a-empty :image="simpleImage" />
        </div>
        
        <vue-custom-scrollbar :settings="settingsScroller" style="height:90%;">
          <div v-for="item in friendList" class="flex items-center pointer" style="margin-bottom: 8px;padding: 12px;color: var(--primary-text);"  @click="selectUser(item)">
            <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
            <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
              {{ item.profile.nick }}
            </div>
          </div>
        </vue-custom-scrollbar>
      </div>

      <a-divider type="vertical" style="height: 430px; border-color: var(--divider)"/>

      <div class="right-group">
        <div style="color: var(--primary-text);margin-bottom: 16px;">已选({{selectList.length}}人)</div>
        
        <vue-custom-scrollbar :settings="settingsScroller" style="height:80%; margin-bottom: 16px;">
          <div v-for="item in selectList" class="flex  justify-between" style="margin-bottom: 8px;padding: 12px;color: var(--primary-text);"  @click="selectUser(item)">
            <div class="flex">
              <a-avatar :size="32" :src="item.profile.avatar"></a-avatar>
              <div class="font-16" style="color: var(--primary-text);margin-left: 16px;">
               {{ item.profile.nick }}
              </div>
            </div>
            <div class="pointer" @click="clearSelect(item)">
              <Icon icon="jinzhi-yin" style="color: var(--secondary-text);width: 20px;height: 20px;"></Icon>
            </div>
          </div>
        </vue-custom-scrollbar>

        <!-- 底部按钮 -->
        <div class="flex justify-end" style="height: 48px;">
         <div class="flex items-center rounded-md pointer font-16 active-button justify-center"  style="width: 100px;color: var(--secondary-text); background: var(--secondary-bg);" @click="closeContact">
          取消
         </div>
         <div class="flex items-center rounded-md pointer font-16 active-button justify-center" style="width: 100px;color: var(--active-text);background: var(--active-bg);margin-left: 12px;" @click="enterNextStep">
          确定
         </div>
        </div>        
      </div>
    </div>

  </div>

  <div v-else class="flex flex-col" style="padding: 12px; width: 650px; height: 530px;">
    <div class="top-close">
      <div class="flex rounded-lg active-button pointer items-center justify-center"
        style="background: var(--secondary-bg);width: 48px;height: 48px;"  @click="goBack"
      >
        <Icon icon="xiangzuo" style="color: var(--primary-text);width: 24px;height: 24px;"></Icon>
      </div>
      <div class="font-16 flex items-center justify-center" style="color:var(--primary-text);width: 84%;">发起群聊</div>
      <div class="flex rounded-lg active-button pointer items-center justify-center"
        style="background: var(--secondary-bg);width: 48px;height: 48px;" @click="closeContact"
      >
        <Icon icon="guanbi" style="color: var(--primary-text);width: 24px;height: 24px;"></Icon>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center" style="height:415px;color: var(--primary-text);">
      <a-avatar shape="square" :size="64" :src="groupTypeData.icon"></a-avatar>

      <a-input v-model:value="groupName" style="margin-top: 16px; text-align: center; width: 320px;color: var(--primary-text); border-radius: 12px; height: 48px;margin-bottom: 16px;" />

      <a-select style="width: 320px; border-radius: 12px; color: var(--secondary-text);"
       :bordered="false" :dropdownStyle="{boxShadow:'none !important',borderRadius:'12px',color:'var(--secondary-text)'}"
       :showArrow="true" v-model:value="public.type"  @change="getGroupType($event)"
      >
        <a-select-option v-for="(item,index) in groupType" :key="index"  :value="item.type">{{item.text}}</a-select-option>
      </a-select>

      <div class="font-14" style="color: var(--secondary-text);width: 320px;margin-top: 16px;">
        {{ groupTypeData.detail }}
      </div>

    </div>

    <div class="flex justify-end">
      <a-button style="width: 100px; border-radius: 8px; height: 44px; background: var(--secondary-bg);color: var(--secondary-text);" @click="goBack">取消</a-button>
      <a-button type="primary" style="width: 100px;height: 44px;margin-left: 16px;border-radius: 8px;" @click="submit">确定</a-button>
    </div>
  </div>
 
</template>

<script>
import { defineComponent,ref,reactive,toRefs, onMounted, computed } from 'vue'

import _ from 'lodash-es'

export default defineComponent({
  props:['server'],

  setup(props,ctx){
    const TUIServer = props.server.TUICore
    
    const data = reactive({
      friendList:[],  // 好友列表
      selectList:[], // 右侧选中列表
      isNextShow:false, // 是否进入下一步
      simpleImage:'/img/state/null.png', // 空状态图片
      groupName:'群名称', // 接收群名称

      public:{ type: TUIServer.TIM.TYPES.GRP_PUBLIC }, // 获取默认的群组类型
      settingsScroller: {  // 滚动条配置 
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      groupType:[   // 不同群组类型
        {
          icon: 'https://web.sdk.qcloud.com/im/assets/images/Public.svg',
          label: '陌生人社交群（Public）',
          text:'陌生人社交群',
          type: TUIServer.TIM.TYPES.GRP_PUBLIC,
          detail: '类似 QQ 群，创建后群主可以指定群管理员，用户搜索群 ID 发起加群申请后，需要群主或管理员审批通过才能入群。详见',
          src: '产品文档',
        },
        {
          icon: 'https://web.sdk.qcloud.com/im/assets/images/Meeting.svg',
          label: '临时会议群（Meeting）',
          text:'临时会议群',
          type: TUIServer.TIM.TYPES.GRP_MEETING,
          detail: '创建后可以随意进出，且支持查看入群前消息；适合用于音视频会议场景、在线教育场景等与实时音视频产品结合的场景。详见',
          src: '产品文档',
        },
        {
          icon: 'https://web.sdk.qcloud.com/im/assets/images/AVChatroom.svg',
          label: '直播群（AVChatroom）',
          text:'直播群',
          type: TUIServer.TIM.TYPES.GRP_AVCHATROOM,
          detail: '创建后可以随意进出，没有群成员数量上限，但不支持历史消息存储；适合与直播产品结合，用于弹幕聊天场景。详见',
          src: '产品文档',
        },
        {
          icon: 'https://web.sdk.qcloud.com/im/assets/images/Work.svg',
          label: '好友工作群（Work）',
          text:'好友工作群',
          type: TUIServer.TIM.TYPES.GRP_WORK,
          detail: '类似普通微信群，创建后仅支持已在群内的好友邀请加群，且无需被邀请方同意或群主神奇。详见',
          src: '产品文档',
        }
      ],
    })

    const getFriendList = async () =>{  // 获取好友列表数据
      const res  = await TUIServer.tim.getFriendList()
      data.friendList = res.data
    }

    const selectUser = (item) => {  // 选中用户
      const index = _.findIndex(data.selectList,function(o){ return o.userID === item.userID})
      if(index === -1 ){
        data.selectList.push(item)
      }else{
        return;
      }
    }


    const enterNextStep = () =>{  // 进入下一步
      if(data.selectList.length !== 0 ){
        data.isNextShow = true

      }
    }

    const clearSelect = (item) => { // 清除选中用户
      // const index = _.findIndex(data.selectList,function(o){ return o.userID === item.userID})
      // const list = data.selectList
      // const newArr = list.splice(index,1)
      // console.log(newArr);
      // const list = list.splice(index,1)
      // data.selectList = list
      // console.log(data.selectList[index]);
      // if(index > -1){
      //   // console.log(index);
      //  return data.selectList.splice(index,1)
      // // console.log(data.selectList);
      // }
    }


    const goBack = () => {  // 返回上一步
      data.isNextShow = false
    }

    const getGroupType = (evt) =>{  // 下拉获取选择后的群组类型
      const index = _.find(data.groupType,function(o){ return o.type === evt })
      data.public.type = index.type
    }
   
    const groupTypeData = computed(()=>{  // 根据计算属性获取群组类型的描述
      const index = _.find(data.groupType,function(o){ return o.type === data.public.type })
      return index
    })


    const closeContact = () => {  // 关闭弹窗
     ctx.emit('close')
    }

    const submit = async () => {  // 点击创建群聊
      const option = {
        type:data.public.type,
        memberList:data.selectList,
        name:data.groupName,
        avatar:groupTypeData.value.icon,
      }

      
      await TUIServer.tim.createGroup(option)
      ctx.emit('close')
    }

    onMounted(getFriendList)

    return{
      ...toRefs(data),groupTypeData,

      getFriendList,selectUser,enterNextStep,closeContact,
      clearSelect,goBack,getGroupType,submit,
    }
  }
})
</script>

<style lang="scss" scoped>
.top-close{
  width: 100%;
  height: 48px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /**
  >div:nth-of-type(2){
    position: absolute;
    right: 1px;
  }
  **/
}

.font-16{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500
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

.font-14{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}

.left-group{
  display: flex;
  align-content: center;
  flex-direction: column;
  width: 293px;
  height: 422px;
}
.right-group{
  width: 293px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-direction: column;
  height: 422px;
}

:deep(.ant-select-arrow){
  color: var(--primary-text) !important;
}
</style>