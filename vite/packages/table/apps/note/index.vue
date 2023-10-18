<template>
    <div class="mr-3 h-full">
        <LeftTab>
            <div class="h-full w-full flex">
                <div class="flex h-full">
                <!-- <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft> -->
                <LeftSearch></LeftSearch>
                </div>
                <div class="flex h-full flex-col w-full">
                  <NodeContent></NodeContent>
                </div>
            </div>
        </LeftTab>

    </div>
  
  </template>
  
  <script>
  
import NodeContent from "./components/nodeContent.vue";
import LeftTab from "./components/leftTab.vue";
import LeftSearch from "./components/leftSearch.vue";
  export default {
    name: 'Tomato',
    components:{
        LeftTab,
        LeftSearch,
        NodeContent,
    },
    data () {
      return {

      }
    },
    mounted () {
      
    },
    computed: {
      
    },
    methods: {
      
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  