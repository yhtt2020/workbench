<template>
  <xt-left-menu :list="filterList" :index="index" last="3" end="2">
    <div class="w-full">
      <router-view ></router-view>
    </div>
    <template #communityFloat>
      <CategoryFloat v-if="communityNo !== 1" :communityID="{no:communityNo}" :float="true"  @clickItem="currentItem"></CategoryFloat>
      <DefaultFloat v-else :float="true"></DefaultFloat>
    </template>
  </xt-left-menu>
  <teleport to='body'>
    <Modal v-if="chatVisible" v-model:visible="chatVisible" :blurFlag="true">
      <AddFriend v-if="addIndex === 'launch'" @close="chatVisible = false"></AddFriend>
      <CreateGroup v-if="addIndex === 'addGroup'" @close="chatVisible = false" :isH5="env.isH5"/>
      <Transfer v-if="addIndex === 'addFriend'" @close="chatVisible = false" :isH5="env.isH5"></Transfer>
      <CreateCommunity v-if="addIndex === 'createCom'" @close="chatVisible = false"></CreateCommunity>
      <JoinCommunity v-if="addIndex === 'joinCom'" @close="chatVisible = false"></JoinCommunity>
    </Modal>
  </teleport>
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted, nextTick,watch } from "vue";
import { useRouter,useRoute} from "vue-router";
import { storeToRefs } from "pinia";
import { Icon as ChatIcon } from "@iconify/vue";
import { communityStore } from "./store/communityStore";
import config from './config'
import { appStore } from '../../store'
import { chatStore } from '../../store/chat';
import _ from 'lodash-es';

import CreateCommunity from './components/CreateCommunitys.vue';
import Modal from '../../components/Modal.vue';
import AddFriend from '../../TUIKit/TUIComponents/components/transfer/addFriend.vue';
import Transfer from '../../TUIKit/TUIComponents/components/transfer/index.vue';
import JoinCommunity from './components/JoinCommunity.vue';
import CreateGroup from '../../TUIKit/TUIComponents/container/TUISearch/components/createGroup/index.vue';
import CategoryFloat from './components/float/CategorysFloat.vue';
import DefaultFloat from './components/float/DefaultsFloat.vue';

