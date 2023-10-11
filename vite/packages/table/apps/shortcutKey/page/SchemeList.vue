<script lang="ts">
import {defineComponent} from 'vue'
import Search from "../../../components/Search.vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import NotShortcutKey from "./NotShortcutKey.vue";
import {PlusOutlined, EditOutlined} from '@ant-design/icons-vue'
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import {message} from "ant-design-vue";
import fs from "fs";

export default {
  name: "schemeList",
  components: {VueCustomScrollbar, NotShortcutKey, XtButton, Search, PlusOutlined, EditOutlined},
  data() {
    return {
      loading: true,
      shortcutSchemeList: [],
      exeName: '',
      selecting: false,//选择
      settings: {
        default: {
          useBothWheelAxes: true,
          swipeEasing: true,
          suppressScrollY: false,
          suppressScrollX: true,
          wheelPropagation: true
        }
      },
    }
  },
  computed: {
    ...mapWritableState(keyStore, ['shortcutKeyList', 'schemeList', 'currentApp', 'settings']),
    selectedCount() {
      let count = 0
      this.shortcutSchemeList.forEach(item => {
        if (item.selected) {
          count++
        }
      })
      return count
    }
  },
  watch: {
    currentApp: {
      handler() {
        if (this.settings.enableAutoChange) {
          this.exeName = this.currentApp.exeName
          this.refreshList()

        }

      },
      deep: true
    }
  },
  mounted() {
    this.exeName = this.$route.params.exeName
    this.refreshList()
  },
  beforeRouteUpdate(to) {
    this.exeName = to.params.exeName
    this.refreshList()
  },
  methods: {
    ...mapActions(keyStore, ['setRecentlyUsedList', 'loadShortcutSchemes']),
    async refreshList() {

      this.shortcutSchemeList = await this.loadShortcutSchemes(this.exeName)
      if (this.settings.enableAutoEnter && this.shortcutSchemeList.length > 0) {
        this.btnDetail(this.shortcutSchemeList[0])
      }
      this.loading = false
    },
    createScheme() {
      this.$router.push({
        name: 'shareKey', params: {
          exeName: this.exeName
        }
      })
    },
    btnDetail(item) {
      if (this.selecting) {
        //执行选中事件
        item.selected = !item.selected
        return
      }
      this.setRecentlyUsedList(item)
      this.$router.push({
        name: 'schemeDetail'
      })
    },
    cancelExport() {
      this.shortcutSchemeList.forEach(item => {
        item.selected = false
      })
      this.selecting = false
    },
    goEdit(app) {
      this.$router.push({
        name: 'editApp',
        params: {
          exeName: app.exeName
        }
      })
    },
    exportSchemes() {
      this.selecting = true
      message.info('请点击选择方案导出')
    },
    async doExport() {
      let selectedSchemes = this.shortcutSchemeList.filter(item => {
        return item.selected
      })
      if(selectedSchemes.length===0){
        message.error('至少选择1个方案。')
        return
      }

      let savePath = await tsbApi.dialog.showSaveDialog({
        title: '选择保存位置',
        defaultPath: '导出的' + selectedSchemes.length + '个快捷键方案.keys',
        message: '选择保存快解决方案位置',
        filters: [{name: '快捷键方案存档', extensions: ['keys']}],
        properties: [
          'createDirectory',
          'showOverwriteConfirmation'
        ]
      })
      const fs = require('fs')
      if (!savePath) {
        return
      }
      let json = JSON.stringify(selectedSchemes)
      fs.writeFile(savePath, json, (err) => {
        if (!err) {
          message.success('导出成功。')
          require('electron').shell.showItemInFolder(savePath)
          this.cancelExport()
          this.close()
          return
        } else {
          message.error('导出失败，请确认文件权限。')
        }
      })
    }
  }
}
</script>

<template>
  <!-- 有内容 -->

  <div class=" flex flex-col rounded-lg w-full px-2 h-full">
    <div class=" m-2  my-1 flex">
      <div v-if="!exeName" class="flex-1">
        <h2>方案列表</h2>
        <p class="xt-text-2"><span v-if="selecting">已选中 <strong class="xt-active-text">{{ selectedCount }}</strong> 个方案， </span>
          当前共有 {{ shortcutSchemeList.length }} 个快捷键方案</p>
      </div>
      <div v-else="false" class="  rounded-md px-2 p-2  " :span="12" style="flex: 1">
        <div class="flex flex-row">
          <div hidden="">
            - {{ currentApp.pid }} - {{ currentApp.title }}
          </div>

          <div hidden="">{{ currentApp.lastFocus }}</div>
          <div class="    truncate">
            <a-avatar :size="48" shape="square" :src="currentApp.software.icon"></a-avatar>

            <div v-if="!currentApp.inRep" class="mt-2">
              <xt-button type="theme" size="mini" style="width:100%" :h="36">登记入库</xt-button>
            </div>
          </div>
          <div class="ml-4">
            <div class="font-16 font-bold">
              {{ currentApp.software.alias }}
              <EditOutlined class="pointer" @click="goEdit(currentApp)"/>
            </div>
            <span class="" style="font-size: 16px;color: var(--secondary-text);">共{{
                shortcutSchemeList.length
              }}个应用快捷键方案</span>
            <div class="xt-text-2">
              {{ currentApp.path }}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="btn-item mt-3">
          <div v-if="exeName" class="pointer" @click="createScheme">
            <plus-outlined/>
            创建方案
          </div>
<!--          <div v-if="!selecting" class="pointer" @click="market">创意市场</div>-->

          <!--          <span class="button-active pointer" @click="setShow = true">-->
          <!--                <Icon icon="setting" style="width: 20px;height: 20px;color:var(&#45;&#45;primary-text);"></Icon>-->
          <!--            </span>-->
          <xt-button v-if="!selecting" @click="exportSchemes">
            导出方案
          </xt-button>
          <xt-button type="theme" v-if="selecting" @click="doExport">
            确认导出
          </xt-button>
          <xt-button v-if="selecting" @click="cancelExport">
            取消
          </xt-button>
        </div>
      </div>
    </div>
    <div class="flex flex-1 justify-between px-4 h-0">

      <vue-custom-scrollbar :settings="settings" class="h-full w-full">
        <div v-if="shortcutSchemeList.length===0 && loading===false"
             style="flex:1;justify-items: center;justify-content: center">
          <NotShortcutKey @createScheme="createScheme"></NotShortcutKey>
        </div>
        <div v-else class="main-part item-content"
             style="flex:1">
          <div :class="{selectable:selecting,selected:item.selected}" v-for="item in shortcutSchemeList"
               class="flex items-center pointer" @click="btnDetail(item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
            <span class="xt-text">{{ item.name }}</span>
            <div class="flex flex-col justify-center items-center">
              <span>{{ item.number }}</span>
              <span class="xt-text-2" style="font-size: 14px;">快捷键</span>
            </div>
          </div>
          <div v-if="shortcutSchemeList.length > 2" style="opacity:0;height: 1px;"></div>
          <div v-if="shortcutSchemeList.length > 2" style="opacity:0;height: 1px;"></div>
        </div>

      </vue-custom-scrollbar>


    </div>


    <!-- 无内容 -->

  </div>

</template>

<style scoped lang="scss">
.selectable {
}

.selected {
  border: 1px solid var(--active-bg);
}
</style>
