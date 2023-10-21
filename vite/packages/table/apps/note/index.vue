<template>
    <div class="mr-3 h-full" style="min-width: 400px;">
      <LeftTab>
          <div class="h-full w-full flex">
              <div class="flex h-full">
              <!-- <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft> -->
              <LeftSearch :selDesk="selDesk"></LeftSearch>
              </div>
              <div class="flex h-full flex-col w-full" style="min-width: 400px;">
                <NodeContent :selDesk="selDesk" v-show="this.selNote>=0"></NodeContent>
              </div>
          </div>
      </LeftTab>
      <Modal v-if="promptVisible" blurFlag="true" style="z-index:99999;"  >
        <div class="p-5 xt-modal flex flex-col justify-center" style="width:500px;height:516px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);background: #212121;">
          <div  style="width:100%;height:46px;position:relative;">
            <div class='flex justify-center font-16' style='color: rgba(255,255,255,0.85);'>添加到桌面</div>
            <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: #2A2A2A;border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
              <Icon :icon="icons.dismiss16Filled" />
            </div>
          </div>
          <div style="height: 428px;" >
            <div class="mb-4">我的桌面（{{ this.desks.length }}）</div>
            <div class="overflow-hidden xt-scrollbar" style="height: 336px;">
              <div class="w-full flex items-center rounded-lg" 
                style="height: 64px;background: #2A2A2A;justify-content: space-between;padding: 0 24px;" 
                v-for="(item,index) in this.desks" 
                :key="index" 
                :style="{background: this.selIndex == index? 'rgba(80,139,254,0.20)' : '#2A2A2A' ,border:this.selIndex == index? '1px solid rgba(80,139,254,1)' : '1px solid transparent' ,
                'margin-bottom': index == this.desks.length-1? '0' : '16px'}"
                 
                @click="changeSelIndex(index)">
                <div style="font-size: 16px;color: var(--primary-text);" class="flex items-center">
                  <Icon icon="fluent-emoji-flat:desktop-computer" width="24" height="24" class="mr-4"/>
                  {{ item.name }}
                </div>
                <div style="font-size: 14px;color: var(--secondary-text);">主页桌面</div>
                
              </div>
            </div>
          </div>
          <div class='flex font-16' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
            <xt-button style="width: 64px;height:40px;" class="mr-3" @click="this.promptVisible = false">取消</xt-button>
            <xt-button style="width: 64px;height:40px;" class="xt-active-btn" @click="changeDesk">选择</xt-button>
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
  import { deskStore } from '../../store/desk'
  import { cardStore } from '../../store/card'
  import { appStore } from '../../../app/store'

  
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
        // 弹窗
        promptVisible:false,

      }
    },
    mounted () {
      this.getNotes()
    },
    computed: {
          ...mapWritableState(noteStore, ['noteList','selNote','noteBgColor']),
          ...mapWritableState(cardStore, ['desks','selIndex']),
          
    },
    methods: {
      ...mapActions(noteStore,['getNotes','switchDesk']),
      // 选择便签
      changeSelIndex(n){
        this.selIndex = n
      },
      // 选择桌面
      selDesk(){
        this.desks.forEach((item,index) => {
          if(item.id == this.noteList[this.selNote].desk.id){
            this.selIndex = index
          }
        });
        this.promptVisible = true
      },
      // 切换便签在不同的桌面
      changeDesk(){
        this.promptVisible = false
        this.switchDesk(this.selNote,this.selIndex)
      },
      
    }
  }
  </script>
  
  <style scoped>
  
  </style>
  