<template>
  <vue-custom-scrollbar @contextmenu.stop="menuVisible = true" :settings="outerSettings"
    style="position:relative;height:calc(100vh - 14em);  ">
    <!-- 添加样式 -->
    <a-dropdown>
      <div @click="addIcons()"  class="app" style="height: 78px;">
      <div class="flex justify-center items-center w-full h-full" style="">
        <Icon class=" xt-text" icon="tianjia2" style="font-size: 30px;"></Icon>
      </div>
    </div>
    </a-dropdown>
    <a-dropdown @contextmenu.stop="() => { }" v-for="app in myApps" :trigger="['contextmenu']">
      <div @click="open(app)" class="app">

        <a-avatar :size="50" shape="square" :src="renderIcon(app.icon)"></a-avatar>
        <br>
        <div class="name text-more">
          {{ app.name }}
        </div>
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item @click="open(app)" key="open">
            打开
          </a-menu-item>
          <a-menu-item @click="deleteAnApp(app)" key="delete">删除</a-menu-item>
          <a-menu-item @click="showInFolder(app)" key="show">打开所在位置</a-menu-item>
        </a-menu>
      </template>

    </a-dropdown>


  </vue-custom-scrollbar>
  <a-drawer :height="250" v-model:visible="menuVisible" placement="bottom">
    <a-row style="margin-top: 1em" :gutter="[20, 20]">
      <a-col>
        <div @click="clear" class="btn">
          <Icon style="font-size: 3em" icon="shanchu"></Icon>
          <div><span>清空应用</span></div>
        </div>
      </a-col>
    </a-row>
  </a-drawer>
</template>

<script>
import { mapWritableState, mapActions, mapState } from 'pinia'
import { appStore } from '../store'
import { Modal } from 'ant-design-vue'
import { appsStore } from '../store/apps'
const { fs } = window.$models
import {renderIcon} from '../js/common/common'
export default {
  name: 'MyApps',
  data() {
    return {
      menuVisible: false,
      outerSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  computed: {
    ...mapWritableState(appsStore, ['qingApps']),
    ...mapWritableState(appsStore, ['myApps'])
  },
  methods: {
    ...mapActions(appsStore, ['deleteApp']),
    renderIcon,
    addIcons(){
      this.$emit("addIcons")
    },
    open(app) {
      // if(fs.lstatSync(app.path).isDirectory()){
      //   require('electron').shell.openPath(app.path.replaceAll('/','\\'))
      // }else{
      //   require('electron').shell.openPath(app.path)
      // }
      require('electron').shell.openPath(require('path').normalize(app.path))
    },
    deleteAnApp(app) {
      Modal.confirm({
        content: '是否删除应用快捷方式？此操作不会删除物理文件。',
        onOk: () => {

          this.deleteApp(app)

        }
      })
    },
    showInFolder(app) {
      require('electron').shell.showItemInFolder(app.path)
    },
    clear() {
      this.menuVisible = false
      Modal.confirm({
        centered: true,
        content: '清空全部应用快捷方式？此操作不可还原。',
        onOk: () => {
          this.myApps = []

        },
        okText: '清空'
      })
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
    background: var(--primary-bg);
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
  font-size: 1.2em;
}

.app-summary {
  font-size: 1.1em;
}
</style>
