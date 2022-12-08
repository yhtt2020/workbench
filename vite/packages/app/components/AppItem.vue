<template>
  <a-dropdown :trigger="['contextmenu']">
    <div style="margin-bottom: 15px;text-align: center;">
      <div style="margin-bottom: 10px">
        <a-badge :dot="app.is_new">
          <img onerror="this.src='../../icons/default.svg'" @click="executeApp(app)" shape="circle"
               class="logo clickable" :src="app.logo"
               :style="{'border-color':app.user_theme_color?app.user_theme_color:app.theme_color}">
        </a-badge>
      </div>
      <div class="clickable" @click="executeApp(app)" style="white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis; ">
        <span class="debug-tag" v-if="app.is_debug">调试</span> {{ app.name }}
      </div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item @click="openSetting(app.nanoid)" key="setting">
          <a-icon type="setting"></a-icon>
          设置
        </a-menu-item>
        <a-menu-item @click="uninstall(app.nanoid)" v-if="!app.isSystemApp" key="uninstall">
          <a-icon type="delete"></a-icon>
          卸载
        </a-menu-item>
      </a-menu>
    </template>

  </a-dropdown>
</template>

<script>
import {Modal} from 'ant-design-vue'
export default {
  name: 'AppItem',
  props:['app'],
  data () {

  },
  methods:{
    executeApp (app) {
      ipc.send('executeApp', { app: JSON.parse(JSON.stringify(app)) })
      //this.searchWords=''
      this.searchWords = ''
    },
    uninstall (appId) {
      let that = this
      Modal.confirm({
        title: '确定卸载此应用？',
        content: '此操作将卸载应用并清空所有应用数据，且无法还原。请谨慎操作。',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          appModel.uninstall(appId).then(success => {
            for (let i = 0; i < that.apps.length; i++) {
              if (that.apps[i].nanoid === appId) {
                that.apps.splice(i, 1)
              }
            }
            ipc.send('message', { type: 'success', config: { content: '卸载应用成功。' } })
            ipc.send('deleteApp', { nanoid: appId })
          }, err => {
            ipc.send('message', { type: 'success', config: { content: '卸载失败。' } })
          })
        },
        onCancel () {
          console.log('Cancel')
        },
      })
    },
    openSetting (appId) {
      ipc.send('saAppOpenSetting', { nanoid: appId })
    },

  }
}
</script>

<style scoped>
.logo {
  border-radius: 50%;

  width: 50px;
  height: 50px;
  padding: 2px;
  object-fit: cover;
}
.clickable {
  cursor: pointer;
}
.debug-tag {
  padding: 0 2px;
  background: #0bb20c;
  border-radius: 2px;
  line-height: 12px;
  height: 12px;
  color: white;
  font-size: 12px;
}
.processing {
   border: 3px solid blue;
 }
</style>
