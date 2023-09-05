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
import { defineComponent,ref,onMounted,reactive,toRefs } from 'vue'
// import {useRouter} from 'vue-router'
import ChatMain from './page/chatMain.vue'
import ChatFind from './page/chatFind.vue'
import ThiskyIndex from './page/thiskyIndex.vue'

export default defineComponent({
  components:{
    ChatMain,
    ChatFind,
    ThiskyIndex
  },

  setup () {
    const data = reactive({
      index:0,
      type:'chat'
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