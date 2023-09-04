<template>
  <div class="flex h-full py-3">
    <xt-left-menu :list="chatLeftList" :index="2" last="2" end="1"></xt-left-menu>
    
    <template v-if="index === 'chat'">
      <ChatMain></ChatMain>
    </template>

    <template v-else-if="index === 'find'">
      <ChatFind></ChatFind>
    </template>

    <template v-else-if="index === 'thisky'">
      <ThiskyIndex></ThiskyIndex>
    </template>
  </div>

  <!-- <TUISearch class="search"/> -->
</template>

<script>
import { defineComponent,ref,toRefs,reactive } from 'vue'
import ChatMain from './page/chatMain.vue'
import ThiskyIndex from './page/thiskyIndex.vue'
import ChatFind from './page/chatFind.vue'
export default defineComponent({
  components:{
    ChatMain,
    ThiskyIndex,
    ChatFind
  },

  setup () {
    const data = reactive({
      index:'thisky'
    })

    const selectTab = (item) =>{
      data.index = item.type
    }

    const chatLeftList = ref([
      {
        icon:'message',
        type:'chat',
        callBack:selectTab,
      },
      {
        icon:'zhinanzhen',
        type:'find',
        callBack:selectTab,
      },
      {
        img:'/icons/bz1.png',
        type:'thisky',
        callBack:selectTab,
      },
      {
        icon:'tianjia2'

      },
    ])

    return {
      chatLeftList,
      ...toRefs(data),selectTab,
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.xt-br){
  margin-right:0px !important;
}
</style>