<template>
  <a-dropdown :trigger="['contextmenu']">
    <div @click="executeApp(app)" class="app-item clickable" style="margin-bottom: 15px;text-align: center;">
      <div style="margin-bottom: 10px">
        <a-badge :dot="app.is_new">
          <img onerror="this.src='../../icons/default.svg'" shape="circle"
               class="logo clickable" :src="app.logo"
               :style="{'border-color':app.user_theme_color?app.user_theme_color:app.theme_color}">
        </a-badge>
      </div>
      <div   style="white-space:nowrap;
overflow:hidden;
text-overflow:ellipsis; ">
        <span class="debug-tag" v-if="app.is_debug">调试</span> <strong v-if="app.is_fav"  style="">{{ app.name }}</strong><span v-else>{{app.name}}</span>
      </div>
    </div>
    <template #overlay>
      <a-menu>
        <a-menu-item v-if="app.is_fav" @click="removeFav(app)" key="remove">
          <a-icon  type="setting"></a-icon>
          取消收藏
        </a-menu-item>
        <a-menu-item v-else  @click="addFav(app)" key="add">
          <a-icon type="setting"></a-icon>
          添加收藏
        </a-menu-item>
        <a-menu-item @click="openSetting(app.nanoid)" key="setting">
          <a-icon type="setting"></a-icon>
          设置
        </a-menu-item>
        <a-menu-item @click="uninstall(app)" v-if="!app.isSystemApp || app.is_debug" key="uninstall">
          <a-icon type="delete"></a-icon>
          卸载
        </a-menu-item>
      </a-menu>
    </template>

  </a-dropdown>
</template>

<script>
import { Modal,message } from 'ant-design-vue'
const appModel = window.$models.appModel
export default {
  name: 'AppItem',
  props: ['app'],
  data () {

  },
  methods: {
    executeApp (app) {
      console.log('启动app',{ app: JSON.parse(JSON.stringify(app)) })
      ipc.send('executeApp', { app: JSON.parse(JSON.stringify(app)) })
      //this.searchWords=''
      this.searchWords = ''
    },
    uninstall (app) {
      Modal.confirm({
        title: '确定卸载此应用？',
        content: '此操作将卸载应用并清空所有应用数据，且无法还原。请谨慎操作。',
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk:()=> {
          this.$emit('uninstall',app)
        },
        onCancel () {
          console.log('Cancel')
        },
      })
    },
    openSetting (appId) {
      ipc.send('saAppOpenSetting', { nanoid: appId })
    },
    async addFav (app) {
      await appModel.addFav(app.nanoid)
      app.is_fav = true
      this.$emit('favUpdated')
      message.success('成功添加到收藏列表')
    },
    async removeFav (app) {
      await appModel.removeFav(app.nanoid)
      this.$emit('favUpdated')
      app.is_fav = false
      message.success('成功从收藏列表中移除')
    }

  }
}
</script>

<style scoped lang="scss">
.app-item {
  padding: 10px;
  &:hover {
    box-shadow: 0 0 8px rgba(124, 124, 124, 0.35);
    background: rgba(128, 128, 128, 0.06);
    border-radius: 4px;
  }
}

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
