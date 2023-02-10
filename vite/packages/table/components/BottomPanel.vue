<template>
  <div class="bottom-panel" style="position: fixed;width: 100vw;padding:10px">
    <a-row :gutter="10">
      <a-col :span="2">
        <a-row class="common-panel" style="width:5em" >
          <PanelButton icon="#icon-shezhi" title="我的"></PanelButton>
        </a-row>
      </a-col>
      <a-col :span="2">
        <a-row class="common-panel" style="width:5em">
          <PanelButton icon="#icon-shezhi" title="设置"></PanelButton>
        </a-row>
      </a-col>
      <a-col  :span="4" class="common-panel">
        <a-row>
          <a-col :span="12">
            <PanelButton icon="#icon-suoding" title="锁屏"></PanelButton>
          </a-col>
          <a-col  :span="12">
            <PanelButton icon="#icon-yidongwenjianjia" :onClick="transFile" title="传文件"></PanelButton>
          </a-col>
        </a-row>
      </a-col>
      <a-col  :span="4" class="common-panel">
        <a-row >
          <a-col  :span="12">
            <PanelButton icon="#icon-suoding" title="动态"></PanelButton>
          </a-col>
          <a-col  :span="12">
            <PanelButton icon="#icon-yidongwenjianjia" title="邮件"></PanelButton>
          </a-col>
        </a-row>
      </a-col>
      <a-col  :span="3">
        <a-row class="common-panel">
<!--          <span class="status-text">专注中</span>-->
          <PanelButton icon="#icon-tiaoduguanli" title="调整"></PanelButton>
        </a-row>
      </a-col>


<!--      <a-col  :span="2">-->
<!--        <a-row class="common-panel" style="width:4em" >-->
<!--          <a-col><PanelButton icon="#icon-xiaoxi" title="消息"></PanelButton></a-col>-->
<!--&lt;!&ndash;          <a-col> <PanelButton icon="#icon-tishi-xianxing" title="通知"></PanelButton></a-col>&ndash;&gt;-->
<!--        </a-row>-->
<!--      </a-col>-->
      <a-col  :span="4">
        <a-row class="common-panel" style="width:10em" >
          <a-col>
            <PanelButton :onClick="setFullScreen" icon="#icon-daochu" title="全屏"></PanelButton>
          </a-col>
          <a-col>
            <PanelButton icon="#icon-tuichu" title="电源"></PanelButton>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
  <div id="trans" v-show="visibleTrans" style="position:fixed;left: 0;top: 0;width: 100vw;height: 100vh;background: #2c2c2c">
    <a-button @click="visibleTrans=false" style="position:fixed;left: 10px;top: 10px">取消</a-button>
    <iframe id="transFrame"  style="width:100vw;height: 100vh;border: none">

    </iframe>
  </div>

</template>

<script>
import PanelButton from './PanelButton.vue'

export default {
  name: 'BottomPanel',
  components: { PanelButton },
  data(){
    return{
      visibleTrans:false,
      full:false
    }
  },
  methods:{
    transFile(){
      //this.visibleTrans=true
      //document.getElementById('transFrame').src='https://szfilehelper.weixin.qq.com/'
      // console.log('发送消息')
     ipc.send('executeAppByPackage',{package:'com.thisky.fileHelper'})

    },
    async setFullScreen () {
      // await tsbApi.window.isFullScreen()
      if (this.full) {
        this.full=false
        tsbApi.window.setFullScreen(false)
      } else {
        this.full=true
        tsbApi.window.setFullScreen(true)
      }

    }
  }
}
</script>

<style scoped>

.status-text {
  font-size: 1.5em;
  line-height: 3em;
  height: 3em;
  width: 6em;
  text-align: center;
}
</style>
