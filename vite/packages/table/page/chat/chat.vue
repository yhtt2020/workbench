<template>
<!--  <div id="viewer" class="online_3d_viewer"-->
<!--       style="width: 800px; height: 600px;"-->
<!--       model="/model/model.stl">-->
<!--  </div>-->



    <xt-left-menu :list="chatLeftList" :index="index" last="3" end="2">
      <div class="w-full">
        <router-view></router-view>
      </div>

  
      <template #floating>
        <!-- 此处代码暂时保留,该功能后期需要实现 -->
        <!-- <div class="rounded-lg flex flex-col px-3 py-4" style="position:relative; top:60px; left:20px; width:336px;height:638px;background:var(--secondary-bg);">
          <div class="flex flex-col">
            <div class="flex justify-between mb-2.5">
              <span class="font-16-500" style="color:var(--primary-text);"> {{ community.name }} </span>
              <ChatDropDown />
            </div>
            <div class="font-14" style="color:var(--secondary-text);">
              {{ community.summary }}
            </div>
          </div>

          <a-divider style="height: 1px;margin: 12px 0; background-color: var(--divider)" />

          <vue-custom-scrollbar :settings="settingsScroller" style="height: 100%;">
            <div v-for="items in community.channelList">
              <ChatFold :title="items.name">
                <div class="flex flex-col">
                  <div v-for="item in items.children" class="flex items-center py-3 px-4 rounded-lg pointer group-item">
                    <template v-if="item.type === 'group'">
                      <MessageOutlined style="color:var(--warning);font-size: 1.25em;"/>
                    </template> 
                    <template v-if="item.type === 'link'">
                      <LinkOutlined style="color:var(--active-bg);font-size: 1.25em;"/>
                    </template>
                    <template v-if="item.type === 'forum'">
                      <AppstoreOutlined style="color:var(--success);font-size: 1.25em;"/>
                     </template>
                    <span class="ml-3 font-16" style="color: var(--primary-text);">{{ item.name || item.title }}</span>
                  </div>
                </div>
              </ChatFold>
            </div>
          </vue-custom-scrollbar>
        </div> -->
      </template>

    </xt-left-menu>

    
    <!-- <router-view></router-view> -->
    <!-- <template v-if="type === 'chat'">
      <ChatMain></ChatMain>
    </template>

    <template v-if="type === 'find'">
      <ChatFind @updateChat="updateChat"></ChatFind>
    </template>

    <template v-if="type === 'thisky'">
      <ThiskyIndex></ThiskyIndex>
      <Commun />
    </template>

    <div v-show="type==='contact'" style="flex:1;width: 0" >

    </div> -->



  <teleport to='body'>
     <Modal  v-if="open" v-model:visible="open" :blurFlag="true">
       <AddFriend v-if="addIndex === 0" @close="open = false"></AddFriend>
       <CreateGroup v-if="addIndex === 1"  @close="open = false" :isH5="env.isH5" />
       <Transfer v-if="addIndex === 2" @close="open = false" :isH5="env.isH5"></Transfer>
     </Modal>
  </teleport>

  
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { TUIEnv } from '../../TUIKit/TUIPlugin';
import Drag from '../../TUIKit/TUIComponents/components/drag';
import TUIContact from "../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import SecondPanel from "../../components/SecondPanel.vue";
import { message } from "ant-design-vue";
// import Commun from './Commun.vue'
import ChatFind from "./page/chatFind.vue"
import ChatMain from './page/chatMain.vue';
import ThiskyIndex from './page/thiskyIndex.vue'
import Modal from '../../components/Modal.vue'
import AddFriend from '../../TUIKit/TUIComponents/components/transfer/addFriend.vue';
import CreateGroup from '../../TUIKit/TUIComponents/container/TUISearch/components/createGroup/index.vue'
import Transfer from '../../TUIKit/TUIComponents/components/transfer/index.vue';
// import { handleErrorPrompts, handleSuccessPrompts } from '../../TUIKit/TUIComponents/container/utils';
import config from './config'
import {appStore} from "../../store";
import {storeToRefs} from "pinia";
import { chatList } from '../../js/data/chatList'
import ChatDropDown from './components/chatDropDown.vue'
import ChatFold from './components/chatFold.vue'
import { AppstoreOutlined, MessageOutlined,LinkOutlined} from '@ant-design/icons-vue'

