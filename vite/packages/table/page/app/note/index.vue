<template>
    <div class="mr-3 h-full">
        <LeftTab>
            <div class="h-full w-full flex">
                <div class="flex h-full">
                <!-- <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft> -->
                <LeftSearch></LeftSearch>
                </div>
                <div class="flex h-full flex-col w-full">123456
                    <!-- <img src="https://a.apps.vip/icons/iconSelect/emoji/american-football.svg" /> -->
                    <!-- <img src="https://a.apps.vip/icons/iconSelect/icon/bank.svg" /> -->
                <!-- <HeaderView></HeaderView>
                <Caht></Caht> -->
                </div>
            </div>
        </LeftTab>

    </div>
  
  </template>
  
  <script>
  
  
import LeftTab from "./components/leftTab.vue";
import LeftSearch from "./components/leftSearch.vue";
  export default {
    name: 'Tomato',
    components:{
        LeftTab,
        LeftSearch,
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
  