<template>
<div class="main" v-if="messages.length>0" >
  <div class="box-title flex justify-start align-center">
      <comment-outlined class="box-icon" />
      <span class="text-title" style="margin-left: 10px">轻聊</span>
  </div>
  <div class="box-content  flex flex-direction" style="height: auto">
    <div style="width: 100%;margin-bottom: 5px;margin-top: 10px">
      <a-row :gutter="10">
        <a-col @click="openItem(message)" class="text-button text-more" :span="12" v-for="message in messages" style="margin-bottom: 5px">
          <span style="cursor: pointer" type="text">
            <a-avatar v-if="message.avatar" size="small" :src="message.avatar"></a-avatar>
            <a-avatar v-else size="small" src="https://up.apps.vip/logo/group.png?t=2"></a-avatar>
            &nbsp;
            <span v-if="message.body">
              {{message.body}}
            </span><span v-else>{{message.title}}</span>
            &nbsp;&nbsp;</span>
        </a-col>
      </a-row>
    </div>
    <div  style="width: 100%;text-align: center;">
      <span @click="openChat"  class="text-content-b text-button">打开轻聊查看</span>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {
  CommentOutlined
} from '@ant-design/icons-vue'

import { defineComponent } from 'vue'
const {messageModel}=window.$models
const ipc=require('electron').ipcRenderer

export default defineComponent({
  components: {
    CommentOutlined
  },
  data(){
    return {
      messages:[]
    }
  },
   mounted() {
    this.loadMessages()
    setInterval( ()=>{
     this.loadMessages()
    },2000)
  },
  methods:{
    async loadMessages(){
      this.messages=await messageModel.allList()
      if(this.messages.length>4){
        this.messages.splice(4)
      }
    },
    openChat(){
      ipc.invoke('saAppOpenSysApp', {saAppId: 1})
    },
    openItem(item){
      if(item.type === 'groupChat') {
        ipc.send('mesageOpenOperate', {
          saAppId: 1,
          type: 'groupChat',
          indexName: item.index_name
        })
      } else if(item.type === 'webOs') {
        ipc.send('addTab',{url: item.title});
      } else if(item.type === 'community') {
        //todo
      }
    }
  }
})


</script>

<style>

</style>
