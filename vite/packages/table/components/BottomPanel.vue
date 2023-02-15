<template>
  <div class="bottom-panel" style="position: fixed;padding:10px;bottom:0;width: 100vw;text-align: center">
    <div class="common-panel" style="display: inline-block">
      <PanelButton icon="#icon-shezhi" title="设置"></PanelButton>

      <PanelButton icon="#icon-yidongwenjianjia" :onClick="transFile" title="传文件"></PanelButton>
    </div>
    <div class="common-panel" style="display: inline-block">
      <PanelButton icon="#icon-tiaoduguanli" title="调整"></PanelButton>
      <PanelButton :onClick="setFullScreen" icon="#icon-daochu" title="全屏"></PanelButton>


    </div>
    <div class="common-panel" style="display: inline-block">
      <PanelButton icon="#icon-suoding" title="锁屏" :onClick="lock"></PanelButton>
    </div>
    <div class="common-panel" style="display: inline-block">
      <PanelButton :onClick="power" icon="#icon-tuichu" title="电源"></PanelButton>
    </div>
<!--    <div style="display: inline-block">-->
<!--      <a-row :gutter="10">-->
<!--        <a-col :span="2">-->
<!--          <a-row class="common-panel" style="width:5em">-->
<!--            <PanelButton icon="#icon-shezhi" title="设置"></PanelButton>-->
<!--          </a-row>-->
<!--        </a-col>-->
<!--        <a-col  :span="4" class="common-panel">-->
<!--          <a-row>-->
<!--            <a-col :span="12">-->
<!--              <PanelButton icon="#icon-suoding" title="锁屏"></PanelButton>-->
<!--            </a-col>-->
<!--            <a-col  :span="12">-->
<!--              <PanelButton icon="#icon-yidongwenjianjia" :onClick="transFile" title="传文件"></PanelButton>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-col>-->
<!--        <a-col  :span="4" class="common-panel">-->
<!--          <a-row >-->
<!--            <a-col  :span="12">-->
<!--              <PanelButton icon="#icon-suoding" title="动态"></PanelButton>-->
<!--            </a-col>-->
<!--            <a-col  :span="12">-->
<!--              <PanelButton icon="#icon-yidongwenjianjia" title="邮件"></PanelButton>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-col>-->
<!--        <a-col  :span="3">-->
<!--          <a-row class="common-panel">-->
<!--            &lt;!&ndash;          <span class="status-text">专注中</span>&ndash;&gt;-->
<!--            <PanelButton icon="#icon-tiaoduguanli" title="调整"></PanelButton>-->
<!--          </a-row>-->
<!--        </a-col>-->


<!--        &lt;!&ndash;      <a-col  :span="2">&ndash;&gt;-->
<!--        &lt;!&ndash;        <a-row class="common-panel" style="width:4em" >&ndash;&gt;-->
<!--        &lt;!&ndash;          <a-col><PanelButton icon="#icon-xiaoxi" title="消息"></PanelButton></a-col>&ndash;&gt;-->
<!--        &lt;!&ndash;&lt;!&ndash;          <a-col> <PanelButton icon="#icon-tishi-xianxing" title="通知"></PanelButton></a-col>&ndash;&gt;&ndash;&gt;-->
<!--        &lt;!&ndash;        </a-row>&ndash;&gt;-->
<!--        &lt;!&ndash;      </a-col>&ndash;&gt;-->
<!--        <a-col  :span="4">-->
<!--          <a-row class="common-panel" style="width:10em" >-->
<!--            <a-col>-->
<!--              <PanelButton :onClick="setFullScreen" icon="#icon-daochu" title="全屏"></PanelButton>-->
<!--            </a-col>-->
<!--            <a-col>-->
<!--              <PanelButton icon="#icon-tuichu" title="电源"></PanelButton>-->
<!--            </a-col>-->
<!--          </a-row>-->
<!--        </a-col>-->
<!--      </a-row>-->
<!--    </div>-->

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
    power(){
      this.$router.push({path:'/power'})
    },
    lock(){
      this.$router.push({path:'/lock'})
    },
    transFile(){
      //this.visibleTrans=true
      //document.getElementById('transFrame').src='https://szfilehelper.weixin.qq.com/'
      // console.log('发送消息')
     ipc.send('executeAppByPackage',{package:'com.thisky.fileHelper'})
      this.$router.push({
        name:'app',
        params:{
          theme:'#2c2c2c',
          name:'fileHelper',
          url:'https://szfilehelper.weixin.qq.com/',
          preload:'fileHelper',
          background:false,
        }
      })

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
<style>

</style>
<style scoped>

.status-text {
  font-size: 1.5em;
  line-height: 3em;
  height: 3em;
  width: 6em;
  text-align: center;
}
.bottom-panel .common-panel{
  padding: 0.2em 1em 0.2em 1em !important;
}

</style>
