<template>
  <vue-custom-scrollbar :settings="outerSettings" style="position:relative;height:calc(100vh - 14em);  ">
    <a-dropdown v-for="app in appData.apps.myApps" :trigger="['contextmenu']">

      <div @click="open(app)" class="app" >
        <a-avatar :size="50" shape="square" :src="app.icon"></a-avatar>
        <br>
        <div class="name text-more">
          {{ app.name }}
        </div>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item  @click="open(app)" key="open">
            打开
          </a-menu-item>
          <a-menu-item @click="deleteAnApp(app)" key="delete">删除</a-menu-item>
          <a-menu-item @click="showInFolder(app)" key="show">打开所在位置</a-menu-item>
        </a-menu>
      </template>

    </a-dropdown>


  </vue-custom-scrollbar>
</template>

<script>
import { mapWritableState,mapActions } from 'pinia'
import { appStore } from '../store'
import { Modal } from 'ant-design-vue'

export default {
  name: 'MyApps',
  data(){
    return {
      outerSettings:{
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  computed: {
    ...mapWritableState(appStore, ['appData'])
  },
  methods:{
    ...mapActions(appStore,['deleteApp']),
    open (app) {
      require('electron').shell.openPath(app.path)
    },
    deleteAnApp(app){
      Modal.confirm({
        content:'是否删除应用快捷方式？此操作不会删除物理文件。',
        onOk:()=>{
          this.deleteApp(app)
        }
      })
    },
    showInFolder(app){
      require('electron').shell.showItemInFolder(app.path)
    }
  }
}
</script>

<style scoped lang="scss">

.app {
  display: inline-block;
  width: 5em;
  text-align: center;
  vertical-align: text-top;
  padding: 0.5em;
  margin: 0.5em;
  cursor: pointer;

  &:hover {
    background: #969696;
    border-radius: 4px;

  }

  .name {
    font-size: 0.8em;
    word-break: break-all;
  }
}

.app-name {
  font-size: 1.3em;
  font-weight: bold;
  padding-top: 0.2em;
  padding-bottom: 0.2em;

}

.btn {
  width: 6em;
  text-align: center;
  background: #575757;
  font-size: 1.2em;
}

.app-summary {
  font-size: 1.1em;
}
</style>
