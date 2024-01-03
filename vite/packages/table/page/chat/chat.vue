<template>
  <xt-left-menu :list="filterList" :index="index" last="3" end="2">
    <div class="w-full">
      <router-view ></router-view>
    </div>
    <template v-for="item in filterList" #[item.float]>
      <CategoryFloat v-if="item.route.params.no !== 1" :no="item.route.params.no" @clickItem="currentItem"></CategoryFloat>
      <DefaultFloat v-else></DefaultFloat>
    </template>
  </xt-left-menu>
  <teleport to='body'>
    <Modal v-if="chatVisible" v-model:visible="chatVisible" :blurFlag="true">
      <AddFriend v-if="addIndex === 'launch'" @close="chatVisible = false"></AddFriend>
      <CreateGroup v-if="addIndex === 'addGroup'" @close="chatVisible = false" :isH5="env.isH5"/>
      <Transfer v-if="addIndex === 'addFriend'" @close="chatVisible = false" :isH5="env.isH5"></Transfer>
      <CreateCommunity v-if="addIndex === 'createCom'" @close="chatVisible = false"></CreateCommunity>
      <JoinCommunitys v-if="addIndex === 'joinCom'" @close="chatVisible = false"></JoinCommunitys>
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
import { communityTotal } from './libs/utils';
import { completeTask } from '../../apps/task/page/branch/task';

import CreateCommunity from './components/CreateCommunitys.vue';
import Modal from '../../components/Modal.vue';
import AddFriend from '../../TUIKit/TUIComponents/components/transfer/addFriend.vue';
import Transfer from '../../TUIKit/TUIComponents/components/transfer/index.vue';
import CreateGroup from '../../TUIKit/TUIComponents/container/TUISearch/components/createGroup/index.vue';
import CategoryFloat from './components/float/CategorysFloat.vue';
import DefaultFloat from './components/float/DefaultsFloat.vue';
import JoinCommunitys from './components/communityJoin/JoinCommunitys.vue';

export default {
  name: "chat",
  components: {
    ChatIcon,CreateCommunity,Modal,AddFriend,
    Transfer,CreateGroup,CategoryFloat,DefaultFloat,
    JoinCommunitys,
  },

  setup(props, ctx) {
    const com = communityStore();
    const chat = chatStore();
    const appS = appStore();

    const { community } = storeToRefs(com);
    const { settings,contactsSet } = storeToRefs(chat)
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
      communityData:null,
      communityNo:1,
    })

    //触发社群创建入口
    const createCommunity = () =>{
      data.chatVisible = true
      data.addIndex = 'createCom'
    }
    // 切换左侧tab
    const selectTab = async (item)=>{
      data.index = item.type;
      const no = item.route.params.no; // 取出社群id
      data.communityNo = no;
      // if(no !== 1){
      //   data.communityData = com.getCommunityDetail(item.route.params.no)
      // }
      router.push(item.route)
    }
    // 触发添加入口
    const triggerAddModal = (item)=>{
      data.addIndex = item.index
      data.chatVisible = true
    }

    // 获取总的消息未读数据
    const unreadTotal = computed(()=>{
      const list = window.$TUIKit.store.store.TUIConversation.conversationList;
      if(!list){
        return 0
      }
      if(list.length !== undefined &&  list.length !== 0){
        const total = { unread:0 };
        for(const item of list){
         total.unread += item.unreadCount;
        }
        return total.unread === 0 ? 0 : total.unread > 99 ? 99 : total.unread ;
      }
    })

    /**初始ref定义数组**/
    const headList = ref([
      {
        newIcon: "fluent:chat-16-regular",  tab: "session",
        route: { name: "chatMain", params: { no: "" } },
        callBack: (item) => { selectTab(item) },
        info:unreadTotal.value === 0 ? [] : ['tr','red',`${unreadTotal.value}`]
        // unread: unreadTotal.value,
        // info:['tr','red',`${unreadTotal.value}`]
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
        img: '/icons/logo128.png', float: "", id:0,
        noBg: true,tab:'community',type: 'community',
        route:{ name: 'defaultCommunity',params:{no:1} },
        callBack: (item) => { selectTab(item) },
        info:[],
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
            callBack: (item) => { triggerAddModal(item); completeTask('Z0601');}
          },
          {
            icon: 'team', newIcon:'fluent:people-16-regular',name: '加入群聊', index: 'addGroup',
            callBack: (item) => { triggerAddModal(item);completeTask('Z0601'); }
          },
          {
            icon: 'tianjiachengyuan', newIcon:'fluent:people-add-16-regular', name: '添加好友', index: 'addFriend',
            callBack: (item) => { triggerAddModal(item);completeTask('Z0602'); }
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

    /**监听communityList**/
    watch(()=>community.value.communityList,(newVal)=>{
      const isNull = newVal.length !== undefined && newVal.length !== 0;
      if(isNull){
        const communityData = newVal;
        const mapCommunityData = communityData.map((item)=>{
          const newInfo = item?.communityInfo;
          return {
            ...item,
            img:newInfo.icon,float:'',
            tab:`community_${newInfo.no}`,  noBg:true,
            type:`community${item.cno}`,
            route:{ name:'myCommunity',params:{no: newInfo.no}},
            callBack:(item)=>{ selectTab(item) },
          }
        });
        const mergeArray = bodyList.value.concat(mapCommunityData);
        bodyList.value = mergeArray;
      }
    })

    // 合并群聊左侧列表数据
    const filterList  = computed(()=>{
      const uniqueList = [];
      for(const item of bodyList.value){
        const index = uniqueList.findIndex((find)=>{  return find.id === item.id  });
        if(index === -1){
          const total = communityTotal(item.no,community.value.communityTree);
          const itemOption = {
            ...item,
            info:total === 0 ? [] : ['tr','red',`${total}`],
          }
          uniqueList.push(itemOption)
        }
      }
      const updateList = uniqueList.concat(createCommunityList.value);
      const lastList = [
        ...headList.value,
        ...updateList,
        ...footList.value
      ]
      if(settings.value.enableHide){
        const mapFloatLeft = lastList.map((item)=>{
          return {...item,float:item.float === '' ? `communityFloat${item.no}` : ''}
        });
        return mapFloatLeft
      }else{
        return lastList
      }
    })

    /**初始化挂载**/
    onMounted(()=>{
      com.getMyCommunity();
      com.getCommunityTree();
      nextTick(()=>{
        window.$chat.on(window.$TUIKit.TIM.EVENT.TOTAL_UNREAD_MESSAGE_COUNT_UPDATED, async(e) => {
          // headList.value[0].unread = e.data === 0 ? 0 : e.data > 99 ? 99 : e.data;
          headList.value[0].info = e.data === 0 ? [] :  e.data > 99 ? ['tr','red','99'] : ['tr','red',`${e.data}`];
          const list = community.value.communityList;
          if(list.length !== 0){
            for(const item of list){
             const no = item.communityInfo.no;
             com.updateCommunityTree(no);
            }
          }
        });
      })
    })

    return{
      headList,bodyList,footList,
      filterList, createCommunityList,
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
