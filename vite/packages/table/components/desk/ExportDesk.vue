<template>
  <!-- 导出模态框 -->
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="openModal" >
    <div
         class="xt-modal fixed text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  rounded-lg flex flex-col"
         style=";width: 480px;height: 425px;background:  #282828">
      <div class="head-nav">
        <span class="ml-2" style="font-size: 16px;color: var(--primary-text);font-weight: 500;">导出桌面</span>
        <div @click="close" class="h-11 w-11 flex justify-center items-center xt-bg-2 rounded-lg pointer">
          <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
        </div>
      </div>
      <div class="px-8">
        <span class="title">选择桌面</span>
        <a-select
          :bordered="false"
          class="input rounded-lg  text-xs"
          size="large"
          mode="multiple"
          :dropdownStyle="{ 'z-index': 9999999,backgroundColor: 'var(--secondary-bg)' }"
          :default-value="desk"
          style="width:416px;height:48px; border:none;"
          placeholder="请选择"
          @change="onChange"
        >
          <template #suffixIcon>
            <Icon icon="xiangyou" class="h-4 w-4" @click="delLabel(index)"></Icon>
          </template>
          <a-select-option v-for="(item,index) in deskType" :key="index" :value="index">{{ item }}</a-select-option>
        </a-select>
        <span class="title">桌面数据</span>
        <div style="font-size: 14px;" class="xt-text-2 mt-2 mb-4">选择是否需要保留你在小组件自定义编辑的设置或数据，比如「倒数日小组件」中的事件数据。</div>
        <HorizonTalTab :navList="dataType" v-model:selectType="defaultType"></HorizonTalTab>
      </div>
      <div class="flex justify-center mt-6">
        <div style="width: 120px;height: 48px;"
          @click="close"
           class="flex justify-center items-center xt-text xt-bg-2 rounded-lg pointer">
        取消
        </div>
        <div style="width: 120px;height: 48px;"
            class=" ml-3 flex justify-center items-center bg-blue-500 rounded-lg pointer" @click="exportBtn">
          确定导出
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HorizonTalTab from '../HorizonTalTab.vue'
import {cardStore} from '../../store/card'
import { mapActions, mapWritableState } from 'pinia'
import { message } from 'ant-design-vue'
export default {
  name: "ExportDesk",
  components: {
    HorizonTalTab
  },
  data() {
    return {
      dataType: [
        {title: '保留数据', icon: 'yk_yuanquan_fill', name: 'data'},
        {title: '不保留数据', icon: 'yk_yuanquan', name: 'notData'}
      ],
      defaultType: {title: '不保留数据', icon: 'yuanquan', name: 'notData'},
      deskType: [],
      desk: [0],
      selectedDesk: []
    }  
  },
  props: {
    openModal: {
      type: Boolean,
      default: () => false
    },
  },
  computed: {
    ...mapWritableState(cardStore, ['desks','settings','deskSize','countdownDay']),
  },
  methods: {
    close(){
      this.$emit('closeExport',false)
    },
    onChange(val){
      this.selectedDesk = []
      let desks = JSON.parse(JSON.stringify(this.desks))
      desks.map((item,index) => {
        let settings = {}
        if(item.settings && item.settings.enableZoom){
          settings = item.settings
        }else{
          // settings = this.settings
          settings = {...this.settings,enableZoom:true}
        }
        item.cardsHeight = this.deskSize.cardsHeight
        item.settings = settings
        val.map((i) => {
          if(index === i){
            this.selectedDesk.push(item)
            // console.log(item)
          }
        })
      })
    },
    setData(cards){
      cards.cards.forEach((item,index) => {
        switch (item.name) {
          case 'notes':
            if(item.customData){
              item.customData.text = ''
            }
            break;
          case 'countdownDay':
            item.customData.notRetain = true
            break;
        }
      })
    },
    async exportBtn() {
      if (!this.selectedDesk.length) {
        message.error('您至少选择一个桌面。')
        return
      }
      this.selectedDesk.forEach(item => {
        if(this.defaultType.name === 'notData')this.setData(item)
      })
      let savePath = await tsbApi.dialog.showSaveDialog({
        title: '选择保存位置',
        defaultPath: '我的桌面分享.desk',
        message: '选择保存分享代码位置',
        filters: [{ name: 'desk存档', extensions: ['desk'] }],
        properties: [
          'createDirectory',
          'showOverwriteConfirmation'
        ]
      })
      const fs = require('fs')
      if (!savePath) {
        return
      }
      fs.writeFile(savePath, this.getShareJson(), (err) => {
        if (!err) {
          message.success('导出成功。为您的分享精神点赞！')
          require('electron').shell.showItemInFolder(savePath)
          this.close()
          return
        } else {
          message.error('导出失败，请确认文件权限。')
        }
      })
    },
    getShareJson() {
      return JSON.stringify(this.selectedDesk)
    },
  },
  watch: {
    openModal(val){
      if(val){
        this.selectedDesk = []
        this.deskType = this.desks.map(item => item.name)
        let desks = JSON.parse(JSON.stringify(this.desks))
        this.defaultType = {title: '不保留数据', icon: 'yuanquan', name: 'notData'},
        this.selectedDesk.push(desks[0])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .head-nav{
    width: 100%;
    height: 72px;
    padding: 12px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    >div{
      position: absolute;
      right: 12px;
    }
  }
  .title{
    font-size: 16px;
    color: var(--primary-text);
    font-weight: 500;
  }
  .input{
    width: 416px;
    height: 48px;
    background: var(--secondary-bg);
    border-radius: 12px;
    color: var(--primary-text);
    font-size: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    margin: 21px 0 24px;
  }
  ::v-deep .ant-select-selector{
    height: 48px;
  }
</style>
