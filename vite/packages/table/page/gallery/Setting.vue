<template>
  <div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    锁屏设置

  </div>
  <div class="pointer" style="position: fixed;right: 2em;top: 2em">
    <div  @click="resetPapersSettings" style="display: inline-block;margin-right: 1em">
      <span><Icon style="font-size: 2em;vertical-align: top"
                  icon="shuaxin"></Icon></span><span  style="font-size:1.2em"> 重置全部设置</span>
    </div>
  </div>
      <div class="card" style="display: inline-block;width: 25em;padding: 1em;text-align: left;margin-right: 2em;margin-bottom: 2em">

        <div class="line-title">基础设置</div>
        <div class="line" v-if="!appData.papers.settings.enable">
          如果您的显示器为OLed面板，建议启用锁屏壁纸，且轮播不少于3张壁纸，以防止烧屏。
        </div>
        <div class="line">
          使用锁屏壁纸：<a-switch v-model:checked="appData.papers.settings.enable"></a-switch>
        </div>
        <div v-if="appData.papers.settings.enable">
          <div class="line">
            进入锁屏时间：   <a-input-number default-value="300" v-model:value="appData.papers.settings.lockTimeout"></a-input-number> 秒
          </div>
          <div class="line">
            壁纸保存位置：<a-input placeholder="请选择壁纸保存地址" @click="showSaveDialog" style="width: 15em" v-model:value="appData.papers.settings.savePath"></a-input>
          </div>
          <div class="line">
            解锁需要输入密码：<a-switch v-model:checked="appData.papers.settings.usePassword"></a-switch>
          </div>
          <div class="line" v-if="appData.papers.settings.usePassword">
            锁屏密码：<a-input-password v-model:value="appData.papers.settings.password" style="width: 13em"></a-input-password>
          </div>

        </div>
        </div>
  <div class="card" v-if="appData.papers.settings.enable"  style="display: inline-block;width: 25em;padding: 1em;text-align: left;margin-bottom: 2em">
    <div class="line-title">
      锁屏显示设置
    </div>
    <div class="line">
      显示时间：<a-switch v-model:checked="appData.papers.settings.showTime"></a-switch>
    </div>
    <div class="line">
      显示未读消息：<a-switch v-model:checked="appData.papers.settings.showUnreadMessage"></a-switch>
    </div>
    <div class="line">
      显示天气：<a-switch v-model:checked="appData.papers.settings.showWeather"></a-switch>
    </div>
    <div class="line">
      显示播放进度：<a-switch v-model:checked="appData.papers.settings.showProgress"></a-switch>
    </div>
  </div>
  <div class="card" v-if="appData.papers.settings.enable"  style="display: inline-block;width: 30em;padding: 1em;text-align: left">
    <div class="line-title">
      轮播设置
    </div>
    <div class="line">
      默认轮播模式：<a-radio-group v-model:value="appData.papers.settings.playType"><a-radio value="my">轮播我的收藏</a-radio>  <a-radio value="active">轮播激活壁纸</a-radio></a-radio-group>
    </div>
    <div class="line">
      切换图片时间间隔：   <a-input-number default-value="3" v-model:value="appData.papers.settings.interval"></a-input-number> 秒
    </div>

  </div>

</template>

<script>
import { appStore } from '../../store'
import {mapWritableState,mapActions} from 'pinia'

export default {
  name: 'Setting',
  computed:{
    ...mapWritableState(appStore,['appData'])
  },
  mounted () {
    if(!this.appData.papers.settings){
      this.appData.papers.settings={
        enable:true,
      }
    }
    appStore().$subscribe((mutation, state) => {
     this.saveAppData('papers')
     // localStorage.setItem('cart', JSON.stringify(state))
    })
  },
  methods:{
    ...mapActions(appStore,['resetPapersSettings','saveAppData']),
    async showSaveDialog(){
      let savePath= await tsbApi.dialog.showOpenDialog({title:'选择目录',message:'请选择下载壁纸的目录',properties:[
        'openDirectory','createDirectory',
        ]})
      if(savePath){
        this.appData.papers.settings.savePath=savePath[0]
        console.log(savePath)
      }else{
        console.log('取消选择')
      }
    }
  }
}
</script>

<style scoped>

</style>
