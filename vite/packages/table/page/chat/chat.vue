<template>
  <div class="flex h-full py-3">
    <xt-left-menu :list="chatLeftList" :index="index" last="3" end="1"></xt-left-menu>
    <!-- <router-view></router-view> -->
    <template v-if="type === 'chat'">
      <ChatMain></ChatMain>
    </template>

    <template v-if="type === 'find'">
      <ChatFind @updateChat="updateChat"></ChatFind>
    </template>

    <template v-if="type === 'thisky'">
      <ThiskyIndex></ThiskyIndex>
      <!-- <Commun /> -->
    </template>

    <div v-show="type==='contact'" style="flex:1;width: 0" >
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { TUIEnv } from '../../TUIKit/TUIPlugin';
import Drag from '../../TUIKit/TUIComponents/components/drag';
import { handleErrorPrompts } from '../../TUIKit/TUIComponents/container/utils';
import TUIContact from "../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import SecondPanel from "../../components/SecondPanel.vue";
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { message } from "ant-design-vue";
// import Commun from './Commun.vue'
import ChatFind from "./page/chatFind.vue"
import ChatMain from './page/chatMain.vue';
import ThiskyIndex from './page/thiskyIndex.vue'

export default {
  name: 'App',
  components: {
    SecondPanel,
    TUIContact,
    Drag,
    ChatFind,
    ThiskyIndex,
    ChatMain

  },

  setup() {
    const router = useRouter()
    const data = reactive({
      index:0,
      type:'chat'
    })

    const selectTab = (item: any) => {

      // router.push(item.route)
      data.type = item.type
      if(item.type==='contact'){
        router.push({
          name:'contact'
        })
      }
    }

    const chatLeftList = ref([
      {
        icon: 'message',
        type: 'chat',
        title:'消息',
        // route:{
        //   name:'chatMain'
        // },
        callBack: selectTab,
      },
      {
        icon: 'team',
        type: 'contact',
        callBack: selectTab,
        // route:{
        //   name:'chatFind'
        // }
      },
      {
        icon: 'zhinanzhen',
        type: 'find',
        callBack: selectTab,
        // route:{
        //   name:'chatFind'
        // }
      },
      {
        icon:'',
        img: '/icons/bz1.png',
        type: 'thisky',
        callBack: selectTab,
        // route:{
        //   name:'chatThisky'
        // }
      },
      {
        icon: 'tianjia2',
        children:[
          {
            icon: 'message',
            name:'发起群聊',
          },
          {
            icon: 'team',
            name:'加入群聊',
          },
          {
            icon: 'tianjiachengyuan',
            name:'添加好友',
          }
        ]
      },
    ])

    // const router = useRouter()

    // onMounted(()=>{
    //   router.push({name:'chatThisky'})
    // })

    const updateChat = () => {
      data.index = 0
      data.type = 'chat'
    }

    return {
      chatLeftList,
      ...toRefs(data), updateChat,
    }
  }
}
</script>

<style scoped>
:deep(.xt-br) {
  margin-right: 0px !important;
}
</style>