export default {
  name: "chat",
  components: {
    ChatIcon,CreateCommunity,Modal,AddFriend,
    Transfer,JoinCommunity,CreateGroup,
    CategoryFloat,DefaultFloat
  },

  setup(props, ctx) {
    const com = communityStore();
    
    const { communityList,currentNo } = storeToRefs(com);
    const chat = chatStore();
    const { settings,contactsSet } = storeToRefs(chat)
    const appS = appStore();
    const { userInfo } = appS;
    const router = useRouter()
    const route = useRoute()
    const TUIServer = window.$TUIKit

    const data = reactive({
      chatVisible:false,
      addIndex:'',
      index: 'chat',
      env: TUIServer.TUIEnv,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      communityNo:'',
    })

    // 聊天入口消息提示状态
    const unReadNum = ref(0)  

    /**事件开始**/ 
    //触发社群创建入口
    const createCommunity = () =>{  
      data.chatVisible = true
      data.addIndex = 'createCom'
    }
    // 切换左侧tab
    const selectTab = async (item)=>{
      data.index = item.type
      if(item.route.params.no !== 1){
        data.communityNo = item.route.params.no
        await com.getCategoryData(item.route.params.no)
      }else{
        data.communityNo = 1
        await com.getCategoryData('')
      }
      router.push(item.route)
      com.currentNo  = item.no
    }
    // 触发添加入口
    const triggerAddModal = (item)=>{
      data.addIndex = item.index
      data.chatVisible = true
    }
    /**事件结束**/

    /**初始ref定义数组开始**/
    const headList = ref([
      {
        newIcon: "fluent:chat-16-regular",  tab: "session",
        route: { name: "chatMain", params: { no: "" } },
        callBack: (item) => { selectTab(item) },
        unread:unReadNum > 99 ? 99 : unReadNum
      },
      {
        tab: "contact", newIcon: "fluent:people-16-regular",
        route: { name: "contact", params: { no: "" } },
        callBack: (item) => { selectTab(item) },
      },
      ...(config.adminUids.includes(userInfo.uid) ? [
        {
          icon: "diannao", type: "admin", tab: "admin",title: "管理面板(仅管理员可见)",
          route: {  name: "chatAdmin", params: { no: ""}},
          callBack: (item) => { selectTab(item) },
        },
      ]: []),
      {
        tab:'find',type: 'find', newIcon:'eva:compass-outline',
        route:{ name: 'chatFind', params: { no: "" }},
        callBack: (item) => { selectTab(item) }
      },
    ])
    const bodyList = ref([
      // 写社群相关静态内容时临时打开的路由
      {
        img: '/icons/logo128.png',   icon: '',float: "", id:0,
        noBg: true,tab:'community',type: 'community',
        route:{ name: 'defaultCommunity',params:{no:1} },
        callBack: (item) => { selectTab(item) }
      },
    ])
    const footList = ref([
      {
        full: true,
      },
      {
        newIcon:'fluent:add-16-filled', icon: 'tianjia2',
        children:[
          {
            icon: 'message', newIcon:'fluent:chat-16-regular',  name: '发起群聊',index: 'launch',
            callBack: (item) => { triggerAddModal(item) }
          },
          {
            icon: 'team', newIcon:'fluent:people-16-regular',name: '加入群聊', index: 'addGroup',
            callBack: (item) => { triggerAddModal(item) }
          },
          { 
            icon: 'tianjiachengyuan', newIcon:'fluent:people-add-16-regular', name: '添加好友', index: 'addFriend',
            callBack: (item) => { triggerAddModal(item) }
          },
          {
            icon: 'smile',  newIcon:'fluent:emoji-smile-slight-24-regular', name: '创建社群', index: 'createCom',
            callBack: () => { createCommunity() }
          },
          {
            icon: 'team',  newIcon:'fluent:people-16-regular', index: 'joinCom', name: '加入社群',
            callBack: (item) => { triggerAddModal(item) }
          }
        ]
      }
    ])
    const createCommunityList = ref([
      {
        newIcon:'fluent:add-16-filled',
        id:2,
        callBack: () => { createCommunity() }
      },
    ])
    /**初始ref定义数组结束**/

    /**监听communityList开始**/
    watch(()=>communityList.value,(newVal)=>{
      console.log('执行...测试',newVal);
      const isNull = newVal.length !== undefined && newVal.length !== 0;
      if(isNull){
        const communityData = communityList.value;
        const mapCommunityData = communityData.map((item)=>{
          return {
            ...item,
            img:item.icon,float:'',
            tab:`community_${item.no}`,  noBg:true,
            type:`community${item.cno}`,
            route:{ name:'myCommunity',params:{no: item.no}},
            callBack:(item)=>{ selectTab(item) },
          }
        });
        const mergeArray = bodyList.value.concat(mapCommunityData.concat(createCommunityList.value));
        bodyList.value = mergeArray;
      }
    })
    /**监听communityList结束**/

    const filterList  = computed(()=>{
      const uniqueList = [];
      for(const item of bodyList.value){
        const index = uniqueList.findIndex((find)=>{
          return find.id === item.id
        })
        if(index === -1){
          uniqueList.push(item)
        }
      }
      const lastList = [
        ...headList.value,
        ...uniqueList,
        ...footList.value
      ]
      if(settings.value.enableHide){
        const mapFloatLeft = lastList.map((item)=>{
          return {...item,float:item.float === '' ? "communityFloat" : ''}
        });
        return mapFloatLeft
      }else{
        return lastList
      }
    })

    /**初始化挂载开始**/
    onMounted(()=>{
      nextTick(()=>{
        com.getMyCommunity();
        window.$chat.on(window.$TUIKit.TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, async(e) => {
          unReadNum.value = e.data;
          com.updateMsgStatus();
        });
      })
    })
    /**初始化挂载结束**/

    return{
      headList,bodyList,footList,
      filterList, createCommunityList,unReadNum,
      ...toRefs(data),createCommunity,
      selectTab,triggerAddModal,
    }
  }
 
};
</script>

<style lang="scss" scoped>
:deep(.tippy-content){
 padding: 0 !important;
 // width:336px !important;
}
:deep(.tippy-box){
 border-radius: 12px !important;
 border: 1px solid var(--divider);
 box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.2), 0px 0px 20px 0px rgba(0,0,0,0.1), 0px 0px 40px 0px rgba(0,0,0,0.2);
}

:deep(.menu-item )+div{
  z-index: 90 !important;
}

:deep(.xt-br){
  margin: 0 !important;
}
</style>