export default {
  name: 'App',
  components: {
    SecondPanel,
    TUIContact,
    Drag,
    ChatFind,
    ThiskyIndex,
    ChatMain,Modal,
    AddFriend,CreateGroup,
    Transfer,
    ChatDropDown,ChatFold,
    AppstoreOutlined, MessageOutlined,LinkOutlined,
  },

  setup() {


    const router = useRouter()
    const route = useRoute()
    const TUIServer = (window as any).$TUIKit
    const Server = (window as any).$chat
    const data = reactive({
      index:'chat',
      // type:'chat',
      addIndex:'',
      open:false,
      env: TUIServer.TUIEnv,
      needSearch: !TUIServer.isOfficial,
      TUIServer:Server,
      createConversationType:'',
      community:chatList[0],
      settingsScroller: {
       useBothWheelAxes: true,
       swipeEasing: true,
       suppressScrollY: false,
       suppressScrollX: true,
       wheelPropagation: true
      },
    })

    const selectTab = (item: any) => {

      // router.push(item.route)
      // data.type = item.type

      data.index = item.type
      router.push(item.route)

      // if(item.type==='contact'){
      //   router.push({
      //     name:'contact'
      //   })
      // }
    }

    const selectDorpTab = (item:any) =>{
      data.addIndex = item.index
      data.open = true
    }

    const appS=appStore()
    const {userInfo}=appS

    console.log(userInfo.uid,'uidddddd',config.adminUids)
    const chatLeftList = ref([
      {
        icon: 'message',
        type: 'chat',
        title:'消息',
        route:{
          name:'chatMain'
        },
        callBack: selectTab,
      },
      {
        icon: 'team',
        type: 'contact',
        callBack: selectTab,
        route:{
          name:'contact'
        }
      },
      ...(config.adminUids.includes(userInfo.uid)?[
        {
          icon: 'diannao',
          type: 'admin',
          title:'管理面板(仅管理员可见)',
          callBack: selectTab,
          route:{
            name:'chatAdmin'
          }
        }
      ]:[]),

      {
        icon: 'zhinanzhen',
        type: 'find',
        callBack: selectTab,
        route:{
          name:'chatFind'
        }
      },
      // 写社群相关静态内容时临时打开的路由
      {
        icon:'',
        img: '/icons/logo128.png',
        type: 'thisky',
        float:"floating",
        noBg:true,
        callBack: selectTab,
        route:{
          name:'chatThisky'
        }
      },
      {
        full:true,
      },
      {
        icon: 'tianjia2',
        children:[
          {
            icon: 'message',
            name:'发起群聊',
            index:0,
            callBack:selectDorpTab
          },
          {
            icon: 'team',
            name:'加入群聊',
            index:1,
            callBack:selectDorpTab
          },
          {
            icon: 'tianjiachengyuan',
            name:'添加好友',
            index:2,
            callBack:selectDorpTab
          }
        ]
      },
    ])

    // const router = useRouter()

    onMounted(()=>{
      // OV.SetExternalLibLocation ('../libs');
      //
      // // get the parent element of the viewer
      // let parentDiv = document.getElementById ('viewer');
      //
      // console.error(parentDiv,'parentDiv')
      // // initialize the viewer with the parent element and some parameters
      // let viewer = new OV.EmbeddedViewer (parentDiv, {
      // });
      //
      // // load a model providing model urls
      // viewer.LoadModelFromUrlList ([
      //   'https://a.apps.vip/download/model.stl'
      // ]);
      router.push({name:'chatMain'})
    })

    // const updateChat = (v:any) => {
    //   console.log('获取返回数据',v.type);

    //   // data.index = this.$route.meta.type
    //   // data.type = 'chat'
    // }

    return {
      chatLeftList,route,router,
      ...toRefs(data),

      // updateChat,
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.xt-br) {
  margin-right: 0px !important;
}

.font-16-500{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500; 
}

.font-14{
  font-family: PingFangSC-Regular;
  font-size: 14px;
  font-weight: 400;
}
</style>
