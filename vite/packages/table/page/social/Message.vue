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
        <div style="">
         <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: calc(100vh - 18em)">
            <!-- 数据空状态 -->
           <a-list :data-source="[]" v-if="interact.length === 0" >     </a-list>
           <div v-else v-for="item in  interact" @click="clickInteract(item)" class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
             <div>
               <a-avatar v-if="item.user" :size="40" :src="item.user.avatar_128" class="avatar-list"></a-avatar>
             </div>
             <div class="flex flex-col ml-4">
               <div class="flex">
                 <span class="pr-1 truncate  interact-name" style="max-width: 84px; font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;">
                   {{item.title}}
                 </span>
                 <span class="pr-1 truncate  dynamic" style="font-size: 16px;color: rgba(255,255,255,0.60);font-weight: 400;">
                   {{item.dynamic}}
                 </span>
               </div>
               <div class="truncate " style="width: 98%"><span class="w-100 interact-content" >{{item.content}}</span></div>
               <span class="create-time mt-2">{{ item.create_time }}</span>
             </div>
           </div>

         </vueCustomScrollbar>
        </div>
       </template>
       <template v-if="categoryType.name === 'attention'">
        <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: calc(100vh - 18em)">
          <!-- 数据空状态 -->
          <a-list :data-source="[]" v-if="newFollower.length === 0" />

          <div v-else v-for="item in  newFollower" @click="concernToggle(item)" class="px-4 rounded-lg interact-hover pointer py-4 mb-3 flex items-center">
            <div>
              <a-avatar :size="40" :src="item.user.avatar_64" class="avatar-list"></a-avatar>
             </div>
             <div class="flex flex-col ml-4">
               <div class="flex">
                 <span class="pr-1 truncatepush-theme">
                  {{item.user.nickname}}
                </span>
                <span class="pr-1 truncate dynamic">
                  关注了你
                </span>
                <span class="truncate w-52 interact-content" ></span>
              </div>
              <span class="create-time">{{ item.create_time }}</span>
            </div>
          </div>
        </vueCustomScrollbar>
       </template>
       <template v-if="categoryType.name === 'system'">
        <div >
         <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"   style="height: calc(100vh - 18em)">
           <!-- 数据空状态 -->
           <a-list :data-source="[]" v-if="systemNotice.length === 0" />
           <div v-else v-for="item in systemNotice" @click="systemItemClick()" class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
             <div style="min-width: 40px;max-width:40px;flex:1" class="w-10 h-10 flex items-center  justify-center s-bg rounded-full">
               <Icon icon="bell" style="font-size: 1.429em;"></Icon>
             </div>
             <div class="flex flex-col ml-4">
                <span class="push-theme">
                 {{item.title}}
                </span>
                <span class="interact-content">
                 {{item.content}}
                </span>
                <span class="create-time">
                 {{item.create_time}}
                </span>
             </div>
           </div>
         </vueCustomScrollbar>
        </div>
       </template>
       <template v-if="categoryType.name === 'push'">
        <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: calc(100vh - 18em)">
          <!-- 数据空状态 -->
         <a-list :data-source="[]" v-if="push.length === 0" />
         <div v-else v-for="item in push" @click="clickDetail(item)" class="px-4 rounded-lg interact-hover pointer py-4 mb-3 flex  flex-col">
           <span class="push-theme">
             {{item.title}}
           </span>
           <span style="font-size: 14px;color: rgba(255,255,255,0.85);font-weight: 400;">
             {{item.summary}}
           </span>
           <div class="rounded-lg mt-3 mb-3" style="height: 240px;">
              <img :src="item.logo_350" class="rounded-lg" style="width:100%;height: 100%; object-fit: cover;" alt="">
           </div>
           <div class="flex justify-between">
             <span>{{item.create_time}}</span>
             <span >点击查看详情</span>
           </div>
         </div>
       </vueCustomScrollbar>
       </template>
       <template v-if="categoryType.name === 'custom'">
        <div >
          <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4"  style="height: calc(100vh - 18em)">
            <!-- 数据空状态 -->
            <a-list :data-source="[]" v-if="customNotice.length === 0" />
            <div v-else v-for="item in customNotice" @click="customListClick()" class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
              <div class="w-10 h-10 flex items-center  justify-center s-bg rounded-full">
                <Icon icon="bell" style="font-size: 1.429em;"></Icon>
              </div>
              <div class="flex flex-col ml-4">
                 <span class="interact-name" style="max-width: 100%">
                  {{item.title}}
                 </span>
                 <span class="interact-content">
                  {{item.content.substring(0,30)}}…
                 </span>
                 <span class="create-time">
                  {{item.create_time}}
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
import _ from 'lodash-es'
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
    }
  },
  computed:{
    ...mapState(messageStore,['newFollower','systemNotice','customNotice','push','comment','mention','support']),
    interact(){
      const interact=_.concat(this.comment,this.mention,this.support)
      return interact.sort((item1,item2)=>{
        return item2.send_time-item1.send_time
      })
    }
  },
  mounted () {
    this.navChanged()
  },
  methods:{
    ...mapActions(messageStore,['getNewFollower','getSystemNotice','getCustomNotice','getPush',
    'getComment','getInteract']),
    navChanged(){
      console.log(this.categoryType)
      switch (this.categoryType.name){
        case 'attention':
          this.getNewFollower().then()
          break
        case 'system':
          this.getSystemNotice().then()
          break
        case 'custom':
          this.getCustomNotice().then()
          break
        case 'push':
          this.getPush().then()
          break
        case 'interact':
          this.getInteract().then()
          break
      }
    },
    // 互动消息列表点击事件
    optionToggle(){},
    // 关注消息列表点击事件
    concernToggle(item){
      ipc.send('addTab',{url:'https://s.apps.vip/user?uid='+item.user.uid})
    },
    getUrl(item){
      let url=''
      let id=0
      if(item.route==='thread'){
        if(item.post)  {
          id=item.post.tid
        }
        else {
          id=item.thread.tid
        }
      }else if(item.route==='reply'){
        id=item.post.tid
      }
      return 'https://s.apps.vip/post/'+id
    },
    clickInteract(item){
      console.log('点击',item)
      let url=''
      if(item.title==='@消息'){
        //点击了@消息
        url=this.getUrl(item)
      }else if(item.title==='被赞通知'){
        //点击了beizan
        url=this.getUrl(item)

      }else if(item.title==='评论通知'){
        //点击了评论
        console.log('点击了评论')
       url=this.getUrl(item)

      }

      ipc.send('addTab',{url:url})
    },
    // 系统消息列表点击事件
    systemItemClick(){},
    // 推送消息列表item点击事件
    clickPushDetail(){
      //this.getNewFollower().then()

    },
    // 推送消息列表查看详情点击事件
    clickDetail(item){
      ipc.send('addTab',{url:'https://s.apps.vip/post/'+item.tid})
    },
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
.interact-name{
  max-width: 84px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
}
.interact-content{
  font-size: 16px;
  font-weight: 300;
  color: rgba(255,255,255,0.85);
}
.create-time{
  font-size: 14px;
  color: rgba(255,255,255,0.40);
  font-weight: 400;
}
.dynamic{
  font-size: 16px;
  color: rgba(255,255,255,0.40);
  font-weight: 400;
}
.push-theme{
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  font-weight: 600;
}
</style>
