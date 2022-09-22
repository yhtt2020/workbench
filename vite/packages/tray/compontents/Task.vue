<template>
  <div class="main" >
    <div class="box-title flex justify-start align-center">
      <cloud-sync-outlined  class="box-icon" />
      <span class="text-title" style="margin-left: 10px">空间 </span>
     <div class="box-extra"> <swap-outlined @click="switchSpace" title="切换空间" class="text-button" /></div>
    </div>
    <div class="box-content">
      <div v-if="currentSpace.name">
        <div class="text-more" style="margin-bottom: 5px">
          <img style="width: 20px" src="/icons/box.svg"/> {{currentSpace.name}}
        </div>
        <div style=";font-size: 12px;color: grey">
          <span v-if="currentSpace.spaceType==='cloud'">
            云空间
          </span>
          <span v-else>类型：本机空间</span>
          <div style="font-size: 12px;color: grey">
            {{currentSpace.space.count_task}} 标签组 {{currentSpace.space.count_tab}}标签
          </div>
          <div >
            最后同步：<span class="time" v-html="friendlyDate(currentSpace.space.sync_time)"></span>
          </div>
        </div>

      </div>
       <span v-else>
         <a-empty style="    margin: 0;
    color: rgba(0, 0, 0, 0.25);
    margin-bottom: 0;
    padding-top: 17px;" :description="null" :image="simpleImage"></a-empty>
       </span>
    </div>
  </div>
</template>


<script lang="ts">
import {
  CommentOutlined,
  CloudSyncOutlined,
  SwapOutlined
} from '@ant-design/icons-vue'
import { Empty } from 'ant-design-vue';
import { defineComponent } from 'vue'
const {spaceModel}=window.$models
export default defineComponent({
  components: {
    CommentOutlined,
    CloudSyncOutlined,
    SwapOutlined
  },
  data(){
    return {
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      currentSpace:{}
    }
  },
  async mounted() {
    this.currentSpace = await spaceModel.getCurrent()
    setInterval(async ()=>{
      this.currentSpace = await spaceModel.getCurrent()
    },30000)
  },
  methods:{
    friendlyDate:window.tsbApi.util.friendlyDate,
    switchSpace(){
      ipc.send('showUserWindow')
    }
  }
})


</script>


<style>
.time span{
  color: grey;
}
</style>
