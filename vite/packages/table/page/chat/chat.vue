<template>
  <div class="flex h-full py-3">
    <xt-left-menu :list="chatLeftList" :index="index" last="3" end="1"></xt-left-menu>
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

    <router-view></router-view>
  </div>

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
        icon: 'zhinanzhen',
        type: 'find',
        callBack: selectTab,
        route:{
          name:'contact'
        }
      },
      {
        icon: 'team',
        type: 'contact',
        callBack: selectTab,
        route:{
          name:'chatFind'
        }
      },
      {
        icon:'',
        img: '/icons/bz1.png',
        type: 'thisky',
        callBack: selectTab,
        route:{
          name:'chatThisky'
        }
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

<style scoped>
:deep(.xt-br) {
  margin-right: 0px !important;
}
</style>
