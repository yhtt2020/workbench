<template>
  <div class="ml-4">
    <div class="card auto-height s-bg" style="display: inline-block;width:40.858em;padding: 1em;">
       <div class="message-title flex items-center justify-between mb-4">
           <div class="flex items-center">
             <a-avatar src="/icons/logo128.png" :size="24"></a-avatar>
             <span class="ml-2" style="font-size: 16px; color: rgba(255,255,255,0.85); font-weight: 400;">元社区</span>
           </div>
           <span style="font-size: 16px; color: rgba(255,255,255,0.60);font-weight: 400;">全部已读</span>
       </div>
       <!-- 消息分类的tab -->
       <HorizontalPanel @changed="navChanged" :navList="category" v-model:selectType="categoryType" bgColor="drawer-item-select-bg" :height="44"></HorizontalPanel>
       <template v-if="categoryType.name === 'interact'">
        <div style="height: 26.99em;">
         <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: 100%">
            <!-- 数据空状态 -->
           <a-list :data-source="[]" v-if="interactList.length === 0" />

           <div v-else v-for="item in  interactList" @click="optionToggle()" class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
             <div>
               <a-avatar :size="40" :src="`../../../../public/img/${item.url}`" class="avatar-list"></a-avatar>
             </div>
             <div class="flex flex-col ml-4">
               <div class="flex">
                 <span class="pr-1 truncate" style="max-width: 84px; font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;">
                   {{item.name}}
                 </span>
                 <span class="pr-1 truncate " style="font-size: 16px;color: rgba(255,255,255,0.60);font-weight: 400;">
                   {{item.dynamic}}
                 </span>
                 <span class="truncate w-52" style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;">{{item.content}}</span>
               </div>
               <span style="font-size: 14px; color: rgba(255,255,255,0.40); font-weight: 400;">{{ item.createTime }}</span>
             </div>
           </div>
         </vueCustomScrollbar>
        </div>
       </template>
       <template v-if="categoryType.name === 'attention'">
       <div style="height: 26.99em;">
         <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: 100%">
           <!-- 数据空状态 -->
           <a-list :data-source="[]" v-if="newFollower.length === 0" />

           <div v-else v-for="item in  newFollower" @click="concernToggle(item)" class="px-4 rounded-lg interact-hover pointer py-4 mb-3 flex items-center">
             <div>
               <a-avatar :size="40" :src="item.user.avatar_64" class="avatar-list"></a-avatar>
             </div>
             <div class="flex flex-col ml-4">
               <div class="flex">
                 <span class="pr-1 truncate" style="max-width: 84px; font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;">
                   {{item.user.nickname}}
                 </span>
                 <span class="pr-1 truncate" style="font-size: 16px;color: rgba(255,255,255,0.60);font-weight: 400;">
                   关注了你
                 </span>
                 <span class="truncate w-52" style=" font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;"></span>
               </div>
               <span style="font-size: 14px; color: rgba(255,255,255,0.40); font-weight: 400;">{{ item.create_time }}</span>
             </div>
           </div>
         </vueCustomScrollbar>
       </div>
       </template>
       <template v-if="categoryType.name === 'system'">
        <div style="height: 26.99em;">
         <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: 100%">
           <!-- 数据空状态 -->
           <a-list :data-source="[]" v-if="systemNotice.length === 0" />
           <div v-else v-for="item in systemNotice" @click="systemItemClick()" class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
             <div style="min-width: 40px;max-width:40px;flex:1" class="w-10 h-10 flex items-center  justify-center s-bg rounded-full">
               <Icon icon="bell" style="font-size: 1.429em;"></Icon>
             </div>
             <div class="flex flex-col ml-4">
                <span style="font-size: 16px;color: rgba(255,255,255,0.85); font-weight: 600;">
                 {{item.title}}
                </span>
                <span class="truncate" style="font-size: 16px;color: rgba(255,255,255,0.85); font-weight: 300;">
                 {{item.content}}
                </span>
                <span style="font-size: 14px;color: rgba(255,255,255,0.40);font-weight: 400;">
                 {{item.create_time}}
                </span>
             </div>
           </div>
         </vueCustomScrollbar>
        </div>
       </template>
       <template v-if="categoryType.name === 'push'">
       <div style="height: 26.99em;">
         <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: 100%">
            <!-- 数据空状态 -->
           <a-list :data-source="[]" v-if="pushData.length === 0" />
           <div v-else v-for="item in pushData" @click="clickPushDetail()" class="px-4 rounded-lg interact-hover pointer py-4 mb-3 flex  flex-col">
             <span style="font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;">
               {{item.theme}}
             </span>
             <span style="font-size: 14px;color: rgba(255,255,255,0.85);font-weight: 400;">
               {{item.description}}
             </span>
             <div class="rounded-lg mt-3 mb-3" style="height: 240px;">
                <img :src="`../../../../public/img/${item.url}`" class="rounded-lg" style="width:100%;height: 100%; object-fit: cover;" alt="">
             </div>
             <div class="flex justify-between">
               <span>{{item.createTime}}</span>
               <span @click="clickDetail()">点击查看详情</span>
             </div>
           </div>
         </vueCustomScrollbar>
       </div>
       </template>
       <template v-if="categoryType.name === 'custom'">
        <div style="height: 26.99em;">
          <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: 100%">
            <!-- 数据空状态 -->
            <a-list :data-source="[]" v-if="customList.length === 0" />
            <div v-else v-for="item in customList" @click="customListClick()" class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
              <div class="w-10 h-10 flex items-center  justify-center s-bg rounded-full">
                <Icon icon="bell" style="font-size: 1.429em;"></Icon>
              </div>
              <div class="flex flex-col ml-4">
                 <span style="font-size: 16px;color: rgba(255,255,255,0.85); font-weight: 600;">
                  {{item.notice}}
                 </span>
                 <span style="font-size: 16px;color: rgba(255,255,255,0.85); font-weight: 600;">
                  {{item.content}}
                 </span>
                 <span style="font-size: 14px;color: rgba(255,255,255,0.40);font-weight: 400;">
                  {{item.createTime}}
                 </span>
              </div>
            </div>
          </vueCustomScrollbar>
        </div>
       </template>
    </div>
  </div>
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue';
import { messageStore } from '../../store/message'
import {mapActions,mapState} from 'pinia'
export default {
  name:'Message',
  components:{
    HorizontalPanel
  },
  data(){
    return{
      // category这个数组后期需要从后端数据库获取数据
      // category数组中的state是模拟消息未读状态
      category:[
        {title:'互动',name:'interact',state:false},{title:'关注',name:'attention',state:true},
        {title:'系统',name:'system',state:true},{title:'推送',name:'push',state:false},{title:'自定义',name:'custom',state:false}
      ],
      categoryType: {title:'互动',name:'interact'},
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      // 消息互动数据列表 后期对接后台数据
      interactList:[
        {
          url:'001.png',
          name:'阳光小葵',
          createTime:'2分钟前',
          content:'如何搭建自己的工作台桌面',
          dynamic:'评论了你发布的视频'
        },
        {
          url:'002.png',
          name:'彩虹小白马 ',
          createTime:'1小时前',
          content:'',
          dynamic:'关注了你'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
      ],
      // 消息关注数据列表 后期对接后台数据
      concernList:[
        {
          url:'001.png',
          name:'阳光小葵',
          createTime:'2分钟前',
          content:'如何搭建自己的工作台桌面',
          dynamic:'评论了你发布的视频'
        },
        {
          url:'002.png',
          name:'彩虹小白马 ',
          createTime:'1小时前',
          content:'',
          dynamic:'关注了你'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
        {
          url:'002.png',
          name:'猫爪咖啡',
          createTime:'昨天 18:00',
          content:'分享几个自己整理的快捷指令',
          dynamic:'点赞了你发布的帖子'
        },
      ],
      // 消息系统数据列表 后期对接后台数据
      systemList:[
        {notice:'升级通知',content:'恭喜！你的用户等级已升级！',createTime:'2分钟前'},
        {notice:'升级通知',content:'恭喜！你的用户等级已升级！',createTime:'3分钟前'},
        {notice:'升级通知',content:'恭喜！你的用户等级已升级！',createTime:'4分钟前'},
        {notice:'升级通知',content:'恭喜！你的用户等级已升级！',createTime:'5分钟前'},
        {notice:'升级通知',content:'恭喜！你的用户等级已升级！',createTime:'6分钟前'}
      ],
      // 消息推送数据内容 后期对接后台数据
      pushData:[
        { theme:'选出心目中的最佳主机！',
          description:'参与活动，选择你觉得本世代最好的游戏主机，有机会获得丰厚奖励',
          url:'pushImg.jpeg',
          createTime:'2分钟前'
        },
        { theme:'选出心目中的最佳主机！',
          description:'参与活动，选择你觉得本世代最好的游戏主机，有机会获得丰厚奖励',
          url:'pushImg.jpeg',
          createTime:'3分钟前'
        },
        { theme:'选出心目中的最佳主机！',
          description:'参与活动，选择你觉得本世代最好的游戏主机，有机会获得丰厚奖励',
          url:'pushImg.jpeg',
          createTime:'4分钟前'
        },
        { theme:'选出心目中的最佳主机！',
          description:'参与活动，选择你觉得本世代最好的游戏主机，有机会获得丰厚奖励',
          url:'pushImg.jpeg',
          createTime:'5分钟前'
        }
      ],
      // 消息自定义内容 后期对接后台数据
      customList:[
        {notice:'自定义标题',content:'自定义内容',createTime:'2分钟前'},
        {notice:'自定义标题',content:'自定义内容',createTime:'4分钟前'},
        {notice:'自定义标题',content:'自定义内容',createTime:'5分钟前'},
        {notice:'自定义标题',content:'自定义内容',createTime:'10分钟前'},
        {notice:'自定义标题',content:'自定义内容',createTime:'12分钟前'},
        {notice:'自定义标题',content:'自定义内容',createTime:'8分钟前'},
      ]
    }
  },
  computed:{
    ...mapState(messageStore,['newFollower','systemNotice'])
  },
  methods:{
    ...mapActions(messageStore,['getNewFollower','getSystemNotice']),
    navChanged(){
      console.log(this.categoryType)
      switch (this.categoryType.name){
        case 'attention':
          this.getNewFollower().then()
          break
        case 'system':
          this.getSystemNotice().then()
          break
      }
    },
    // 互动消息列表点击事件
    optionToggle(){},
    // 关注消息列表点击事件
    concernToggle(item){
      ipc.send('addTab',{url:'https://s.apps.vip/user?uid='+item.user.uid})
    },
    // 系统消息列表点击事件
    systemItemClick(){},
    // 推送消息列表item点击事件
    clickPushDetail(){
      //this.getNewFollower().then()

    },
    // 推送消息列表查看详情点击事件
    clickDetail(){},
    // 自定义消息列表点击事件
    customListClick(){}
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ps__thumb-y{
  display: none !important;
}
::v-deep .ant-empty-description{
  display: none !important;
}
.interact-hover{
  &:hover{
    background: rgba(0,0,0,0.30);
  }
  &:active{
    filter: brightness(0.8);
    background:rgba(42, 42, 42, 0.25);
  }
}
</style>
