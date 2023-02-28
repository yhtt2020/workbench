<template>
  <h1 style="text-align: center">
    数据监控小助手
  </h1>
  <div>当前还没有正在监控中的任务</div>
  <div>
    <h3>
      添加任务
    </h3>
    <a-row :gutter="20">
      <a-col :span="5">
        <div @click="addVideo" class="btn">
          <Icon icon="tianjia1"></Icon>
          <br>
          B视频监控
        </div>
      </a-col>
      <a-col :span="5">
        <div @click="addVideo" class="btn">
          <Icon icon="tianjia1"></Icon>
          <br>
          追B站UP主
        </div>
      </a-col>
    </a-row>
  </div>

  <a-drawer class="no-drag" v-model:visible="addVideoVisible" style="overflow: hidden">
    <div style="margin:1em;overflow: hidden">
      <a-input-group style="width: 30em;margin-bottom: 2em" compact>
        <a-input v-model:value="addUrl" placeholder="PC端视频链接" style="width: calc(100% - 200px)">
        </a-input>
        <a-button @click="addWatch" type="primary">
          获取
        </a-button>
      </a-input-group>
      <div class="line title">
        视频基本信息：
      </div>
      <div class="line" style="padding: 0.5em">
        <div v-if="!videoInfo.title">
          请点击“获取”按钮获得视频信息。
        </div>
      </div>
      <div class="line title">
        更新频率
      </div>
      <div class="line">
        <a-select style="width: 7em" v-model:value="updateInterval">
          <a-select-option value="15">
            15秒钟
          </a-select-option>
          <a-select-option value="30">
            30秒
          </a-select-option>
          <a-select-option value="60">
            1分钟
          </a-select-option>
          <a-select-option value="300">
            5分钟
          </a-select-option>
          <a-select-option value="600">
            10分钟
          </a-select-option>
          <a-select-option value="1800">
            30分钟
          </a-select-option>
          <a-select-option value="3600">
            1小时
          </a-select-option>
        </a-select>
      </div>

      <div class="line" style="position: absolute;bottom: 1em;">
        <a-button :disabled="!this.videoInfo.title" size="large" type="primary" >
          确定
        </a-button>
      </div>

    </div>

  </a-drawer>
</template>

<script>
import {message} from 'ant-design-vue'
export default {
  name: 'Index',
  data () {
    return {
      addVideoVisible: false,
      updateInterval: 15,
      addUrl:'',
      videoInfo:{
        title:''
      },
      watchTask:[],
      currentTaskId:'',
    }
  },
  methods: {
    addVideo () {
      this.addVideoVisible = true
    },
    addWatch(){
      if(this.addUrl===''){
        message.error('请输入视频链接')
      }
      this.currentTaskId=Date.now()
      ipc.send('addWatch',{id: this.currentTaskId,url:this.addUrl,cb:(args)=>{
        //回调
      }})
    }
  }
}
</script>

<style scoped>
.line{
  margin-bottom: 1em;
  padding-left: 1em;
}
.title{
  padding-left: 0;
  font-weight: bold;
}
.btn{
  text-align: center;
}
</style>
