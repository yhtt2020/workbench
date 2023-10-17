<script lang="ts">
import {defineComponent} from 'vue'
import Search from "../../../components/Search.vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import NotShortcutKey from "../page/NotShortcutKey.vue";
import {PlusOutlined, EditOutlined} from '@ant-design/icons-vue'
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import {message, Modal} from "ant-design-vue";
import { Icon  } from "@iconify/vue";
export default {
  name: "schemeList",
  components: {VueCustomScrollbar, NotShortcutKey, XtButton, Search, PlusOutlined, EditOutlined,Icon},
  data() {
    return {
      loading: true,
      shortcutSchemeList: [],
      app:{},
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
      return this.selectedSchemes.length
    },
    selectedSchemes() {
      let selected=this.shortcutSchemeList.filter(s => {
        return s.selected
      })

      if(selected){
        return selected
      }else{
        return []
      }
    }
  },
  watch: {
    // currentApp: {  暂时不需要自动切换应用
    //   handler() {
    //     if (this.settings.enableAutoChange) {
    //       this.exeName = this.currentApp.exeName
    //       this.refreshList()
    //
    //     }
    //
    //   },
    //   deep: true
    // },
    $route: {
      handler() {
        this.reloadData()
      },
    }
  },
  mounted() {
    this.reloadData()
  },
  beforeRouteUpdate(to) {
    this.reloadData(to.params?.exeName)
  },
  methods: {
    ...mapActions(keyStore, ['setRecentlyUsedList', 'loadShortcutSchemes', 'import','removeScheme','getCustomApp']),
    async reloadData(exeName = this.$route.params?.exeName) {
      this.exeName = exeName
      this.app = await this.getCustomApp(exeName)
      console.log(this.app, '找到的应用')
      this.refreshList()
    },
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
    async importSchemes() {
      let openPath = await tsbApi.dialog.showOpenDialog({
        title: '选择导入的文件',
        message: '选择导入的文件',
        filters: [{name: '快捷键方案存档', extensions: ['keys']}],
        properties: [
          'openFile',
          'createDirectory',
          'showOverwriteConfirmation',
          'multiSelections'
        ]
      })
      if(!openPath){
        return
      }
      console.log(openPath)
      for (const path of openPath) {
        try {
          console.log(path)
          let schemes = JSON.parse(require('fs').readFileSync(path, 'utf-8'))
          let inserted = await this.import(schemes)
          message.success('成功导入' + inserted.length + '个方案')
          await this.refreshList()
          console.log(schemes)
        } catch (e) {
          console.error(e)
        }


      }

      this.selecting=false

    },
    remove() {
      if(this.selectedCount===0){
        message.info('至少选择1个方案。')
        return
      }
      Modal.confirm({
        centered:true,
        content:'确认删除这'+this.selectedCount+"个方案？此操作不可撤销。",
        okText:'确认删除',
        onOk:()=>{
          this.selectedSchemes.forEach(async scheme=>{
            await this.removeScheme(scheme)
          })
          this.refreshList()
          message.success('删除成功')
        }
      })

    },
    edit() {
      this.selecting = true
    },
    async doExport() {
      let selectedSchemes = this.shortcutSchemeList.filter(item => {
        return item.selected
      })
      if (selectedSchemes.length === 0) {
        message.info('至少选择1个方案。')
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
    },
    add(){
      this.$router.push({
        name:'editScheme'
      })
    },
    getIcon(item){
      if(item.icon){
        return item.icon
      }else{
        return item.software?.icon
      }
    }
  }
}
</script>

<template>
  <!-- 有内容 -->

  <div class=" flex flex-col rounded-lg w-full px-2 h-full">
    <div class=" m-2  my-1 flex">
      <div v-if="!exeName" class="flex-1">
        <h2 class="xt-text">方案列表</h2>
        <p class="xt-text-2"><span v-if="selecting">已选中 <strong class="xt-active-text">{{ selectedCount }}</strong> 个方案， </span>
          共 {{ shortcutSchemeList.length }} 个方案</p>
      </div>
      <div v-else="false" class="  rounded-md px-2 p-2  " :span="12" style="flex: 1">
        <div class="flex flex-row">
          <div hidden="">{{ app.lastFocus }}</div>
          <div class="    truncate">
            <a-avatar :size="48" shape="square" :src="app.icon"></a-avatar>

            <div v-if="!currentApp.inRep" class="mt-2">
              <xt-button type="theme" size="mini" style="width:100%" :h="36">登记入库</xt-button>
            </div>
          </div>
          <div class="ml-4">
            <div class="font-16 font-bold">
              <a-tooltip :title="app.path">
                {{ app.alias }}
              </a-tooltip>

              <EditOutlined class="pointer ml-2 xt-text-2" @click="goEdit(app)"/>
            </div>
            <!--            <span class="" style="font-size: 16px;color: var(&#45;&#45;secondary-text);">共 {{-->
            <!--                shortcutSchemeList.length-->
            <!--              }} 个方案</span>-->
          </div>
        </div>
      </div>
      <div>
        <div class="btn-item mt-3">

          <!--          <div v-if="!selecting" class="pointer" @click="market">创意市场</div>-->

          <!--          <span class="button-active pointer" @click="setShow = true">-->
          <!--                <Icon icon="setting" style="width: 20px;height: 20px;color:var(&#45;&#45;primary-text);"></Icon>-->
          <!--            </span>-->
          <xt-button @click="createScheme">
            <Icon class="icon" icon="akar-icons:edit"> </Icon> 创建
          </xt-button>
          <template v-if="selecting">
            <xt-button v-if="selecting" @click="importSchemes">
              <Icon class="icon" icon="akar-icons:download"> </Icon> 导入
            </xt-button>
            <xt-button type="theme" v-if="selecting" @click="doExport">
              <Icon class="icon" icon="akar-icons:share-box"> </Icon> 导出
            </xt-button>
            <xt-button type="error" v-if="selecting" @click="remove">
              <Icon class="icon" icon="akar-icons:trash-can"> </Icon>  删除
            </xt-button>
            <xt-button class="ml-10" v-if="selecting" @click="cancelExport">
             <Icon class="icon" icon="akar-icons:x-small"> </Icon>  退出
            </xt-button>
          </template>

          <template v-if="!selecting">

            <xt-button  @click="edit">
              <Icon class="icon" icon="akar-icons:chevron-left"> </Icon> 管理
            </xt-button>

          </template>

        </div>
      </div>
    </div>
    <div class="flex flex-1 justify-between px-4 h-0">

      <vue-custom-scrollbar :settings="settings" class="h-full w-full ">
        <div v-if="shortcutSchemeList.length===0 && loading===false " class="w-full"
             style="flex:1;justify-items: center;justify-content: center">
          <NotShortcutKey @createScheme="createScheme"></NotShortcutKey>
        </div>
        <div v-else class="scheme-container  "
             style="flex:1">
          <div :class="{selectable:selecting,selected:item.selected}" v-for="item in shortcutSchemeList"
               class="scheme-item     items-center pointer xt-bg-2" @click="btnDetail(item)">
            <div class="mx-4 h-full w-14 flex justify-center items-center cover">
                <a-avatar shape="square" :src="getIcon(item)" :size="48"></a-avatar>
            </div>
            <div class="description px-2  truncate">
              <div class="xt-text truncate " style="max-width: 180px" :title="item.name"> {{ item.name }} </div>
              <div class="mt-1 xt-text-2 truncate">{{item.exeName}}</div>
            </div>


            <div class="flex flex-col justify-center items-center key-num">
              <span class="num-youshe">{{ item.number }}</span>
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
.icon{
  font-size: 24px;
  vertical-align: middle;
}
</style>
