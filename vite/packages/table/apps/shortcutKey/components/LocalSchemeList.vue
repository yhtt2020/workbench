<script lang="ts">
import {defineComponent} from 'vue'
import Search from "../../../components/Search.vue";
import XtButton from "../../../ui/libs/Button/index.vue";
import {mapActions, mapWritableState} from "pinia";
import {keyStore} from "../store";
import {PlusOutlined, EditOutlined} from '@ant-design/icons-vue'
import VueCustomScrollbar from "../../../../../src/components/vue-scrollbar.vue";
import {message, Modal} from "ant-design-vue";
import {Icon} from "@iconify/vue";
import Preview from "./Preview.vue";

export default {
  name: "localSchemeList",
  components: {Preview, VueCustomScrollbar, XtButton, Search, PlusOutlined, EditOutlined, Icon},
  props: ['schemes','keywords'],
  data() {
    return {
      loading: true,
      shortcutSchemeList: [],
      selectedSchemeIds:[],//选中的schemes
      app: {},
      exeName: '',
      selecting: false,//选择
      previewVisible:false,
      previewKeys:{},
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
    list(){
      if(!this.keywords){
        return this.schemes
      }else{
        var regExp = new RegExp(this.keywords, 'i')
        return this.schemes.filter(item => {
          let match=false
          if (item.name) {
            match=match|| item.name.match(regExp)
          }
          if(item.commonUse){
            match=match || item.commonUse.match(regExp)
          }
          if(item.exeName){
            match=match || item.exeName.match(regExp)
          }
          return match
        })
      }
    },
    selectedCount() {
      return  this.selectedSchemes.length
    },
    selectedSchemes() {
      let selected = this.schemes.filter(s => {
        return this.isSelected(s.id)
      })

      if (selected) {
        return selected
      } else {
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
  },
  mounted() {
  },
  methods: {
    ...mapActions(keyStore, ['setRecentlyUsedList', 'loadShortcutSchemes', 'import', 'removeScheme', 'getCustomApp']),
    btnDetail(item) {
      if (this.selecting) {
        //执行选中事件
        if(!this.selectedSchemeIds.includes(item.id)){
          this.selectedSchemeIds.push(item.id)
        }else{
          this.selectedSchemeIds.splice(this.selectedSchemeIds.indexOf(item.id),1)
        }
        return
      }else{
        console.log(item)
        this.previewKeys=item
        this.previewVisible=true
      }

    },
    cancelExport() {
     this.selectedSchemeIds=[]
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
     let downloadSchemes=this.schemes.filter(item=>{
       return this.selectedSchemeIds.includes(item.id)
     })
      if(downloadSchemes.length===0){
        message.info('至少选择1个方案')
        return
      }else{

      }
      try {
        let inserted = await this.import(downloadSchemes)
        message.success('成功导入' + inserted.length + '个方案')
        this.selectedSchemeIds=[]
      } catch (e) {
        console.error(e)
      }
      this.selecting = false

    },
    closePreview(){
      this.previewVisible=false
    },
    remove() {
      if (this.selectedCount === 0) {
        message.info('至少选择1个方案。')
        return
      }
      Modal.confirm({
        centered: true,
        content: '确认删除这' + this.selectedCount + "个方案？此操作不可撤销。",
        okText: '确认删除',
        onOk: () => {
          this.selectedSchemes.forEach(async scheme => {
            await this.removeScheme(scheme)
          })
          this.refreshList()
          message.success('删除成功')
        }
      })

    },
    edit() {
      this.selecting = true
      this.selectedSchemeIds=[]
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
    add() {
      this.$router.push({
        name: 'editScheme'
      })
    },
    isSelected(id){
      return this.selectedSchemeIds.includes(id)
    }
  }
}
</script>

<template>
  <!-- 有内容 -->

  <div class=" flex flex-col rounded-lg w-full px-2 h-full">
    <div class=" m-2  my-1 flex">
      <div v-if="!exeName" class="flex-1">
        <p class="xt-text-2"><span v-if="selecting">已选中 <strong class="xt-active-text">{{ selectedCount }}</strong> 个方案， </span>
          共 {{ list.length }} 个方案</p>
      </div>
      <div>
        <div class="btn-item mt-3">

          <!--          <div v-if="!selecting" class="pointer" @click="market">创意市场</div>-->

          <!--          <span class="button-active pointer" @click="setShow = true">-->
          <!--                <Icon icon="setting" style="width: 20px;height: 20px;color:var(&#45;&#45;primary-text);"></Icon>-->
          <!--            </span>-->
<!--          <xt-button @click="createScheme">-->
<!--            <Icon class="icon" icon="akar-icons:edit"></Icon>-->
<!--            创建-->
<!--          </xt-button>-->
          <template v-if="selecting">
            <xt-button type="theme" v-if="selecting" @click="importSchemes">
              <Icon class="icon" icon="akar-icons:download"></Icon>
              确认下载
            </xt-button>
<!--            <xt-button type="theme" v-if="selecting" @click="doExport">-->
<!--              <Icon class="icon" icon="akar-icons:share-box"></Icon>-->
<!--              导出-->
<!--            </xt-button>-->
<!--            <xt-button type="error" v-if="selecting" @click="remove">-->
<!--              <Icon class="icon" icon="akar-icons:trash-can"></Icon>-->
<!--              删除-->
<!--            </xt-button>-->
            <xt-button class="ml-10" v-if="selecting" @click="cancelExport">
              <Icon class="icon" icon="akar-icons:x-small"></Icon>
              退出
            </xt-button>
          </template>

          <template v-if="!selecting">

            <xt-button @click="edit">
              <Icon class="icon" icon="akar-icons:chevron-left"></Icon>
              批量下载
            </xt-button>

          </template>

        </div>
      </div>
    </div>
    <div class="flex flex-1 justify-between px-4 h-0">

      <vue-custom-scrollbar :settings="settings" class="h-full w-full">
        <div v-if="list.length===0 && loading===false"
             style="flex:1;justify-items: center;justify-content: center">
        </div>
        <div v-else class="main-part item-content"
             style="flex:1">
          <div :class="{selectable:selecting,selected:isSelected(item.id)}" v-for="item in list"
               class="flex items-center pointer" @click="btnDetail(item)">
            <span class="mx-4 h-14 w-14 flex justify-center items-center">
                <a-avatar shape="square" :src="item.icon" :size="48"></a-avatar>
            </span>
            <span class="xt-text truncate" style="max-width: 180px" :title="item.name"> {{ item.name }}
              <div class="xt-text-2">{{item.exeName}}</div></span>

            <div class="flex flex-col justify-center items-center">
              <span>{{ item.number }}</span>
              <span class="xt-text-2" style="font-size: 14px;">快捷键</span>
            </div>
          </div>
          <div v-if="list.length > 2" style="opacity:0;height: 1px;"></div>
          <div v-if="list.length > 2" style="opacity:0;height: 1px;"></div>
        </div>

      </vue-custom-scrollbar>

      <!-- 预览 -->
      <Preview :keyScheme="previewKeys" :showModal="previewVisible" @closePreview="closePreview"></Preview>
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

.icon {
  font-size: 24px;
  vertical-align: middle;
}
</style>
