<template>
  <!-- 导出模态框 -->
  <div class="fixed inset-0 home-blur xt-mask" style="z-index: 99999;" v-if="openModal" >
    <div
         class="fixed flex flex-col text-white -translate-x-1/2 -translate-y-1/2 rounded-lg xt-modal top-1/2 left-1/2"
         style=";width: 480px;height: 425px;background:  #282828">
      <div class="head-nav">
        <span class="ml-2" style="font-size: 16px;color: var(--primary-text);font-weight: 500;">导出桌面</span>
        <div @click="close" class="flex items-center justify-center rounded-lg h-11 w-11 xt-bg-2 pointer">
          <Icon icon="guanbi" style="color:var(--primary-text);font-size:24px"></Icon>
        </div>
      </div>
      <div class="px-8">
        <span class="title">选择导出桌面1：</span>
        <!-- -->
        <a-select
          :bordered="false"
          class="text-xs rounded-lg input"
          size="large"
          mode="multiple"
          :dropdownStyle="{ 'z-index': 9999999,backgroundColor: 'var(--secondary-bg)' }"
          :default-value="desk"
          style="width:416px;height:48px; border:none;"
          placeholder="请选择"
          @change="onChange"
        >
          <template #suffixIcon>
            <Icon icon="xiangyou" class="w-4 h-4" @click="delLabel(index)"></Icon>
          </template>
          <a-select-option v-for="(item,index) in deskType" :key="index" :value="index">{{ item }}</a-select-option>
        </a-select>
        <span class="title">桌面数据：</span>
        <div style="font-size: 14px;" class="mt-2 mb-4 xt-text-2">选择是否需要保留卡片的设置或数据，比如「便签」中的内容。</div>
        <RadioTab :navList="dataType" v-model:selectType="defaultType"></RadioTab>
        <div class="mt-2 title">桌面显示尺寸：{{displaySize.width}} * {{displaySize.height}}</div>

      </div>
      <div class="flex justify-center mt-4">
        <div style="width: 120px;height: 48px;"
          @click="close"
           class="flex items-center justify-center rounded-lg xt-text xt-bg-2 pointer">
        取消
        </div>
        <div style="width: 120px;height: 48px;background-color: var(--active-bg);"
            class="flex items-center justify-center ml-3 rounded-lg  pointer" @click="exportBtn">
          确定导出
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RadioTab from '../RadioTab.vue'
import {cardStore} from '../../store/card'
import { mapActions, mapWritableState } from 'pinia'
import { message } from 'ant-design-vue'
import { useFreeLayoutStore } from './freeLayout/store'
export default {
  name: "ExportDesk",
  components: {
    RadioTab
  },
  data() {
    return {
      selectFreeLayoutData:{},
      selectFreeLayoutState:{},
      selectDesk:[''],
      dataType: [
        {title: '保留数据', name: 'data'},
        {title: '不保留数据', name: 'notData'}
      ],
      defaultType: {title: '不保留数据', name: 'notData'},
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
    desks:{
      type:Array,
    },
    layoutSize:{ //传入此参数，则使用此参数作为桌面布局尺寸，否则则取系统级的
      type:Object,
      default:null
    }
  },
  computed: {
    ...mapWritableState(cardStore, ['settings','deskSize','countdownDay','currentDeskIndex']),
    ...mapWritableState(useFreeLayoutStore, ['freeLayoutState','freeLayoutData']),
    displaySize(){
      if(this.layoutSize){
        return this.layoutSize
      }else{
        return this.deskSize
      }
    }
  },
  methods: {
    close(){
      this.$emit('closeExport',false)
    },
    onChange(val){
      this.selectedDesk = []
      const deskSize=this.layoutSize||this.deskSize //取出布局尺寸
      let desks = JSON.parse(JSON.stringify(this.desks))
      desks.map((item,index) => {
        let settings = {}

        item.cards.forEach(card=>{
          //遍历处理原卡片
          //移除id
          delete(card._$muuri_id)
        })
        if(item.settings && item.settings.enableZoom){
          settings = item.settings
        }else{
          // settings = this.settings
          settings = {...this.settings,enableZoom:true}
        }
        item.deskHeight =deskSize.height //新版导出修正命名
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
          case 'AggregateSearch':
            item.customData.sortType = 'work'
            delete item.customData.sortList
            break;
          case 'myIcons':
            item.customData.iconList[0].backgroundColor = ''
            item.customData.iconList[0].backgroundIndex = 0
            item.customData.iconList[0].imgShape = 'square'
            item.customData.iconList[0].imgState = 'cover'
            item.customData.iconList[0].isBackground = false
            item.customData.iconList[0].isRadius = true
            item.customData.iconList[0].radius = 5
            item.customData.iconList[0].size = 'mini'
            break;
        }
      })
    },
    dataInit() {
      this.selectedDesk.forEach(item => {
        if (this.freeLayoutState[item.id]) {
          this.selectFreeLayoutData[item.id] = this.freeLayoutData[item.id]
          this.selectFreeLayoutState[item.id] = this.freeLayoutState[item.id]
        }
        if(this.defaultType.name === 'notData'){
          this.setData(item)
        }
      })
    },
    async exportBtn() {
      if (!this.selectedDesk.length) {
        message.error('您至少选择一个桌面。')
        return
      }
      this.dataInit()
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
      let obj = {
        desk: this.selectedDesk,
        freeLayoutData: this.selectFreeLayoutData,
        freeLayoutState: this.selectFreeLayoutState
      }
      return JSON.stringify(obj)
    },
  },
  mounted(){
  },
  watch: {
    openModal(val){
      if(val){
        this.selectedDesk = []
        this.deskType = this.desks.map(item => item.name)
        this.defaultType = {title: '不保留数据', icon: 'yuanquan', name: 'notData'}
        this.desks.map((item,index) => {
          if(item.nanoid === this.currentDeskIndex?.name){
            this.desk = [index]
            this.onChange([index])
          }
        })

        // if(desks[0].settings && desks[0].settings.enableZoom){
        //   settings = item.settings
        // }else{
        //   console.log(this.settings)
        //   settings = {...this.settings,enableZoom:true}
        // }
        // desks[0].settings = settings
        // this.selectedDesk.push(desks[0])
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
    margin: 12px 0 12px;
  }
  ::v-deep .ant-select-selector{
    height: 48px;
  }
</style>
