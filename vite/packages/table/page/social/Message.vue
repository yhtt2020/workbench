<template>
  <div class="ml-4">
    <a-row class="card flex auto-height s-bg " style="width:100%;max-width:70em;padding: 1em;" :gutter="20">
<a-col :span="24">
  <div class="message-title flex items-center justify-between mb-4">
    <div class="flex items-center">
      <a-avatar src="/icons/logo128.png" :size="24"></a-avatar>
      <span class="ml-2" style="font-size: 16px; color: rgba(255,255,255,0.85); font-weight: 400;">元社区</span>
    </div>
    <a-button type="primary" @click="goYuan" style="font-size: 16px; font-weight: 400;float: right">前往元社区查收</a-button>
  </div>
</a-col>
      <a-col  :md="24" :lg="14" style="flex:1">

        <!-- 消息分类的tab -->
        <HorizontalPanel @changed="navChanged" :navList="category" v-model:selectType="categoryType"
                         bgColor="drawer-item-select-bg" :height="44"></HorizontalPanel>
        <template v-if="categoryType.name === 'interact'">
          <div style="">
            <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: calc(100vh - 18em)">
              <div class="sub-tab" style="text-align: center">
                <a-row  :gutter="20" style="width:300px;margin: auto">
                  <a-col @click="setCurrentSubTab('all')" :class="{active:currentSubTab==='all'}" :span="6" class=" item">全部</a-col>
                  <a-col @click="setCurrentSubTab('comment')" :class="{active:currentSubTab==='comment'}" :span="6"  class="item">评论</a-col>
                  <a-col @click="setCurrentSubTab('support')" :class="{active:currentSubTab==='support'}" :span="6"  class="item">点赞</a-col>
                  <a-col @click="setCurrentSubTab('mention')" :class="{active:currentSubTab==='mention'}" :span="6"  class="item">@</a-col>
                </a-row>
              </div>
              <!-- 数据空状态 -->
              <a-list :data-source="[]" v-if="interact.length === 0"></a-list>
              <div v-else v-for="item in  interact" @click="clickInteract(item)"
                   class="px-4 pointer interact-hover rounded-lg py-4  flex items-center">
                <div>
                  <a-avatar v-if="item.user" :size="40" :src="item.user.avatar_128" class="avatar-list"></a-avatar>
                </div>
                <div class="flex flex-col ml-4">
                  <div class="flex">
                 <span class="pr-1 truncate  interact-name"
                       style="max-width: 84px; font-size: 16px;color: rgba(255,255,255,0.85);font-weight: 600;">
                   {{ item.title }}
                 </span>
                    <span class="pr-1 truncate  dynamic"
                          style="font-size: 16px;color: rgba(255,255,255,0.60);font-weight: 400;">
                   {{ item.dynamic }}
                 </span>
                  </div>
                  <div class="truncate " style="width: 98%"><span
                    class="w-100 interact-content">{{ item.content }}</span></div>
                  <span class="create-time mt-2">{{ item.create_time }}</span>
                </div>
              </div>
            </vueCustomScrollbar>
          </div>
        </template>
        <template v-if="categoryType.name === 'attention'">
          <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: calc(100vh - 18em)">
            <!-- 数据空状态 -->
            <a-list :data-source="[]" v-if="newFollower.length === 0"/>
            <div v-else v-for="item in  newFollower" @click="clickInteract(item)"
                 class="px-4 rounded-lg interact-hover pointer py-4  flex items-center">
              <div>
                <a-avatar :size="40" :src="item.user.avatar_64" class="avatar-list"></a-avatar>
              </div>
              <div class="flex flex-col ml-4">
                <div class="flex">
                 <span class="pr-1 truncatepush-theme">
                  {{ item.user.nickname }}
                </span>
                  <span class="pr-1 truncate dynamic">
                  关注了你
                </span>
                  <span class="truncate w-52 interact-content"></span>
                </div>
                <span class="create-time">{{ item.create_time }}</span>
              </div>
            </div>
          </vueCustomScrollbar>
        </template>
        <template v-if="categoryType.name === 'system'">
          <div>
            <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: calc(100vh - 18em)">
              <!-- 数据空状态 -->
              <a-list :data-source="[]" v-if="systemNotice.length === 0"/>
              <div v-else v-for="item in systemNotice" @click="openSystem(item)"
                   class="px-4 pointer interact-hover rounded-lg py-4  flex items-center">
                <div style="min-width: 40px;max-width:40px;flex:1"
                     class="w-10 h-10 flex items-center  justify-center s-bg rounded-full">
                  <Icon icon="bell" style="font-size: 1.429em;"></Icon>
                </div>
                <div class="flex flex-col ml-4">
                <span class="push-theme">
                 {{ item.title }}
                </span>
                  <span class="interact-content">
                 {{ item.content }}
                </span>
                  <span class="create-time">
                 {{ item.create_time }}
                </span>
                </div>
              </div>
            </vueCustomScrollbar>
          </div>
        </template>
        <template v-if="categoryType.name === 'push'">
          <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: calc(100vh - 18em)">
            <!-- 数据空状态 -->
            <a-list :data-source="[]" v-if="push.length === 0"/>
            <div v-else v-for="item in push" @click="clickDetail(item)"
                 class="px-4 rounded-lg interact-hover pointer py-4  flex  flex-col">
           <span class="push-theme">
             {{ item.title }}
           </span>
              <span style="font-size: 14px;color: rgba(255,255,255,0.85);font-weight: 400;">
             {{ item.summary }}
           </span>
              <div class="rounded-lg mt-3 mb-3" style="height: 240px;">
                <img :src="item.logo_350" class="rounded-lg" style="width:100%;height: 100%; object-fit: cover;" alt="">
              </div>
              <div class="flex justify-between">
                <span>{{ item.create_time }}</span>
                <span>点击查看详情</span>
              </div>
            </div>
          </vueCustomScrollbar>
        </template>
        <template v-if="categoryType.name === 'custom'">
          <div>
            <vueCustomScrollbar :settings="scrollbarSettings" class="pt-4" style="height: calc(100vh - 18em)">
              <!-- 数据空状态 -->
              <a-list :data-source="[]" v-if="customNotice.length === 0"/>
              <div v-else v-for="item in customNotice" @click="clickDetail(item)"
                   class="px-4 pointer interact-hover rounded-lg py-4 mb-3 flex items-center">
                <div style="width: 120px" class="w-10 h-10 flex items-center  justify-center s-bg rounded-full">
                  <Icon icon="bell" style="font-size: 1.429em;"></Icon>
                </div>
                <div class="flex flex-col ml-4">
                 <span class="interact-name" style="max-width: 100%">
                  {{ item.title }}
                 </span>
                  <span class="interact-content">
                  {{ item.content}}
                 </span>
                  <span class="create-time">
                  {{ item.create_time }}
                 </span>
                </div>
              </div>
            </vueCustomScrollbar>
          </div>
        </template>
      </a-col>
      <a-col id="userDetail"   v-show="selectedUid!==0" :lg="10" >

        <div style="display: flex;justify-content: center;flex-direction: column;height: 100%">
          <div class=" mb-5">
            <div @click="openDetail" style="background: rgb(80, 139, 254); font-size: 16px; font-weight: 400;"
                 class="btn-active mt-4 h-12 flex justify-center cursor-pointer rounded-md items-center text-white text-white">
              <ExportOutlined class="mr-3"/>
              查看消息详情
            </div>
          </div>
          <div class="rounded-md  px-4 py-3" style="background: rgba(17,17,17,0.18)">
            <div class="line-title">
              来源用户
            </div>
            <UserCard :userInfo="selectedUserInfo" :uid="selectedUid"></UserCard>
          </div>


        </div>


      </a-col>
    </a-row>
  </div>
