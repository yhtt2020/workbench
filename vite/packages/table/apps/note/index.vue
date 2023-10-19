<template>
    <div class="mr-3 h-full" style="min-width: 400px;">
      <LeftTab>
          <div class="h-full w-full flex">
              <div class="flex h-full">
                <div @click="promptVisible = !promptVisible">123</div>
              <!-- <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft> -->
              <LeftSearch></LeftSearch>
              </div>
              <div class="flex h-full flex-col w-full" style="min-width: 400px;">
                <NodeContent v-show="this.selNote>=0"></NodeContent>
              </div>
          </div>
      </LeftTab>
      <Modal v-if="promptVisible" blurFlag="true" style="z-index:99999;"  >
        <div class="p-5 xt-modal flex flex-col justify-center" style="width:500px;height:516px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);background: #212121;">
          <div  style="width:100%;height:64px;position:relative;">
            <div class='flex justify-center font-16' style='color: rgba(255,255,255,0.85);'>添加到桌面</div>
            <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: #2A2A2A;border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
              <Icon :icon="icons.dismiss16Filled" />
            </div>
          </div>
          <div style="height: 428px;" >11</div>
          <div class='flex font-16' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
            <!-- <div class='no-drag btn-active input pointer flex justify-center items-center' @click='promptVisible=false' style='width:64px;height:40px;background: #2A2A2A;'>取消</div>
            <div class='no-drag xt-active-btn input pointer' style='width:64px;height:40px;'>选择</div> -->
            <xt-button style="width: 64px;height:40px;" class="mr-3">取消</xt-button>
            <xt-button style="width: 64px;height:40px;" class="xt-active-btn">选择</xt-button>
          </div>
        </div>
      </Modal>

    </div>
  
  </template>
  
  <script>
  
  import NodeContent from "./components/nodeContent.vue";
  import LeftTab from "./components/leftTab.vue";
  import LeftSearch from "./components/leftSearch.vue";
  import {mapActions, mapState,mapWritableState} from "pinia";
  import { noteStore } from './store'
  import Modal from '../../components/Modal.vue'
  import { Icon } from '@iconify/vue';
  import dismiss16Filled from '@iconify-icons/fluent/dismiss-16-filled';
  
  export default {
    name: 'Tomato',
    components:{
        LeftTab,
        LeftSearch,
        NodeContent,
        Modal,
        Icon,
    },
    data () {
      return {
        icons: {
          dismiss16Filled,
        },
        promptVisible:false,

      }
    },
    mounted () {
      
    },
    computed: {
          ...mapWritableState(noteStore, ['noteList','selNote','noteBgColor']),
    },
    methods: {
      test(){
        console.log(this.selNote);
      }
      
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  