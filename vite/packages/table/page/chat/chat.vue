<template>
  <div class="flex h-full py-3">
    <xt-left-menu :list="chatLeftList" :index="index" last="2" end="1"></xt-left-menu>
    <!-- <router-view></router-view> -->
    <template v-if="type === 'chat'">
      <ChatMain></ChatMain>
    </template>

    <template v-if="type === 'find'">
      <ChatFind @updateChat="updateChat"></ChatFind>
    </template>

    <template v-if="type === 'thisky'">
      <ThiskyIndex></ThiskyIndex>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted,ref} from 'vue';
import {TUIEnv} from '../../TUIKit/TUIPlugin';
import Drag from '../../TUIKit/TUIComponents/components/drag';
import {handleErrorPrompts} from '../../TUIKit/TUIComponents/container/utils';
import TUIContact from "../../TUIKit/TUIComponents/container/TUIContact/index.vue";
import SecondPanel from "../../components/SecondPanel.vue";
import {onBeforeRouteUpdate, useRoute} from 'vue-router'
import {message} from "ant-design-vue";


export default defineComponent({
  name: 'App',
  components: {
    SecondPanel,
    TUIContact,
    Drag,
  },

  setup () {
    const data = reactive({
      index:2,
      type:'thisky'
    })

    const selectTab = (item:any) =>{
      // router.push(item.route)
      data.type = item.type
    }

    const chatLeftList = ref([
      {
        icon:'message',
        type:'chat',
        // route:{
        //   name:'chatMain'
        // },
        callBack:selectTab,
      },
      {
        icon:'zhinanzhen',
        type:'find',
        callBack:selectTab,
        // route:{
        //   name:'chatFind'
        // }
      },
      {
        img:'/icons/bz1.png',
        type:'thisky',
        callBack:selectTab,
        // route:{
        //   name:'chatThisky'
        // }
      },
      {
        icon:'tianjia2'

      },
    ])

    // const router = useRouter()
    
    // onMounted(()=>{
    //   router.push({name:'chatThisky'})
    // })

    const updateChat = () =>{
      data.index = 0
      data.type = 'chat'
    }

    return {
      chatLeftList,
      ...toRefs(data),updateChat,
    }
  }
})
</script>

<style scoped>
:deep(.xt-br){
  margin-right:0px !important;
}
</style>