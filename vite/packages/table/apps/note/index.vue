<template>
    <div class="mr-3 h-full overflow-hidden" style="min-width: 400px;">
      <LeftTab>
          <div class="h-full w-full flex">
              <div class="flex h-full">
              <!-- <ChatLeft v-if="selectTab == 'Chat'"></ChatLeft> -->
              <LeftSearch :selDesk="selDesk"></LeftSearch>
              </div>
              <div class="flex h-full flex-col w-full" style="min-width: 400px;">
                <NodeContent :selDesk="selDesk" v-show="this.selNote>=0 && this.noteList.length >0"></NodeContent>
              </div>
          </div>
      </LeftTab>
      <Modal v-if="promptVisible" blurFlag="true" style="z-index:99999;"  >
        <div class="p-5 pt-1 pb-1 flex flex-col justify-center" style="width:500px;height:516px;border-radius:12px;border: 1px solid rgba(255,255,255,0.1);box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);">
          <div  style="width:100%;height:46px;position:relative;color: var(--primary-text);">
            <div class='flex h-full items-center justify-center font-16'>添加到桌面</div>
            <div class="flex justify-center items-center pointer btn-active" style='position:absolute;top:-5px;right:-7px;background: var(--secondary-bg);border-radius: 10px;width:40px;height:40px;' @click='promptVisible=false'>
              <Icon :icon="icons.dismiss16Filled" />
            </div>
          </div>
          <div class="mt-1">
            <!-- <div class="mb-4">我的桌面（{{ this.desks.length }}）</div> -->
            <div style="background: var(--secondary-bg);border-radius: 10px; padding: 10px 12px;color: var(--primary-text);">将当前便签添加到指定桌面，你可以再桌面上快速查看和编辑。</div>
            <div class="overflow-hidden xt-scrollbar mt-3" style="height: 336px;">
              <div class="w-full flex items-center rounded-lg pointer" 
                style="height: 64px;background: var(--secondary-bg);justify-content: space-between;padding: 0 24px;" 
                v-for="(item,index) in this.desks" 
                :key="index" 
                :style="{background: this.selIndex == index? 'rgba(80,139,254,0.20)' : 'var(--secondary-bg)',border:this.selIndex == index? '1px solid rgba(80,139,254,1)' : '1px solid transparent' ,
                'margin-bottom': index == this.desks.length-1? '0' : '16px'}"
                 
                @click="changeSelIndex(index)">
                <div style="font-size: 16px;color: var(--primary-text);" class="flex items-center">
                  <Icon icon="fluent-emoji-flat:desktop-computer" width="24" height="24" class="mr-4"/>
                  {{ item.name }}
                </div>
                <!-- <div style="font-size: 14px;color: var(--secondary-text);">主页桌面</div> -->
                
              </div>
            </div>
          </div>
          <div class='flex font-16 mt-2' style='color: rgba(255,255,255,0.60);width:100%;justify-content: flex-end;'>
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
  import { cardStore } from '../../store/card'

  export default {
    name: 'note',
    components:{
        LeftTab,
        LeftSearch,
        NodeContent,
        Modal,
        Icon,
    },
    props:{
      customIndex:String
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
    async mounted () {
      
      await this.getNotes()
      if (this.$route.params.customIndex) {
        this.noteList.forEach((item,index)=>{
          if (item.id  == this.$route.params.customIndex) {
            this.selNote = index
          }
        })
      }
    },
    computed: {
          ...mapWritableState(noteStore, ['noteList','selNote','noteBgColor']),
          ...mapWritableState(cardStore, ['desks','selIndex']),
          // backgroundImage(){
          //   if (this.noteList.length) {
          //     return this.selIndex == index? 'rgba(80,139,254,0.20)' : '#2A2A2A' 
          //   }
          // },
          // border(){
          //   if (this.noteList.length) {
          //     return this.selIndex == index? '1px solid rgba(80,139,254,1)' : '1px solid transparent' 
          //   }
          // },
          // marginBottom(){
          //   if (this.noteList.length) {
          //     return index == this.desks.length-1? '0' : '16px'
          //   }
          // },
          
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
          if(item.id == this.noteList[this.selNote].deskId){
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
  