</template>

<script>
import HorizontalPanel from '../../components/HorizontalPanel.vue'
import { messageStore } from '../../store/message'
import { mapActions, mapState } from 'pinia'
import _ from 'lodash-es'
import UserCard from '../../components/small/UserCard.vue'
import { ExportOutlined } from '@ant-design/icons-vue'

export default {
  name: 'Message',
  components: {
    UserCard,
    HorizontalPanel,
    ExportOutlined
  },
  data () {
    return {
      currentSubTab:'all',
      // category这个数组后期需要从后端数据库获取数据
      // category数组中的state是模拟消息未读状态
      category: [
        { title: '互动', name: 'interact', state: false }, { title: '关注', name: 'attention', state: false },
        { title: '系统', name: 'system', state: false }, {
          title: '推送',
          name: 'push',
          state: false
        }, { title: '自定义', name: 'custom', state: false }
      ],
      categoryType: { title: '互动', name: 'interact' },
      scrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      selectedUid: 0,
      selectedUserInfo: {},
      detailUrl: ''
    }
  },
  computed: {
    ...mapState(messageStore, ['newFollower', 'systemNotice', 'customNotice', 'push', 'comment', 'mention', 'support']),
    interact () {
      const interact = _.concat(this.comment, this.mention, this.support)
      let sorted=  interact.sort((item1, item2) => {
        return item2.send_time - item1.send_time
      })

      return sorted.filter((item)=>{
        if(this.currentSubTab==='all')
          return true
        if(this.currentSubTab==='mention'){
          return item.title==='@消息'
        }
        if(this.currentSubTab==='comment'){
          return item.title==='评论通知'
        }
        if(this.currentSubTab==='support'){
          return item.title==='被赞通知'
        }
      })
    }
  },
  mounted () {
    this.navChanged()
  },
  methods: {
    ...mapActions(messageStore, ['getNewFollower', 'getSystemNotice', 'getCustomNotice', 'getPush',
      'getComment', 'getInteract']),
    navChanged () {
      console.log(this.categoryType)
      switch (this.categoryType.name) {
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
    getUrl (item) {
      let id = 0
      if(item.title==='邀请回答'){
        id=item.link_id
      }else{
        if (item.route === 'thread') {
          if (item.post) {
            id = item.post.tid
          } else {
            id = item.thread.tid
          }
        } else if (item.route === 'reply') {
          id = item.post.tid
        }
      }

      return 'https://s.apps.vip/post/' + id
    },
    openSystem(item){
      console.log('点击系统消息',item)
      let url=''
      if(item.route==='thread'){
        url='https://s.apps.vip/post/' + item.link_id
      }

      if(item.route==='pass'){
        url='https://s.apps.vip/user/manage'
      }
      if(item.title==='申请加入圈子消息'){
        url='https://s.apps.vip/user/applyManage'
      }
      if(!url){
        return
      }
      ipc.send('addTab', { url: url })


    },
    clickInteract (item) {
      console.log('点击',item)
      this.detailUrl = this.getUrl(item)
      console.log(window.getComputedStyle(document.getElementById('userDetail')).maxWidth,
        window.getComputedStyle(document.getElementById('userDetail')).maxWidth==='100%')
      if(window.getComputedStyle(document.getElementById('userDetail')).maxWidth==='100%'){
        this.openDetail()
        return
      }
      if (item.from_uid) {
        this.selectedUid = Number(item.from_uid)
        this.selectedUserInfo = {
          nickname: item.user.nickname,
          avatar: item.user.avatar_64
        }
      }
    },
    // 系统消息列表点击事件
    systemItemClick () {},
    // 推送消息列表item点击事件
    clickPushDetail () {
      //this.getNewFollower().then()

    },
    // 推送消息列表查看详情点击事件
    openDetail () {
      ipc.send('addTab', { url: this.detailUrl })
    },
    setCurrentSubTab(tab){
      this.currentSubTab=tab
    },
    clickDetail(item){
      console.log(item)
      ipc.send('addTab', { url: 'https://s.apps.vip/post/' + item.tid})
    },
    goYuan(){
      ipc.send('addTab', { url: 'https://s.apps.vip/user/message'})
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .ps__thumb-y {
  display: none !important;
}

::v-deep .ant-empty-description {
  display: none !important;
}

.interact-hover {
  &:hover {
    background: rgba(0, 0, 0, 0.30);
  }

  &:active {
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }
}

.interact-name {
  max-width: 84px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.interact-content {
  font-size: 16px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
}

.create-time {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.40);
  font-weight: 400;
}

.dynamic {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.40);
  font-weight: 400;
}

.push-theme {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
}

.sub-tab {
  .item {
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 16px;
  }

  .active {
    font-weight: 600;
    color: white;
  }
}
</style>
