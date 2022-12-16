<template>
  <h3>开发者模式
  <span style="float:right;font-size: 14px">当前状态 <span :style="{background:this.debugMod?'green':'red'}" style="display: inline-block;border-radius: 100%;width: 10px;height: 10px;" />&nbsp; </span>
  </h3>
  <div style="padding-bottom:  10px">
    进入开发者模式 <a-tooltip title="仅非系统应用可开启调试模式"><a-switch @change="switchToDevMod" :checked="debugMod" :disabled="app.isSystemApp && !allowSystemDebug"  /></a-tooltip>
    <router-link :to="{path:'/allDevapps'}"><a-button style="float: right">查看其他开发中的应用</a-button></router-link>
  </div>
   <a-alert style="margin-top: 10px" v-if="existsDevApp">
    <template #description>
      当前应用已绑定开发中的应用 「<strong>{{existsDevApp.name}}（ID：{{existsDevApp.nanoid}}）</strong>」，可开启进入对应开发应用。
    </template>
  </a-alert>
  <div style="padding: 10px;box-shadow: 0 0 3px #a4a4a4;border-radius: 4px;margin-top: 20px;background: white">

      <h4>什么是开发者模式？</h4>

      <p>如果此应用是您自己开发的应用，可以勾选此选项，启用后设置页面将切换到开发者模式，并载入此应用关联的开发中的应用，同时将为您解锁更多开发者工具，方便您开发和调试应用。</p>

      <h4>开发者模式有哪些额外的功能？</h4>

      <p>允许您为应用添加更多的设置，包括修改默认主题色、应用包名、应用标题、应用起始url
      允许您使用<span @dblclick="enableAllowSystemDebug">开发者工具</span>，包括导出应用配置文件，上架应用。</p>

  </div>
</template>

<script>
import { mapWritableState, mapActions } from 'pinia'
import { appStore } from '../../store'
import { CodeTwoTone } from '@ant-design/icons-vue'
import {Modal,message} from 'ant-design-vue'
const {devAppModel} = window.$models
export default {
  name: 'develop',
  data(){
    return {
      existsDevApp:false,
      allowSystemDebug:false,
    }
  },
  components: {
    CodeTwoTone
  },
  async mounted () {
    let devApp = await devAppModel.checkExistsByAppId(this.app.nanoid)
    if(devApp){
      this.existsDevApp=devApp
    }
  },
  computed: {
    ...mapWritableState(appStore, ['app', 'debugMod','devApp'])
  },
  methods: {
    enableAllowSystemDebug(){
      console.log('allowSystemDebug')
      this.allowSystemDebug=true
    },
    ...mapActions(appStore, ['toggleDebug','setDevApp']),
    async switchToDevMod () {
      if(!this.debugMod){
        let devApp = await devAppModel.checkExistsByAppId(this.app.nanoid)
        if (!devApp) {
          //todo 查询当前应用关联的开发应用，如果不存在，则询问是否要基于此应用创建一个开发应用
          Modal.confirm({
            content: '当前应用不存在关联的开发中的项目，是否需要基于此应用创建一个开发中的项目，从而启用开发者模式？',
            onOk: async () => {
              devApp=await devAppModel.createFromApp(this.app)
              if(devApp){
               this.setDevApp(devApp)
                this.$router.push({path:'/dev/'})
              }else{
                return message.error('创建项目失败。')
              }
            }
          })
        }else{
          this.$router.push({path:'/dev/'})
          this.setDevApp(devApp)//devApp是不和任何对象挂钩的，只有在保存的时候才会把对应的设置覆盖进去
        }
      }else{
        this.debugMod=false
      }

    }
  }
}
</script>

<style scoped>

</style>
