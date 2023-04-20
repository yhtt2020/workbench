<template>
  <div class="rotate-center s-text" style="font-size: 2em;margin-bottom: 1em">
    锁屏设置

  </div>
  <div class="pointer s-icon" style="position: fixed;right: 2em;top: 4em">
    <div  @click="resetPapersSettings" style="display: inline-block;margin-right: 1em">
      <span><Icon style="font-size: 2em;vertical-align: top"
                  icon="shuaxin"></Icon></span><span  style="font-size:1.2em" class="s-text"> 重置全部设置</span>
    </div>
  </div>
  <vue-custom-scrollbar id="containerWrapper " :settings="settingsScroller" style="height: 80vh;">
      <div class="card auto-height s-bg" style="display: inline-block;width: 25em;padding: 1em;text-align: left;margin-right: 2em;margin-bottom: 2em">

        <div class="line-title ">基础设置</div>
        <div class="line" v-if="!settings.enable">
          如果您的显示器为OLed面板，建议启用锁屏壁纸，且轮播不少于3张壁纸，以防止烧屏。
        </div>
        <div class="line">
          使用锁屏壁纸：<a-switch v-model:checked="settings.enable"></a-switch>
        </div>
        <div v-if="settings.enable">
          <div class="line">
            进入锁屏时间：   <a-input-number default-value="300" v-model:value="settings.lockTimeout"></a-input-number> 秒
          </div>
          <div class="line">
            在状态栏提示还有多久自动锁屏：<a-switch v-model:checked="settings.tipLock"></a-switch>
          </div>
          <div class="line">
            壁纸保存位置：<a-input placeholder="请选择壁纸保存地址" @click="showSaveDialog" style="width: 15em" v-model:value="settings.savePath"></a-input>
          </div>
<!--          <div class="line">-->
<!--            解锁需要输入密码：<a-switch v-model:checked="settings.usePassword"></a-switch>-->
<!--          </div>-->
<!--          <div class="line" v-if="settings.usePassword">-->
<!--            锁屏密码：<a-input-password v-model:value="settings.password" style="width: 13em"></a-input-password>-->
<!--          </div>-->

        </div>
        </div>
  <div class="card auto-height s-bg" v-if="settings.enable"  style="display: inline-block;width: 25em;padding: 1em;text-align: left;margin-bottom: 2em">
    <div class="line-title">
      锁屏显示设置
    </div>
    <div class="line">
      显示时间：<a-switch v-model:checked="settings.showTime"></a-switch>
    </div>
    <div class="line">
      显示未读消息：<a-switch v-model:checked="settings.showUnreadMessage"></a-switch>
    </div>
    <div class="line">
      显示天气：<a-switch v-model:checked="settings.showWeather"></a-switch>
    </div>
    <div class="line">
      显示播放进度：<a-switch v-model:checked="settings.showProgress"></a-switch>
    </div>
  </div>
  <div class="card auto-height s-bg" v-if="settings.enable"  style="display: inline-block;width: 30em;padding: 1em;text-align: left">
    <div class="line-title">
      轮播设置
    </div>
    <div class="line">
      默认轮播模式：<a-radio-group v-model:value="settings.playType"><a-radio value="my">轮播我的收藏</a-radio>  <a-radio value="active">轮播激活壁纸</a-radio></a-radio-group>
    </div>
    <div class="line">
      切换图片时间间隔：   <a-input-number default-value="3" v-model:value="settings.interval"></a-input-number> 秒
    </div>

  </div>



  </vue-custom-scrollbar>
</template>

<script>
import { appStore } from '../../store'
import {mapWritableState,mapActions} from 'pinia'
import { paperStore } from '../../store/paper'

export default {
  name: 'Setting',
  computed:{
    ...mapWritableState(paperStore,['settings'])
  },
  data(){
    return {
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },

    }
  },
  mounted () {
    if(!this.settings){
      this.resetPapersSettings()
    }
  },
  methods:{
    ...mapActions(paperStore,['resetPapersSettings']),
    async showSaveDialog(){
      let savePath= await tsbApi.dialog.showOpenDialog({title:'选择目录',message:'请选择下载壁纸的目录',properties:[
        'openDirectory','createDirectory',
        ]})
      if(savePath){
        this.settings.savePath=savePath[0]
      }else{
        console.log('取消选择')
      }
    }
  },


}
</script>

<style scoped>

</style>
