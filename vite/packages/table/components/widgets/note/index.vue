<template>
  <Widget
    :customData="customData"
    :size="reSize"
    :customIndex="customIndex"
    :options="{...this.options,background:this.customData.background,title:this.customData.title}"
    :menuList="menuList"
    ref="homelSlotRef"
    :desk="desk"
    style="background: #191919; !important"
  >
    <template #left-title-icon>
      <!-- 图标 -->
      <div class="icon flex justify-center align-center"
           style="width: 35px;height: 24px;position: absolute;left: 3px;top:16px;color:#fff">
        <Icon :icon="icons.notepad12Regular" width="20" height="20" />
      </div>
    </template>
    <template #msg>
      <teleport to="body">
        <xt-msg title="确定删除小组件" text="默认仅删除小组件，便签数据不会删除。"  :modelValue="modelValue" @no="no" @ok="ok">
          <template #checkbox>
            <div class="font-14" style="color: var(--secondary-text) !important;">
              <a-checkbox v-model:checked="isRemove">同时删除便签数据</a-checkbox>
            </div>
          </template>
        </xt-msg>
      </teleport>
    </template>
    <!-- 窗口化 -->
    <!-- <template #right-menu>
      <div class="pointer" v-if="options.isCopy" style="position: absolute; left:-28px;top:2px;" @click="options.copyContent">
          <Icon width="20" height="20" icon="fluent:window-multiple-16-filled" />
        </div>
    </template> -->

    <template #title-text>
      <a-input
        style="
        border: none;
        box-shadow: none !important;
        position: relative;
        left: -15px;
        top: 1px;
        font-size: 16px;
        padding: 0;
      "
        maxlength="15"
        v-model:value="this.tmpTitle"
        spellcheck="false"
        @blur="changeNoteTitle"
      ></a-input>
    </template>
    <!-- <cardDrag ref="drag" @reSizeInit="reSizeInit"> </cardDrag> -->
    <cardDrag ref="drag" @reSizeInit="reSizeInit">
      <template #="{ row }">
        <Markdown ref="mdEditor" :customData="customData" :customIndex="customIndex" :desk="desk"></Markdown>
      </template>
    </cardDrag>
  </Widget>
  <!-- <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">设置</div>
    </template>

    <XtRadio @onChange="__updateSize" :data="customData.dragCardSize"></XtRadio>
    <div class="text-base" style="margin: 12px 0">背景色</div>
    <div class="item-box">
      <div
        class="item"
        :key="item"
        :style="{ background: color[`${'color' + item}`] }"
        v-for="item in 6"
        @click="updateBackground(color[`${'color' + item}`])"
      ></div>
    </div>
  </a-drawer> -->
  <teleport to="body">

    <!-- 新设置 -->
    <Modal v-if="settingVisible" v-model:visible="settingVisible" :blurFlag="true" :mask-no-close="false">
      <div style="width:500px;height:466px;">
        <div class="p-4 font-16" style="height:64px;line-height: 32px;text-align: center;color: var(--primary-text);">
          「桌面便签」设置
          <div class="flex justify-center items-center rounded-lg pointer" style="width:32px;height:32px;background-color: var(--secondary-bg);float: right;" @click="closeSetting">
            <Icon icon="fluent:dismiss-16-filled" />
          </div>
        </div>
        <!--  -->
          <div class="w-full" style="padding:0 24px 24px 24px;height:400px;">
            <div class="w-full h-full rounded-lg p-4" style="background-color: var(--secondary-bg);">
              <div style="color:var(--primary-text);font-size: 16px;">小组件尺寸</div>

              <!-- <xt-tab v-model="cardSize" :list="sizeType1" class="xt-bg-2 p-1 h-12 mb-3"  @click="__updateSize" :data="customData.dragCardSize"/> -->

              <!-- <RadioTab  :navList="sizeType"  class="nav-type"
                        v-model:selectType="cardSize"  @click="test" ></RadioTab> -->

              <XtRadio class="mt-3 mb-3" @onChange="__updateSize" :data="customData.dragCardSize"></XtRadio>

              <div style="color: var(--secondary-text);">支持选择上述推荐尺寸，或按住小组件右下角拖拽图标，自定义大小尺寸。</div>
              <a-divider style="height: 1px; background-color: var(--divider-text); margin: 16px 0; " />
              <div style="color:var(--primary-text);font-size: 16px;">便签主题色</div>
              <div>
                <div class="item-box mt-4">
                  <div
                    class="item mr-4 flex justify-center items-center"
                    :key="item"
                    :style="{ background: color[`${'color' + item}`] }"
                    v-for="item,index in 6"
                    @click="updateBackground(color[`${'color' + item}`],item)"
                  >
                  <Icon v-show="colorIndex == item" icon="ri:checkbox-circle-fill" width="20" height="20" />
                  </div>
                </div>
              </div>
              <a-divider style="height: 1px; background-color: var(--divider-text); margin: 16px 0; " />
              <div class="flex" style="justify-content: space-between;" >
                <div style="color:var(--primary-text);font-size: 16px;">仅在标题处显示主题色</div>
                <a-switch @click="this.changeShowColor"  v-model:checked="options.showColor"></a-switch>
              </div>
              <div style="color: var(--secondary-text);">开启后小组件背景使用默认的编辑器颜色，标题部分使用上方选择的主题色。</div>
            </div>
          </div>
      </div>
    </Modal>
    <!-- 打印 -->
    <Modal v-if="printPreviewVisible" v-model:visible="printPreviewVisible" :blurFlag="true" :mask-no-close="false">
      <div class="px-6" style="width:500px;height:500px;">
        <div class="font-16 pt-4" style="height:64px;line-height: 32px;text-align: center;color: var(--primary-text);">
          <!-- <div class="w-full">打印</div> -->
          打印
          <div class="flex justify-center items-center rounded-lg pointer" style="width:32px;height:32px;background-color: var(--secondary-bg);float: right;" @click="printPreviewVisible = false">
            <Icon icon="fluent:dismiss-16-filled" />
          </div>
        </div>
        <!-- 打印机就绪 -->
        <div class="" v-if="print.status">
          <div class="p-3 rounded-lg mb-4" style="background:var(--secondary-bg)">设备要求：德佟P1；纸张：40*60，间隙纸</div>
          <a-select
              style="z-index: 99999999; position: relative;border:none"
              v-model:value="selectedPrinter"
              class="no-drag w-full rounded-xl printers"
              size="large"
              @change="handleChangePrinter"
              :dropdownStyle="{
              'z-index': 999999999999,
              backgroundColor: 'var(--secondary-bg)',
            }"
            >
              <a-select-option class="no-drag" v-for="item in print.printers" :value="item.name"
              >{{ item.name }}
              </a-select-option>
            </a-select>
          <div class="text-center" >
            <!-- 打印预览 -->
            <div ref="previewText" class="rounded-lg mt-3  mb-3 "
                  style="display:inline-block;background:white;color:black;width:160px;height:240px;font-size:12px;overflow: hidden">
              <div ref="printContent" hidden v-html="print.previewHtml"></div>
              <div ref="preivew" class="item-content "></div>
            </div>
          </div>
          <div class="flex justify-end">
            <xt-button type="primary" class="mt-2 font-16 xt-text"
                style="width: 64px; height: 40px; background-color: var(--secondary-bg); "
                @click="printPreviewVisible = false">取消</xt-button>
            <xt-button type="primary" class="mt-2 font-16 xt-text ml-3"
                style="width: 64px; height: 40px; background-color: var(--active-bg);"
                @click="printing">确定</xt-button>
          </div>
        </div>
        <!-- 打印机未就绪 -->
        <div v-else class="p-6">
          <div class="flex justify-center" style="margin-top:42px;">
            <Icon icon="fluent-emoji:printer" width="56px" height="56px" />
          </div>
          <div class="font-14 text-center w-full mt-4" style="color:var(--secondary-text)">驱动未就绪，未检测到可用打印机</div>
          <div class="p-3 rounded-lg mt-4" style="background:var(--secondary-bg)">仅支持德佟标签打印机，推荐使用「德佟 P1 标签打印机」</div>
          <div class="flex p-3 items-center mt-4 rounded-lg" style="background:var(--secondary-bg)">
            <a-image src="https://a.apps.vip/element/p1cover.jpg" style="width: 45px;border-radius: 6px" />
            <div class="flex ml-3" style="flex-direction:column;width:216px;">
              <div>德佟 P1 标签打印机</div>
              <div>纸张：40*60mm</div>
            </div>
            <Modal teleport="body" v-model:visible="showBuy" v-if="showBuy">
              <a-image style="border-radius: 8px" src="https://a.apps.vip/element/p1qrcode.jpg"></a-image>
            </Modal>
            <xt-button style="border-radius:8px;" type="theme" :w="84" :h="32"  @click="showBuy=true"  >扫码购买</xt-button>
          </div>
          <div class="flex p-3 items-center mt-4 rounded-lg" style="background:var(--secondary-bg)">
            <div
            class="flex justify-center items-center rounded-lg"
            style="width:48px;height:48px;background-color: var(--primary-bg);">
              <Icon icon="tabler:brand-bilibili" width="20" height="20" />
            </div>
            <div class="flex ml-3" style="flex-direction:column;width:216px;">
              <div>想天工作台「德佟 P1 标签打印机」使用教程</div>
            </div>
            <xt-button style="border-radius:8px;" type="theme" :w="84" :h="32">观看视频</xt-button>
          </div>

        </div>


      </div>

    </Modal>
  </teleport>

</template>

<script>
import Widget from '../../card/Widget.vue'
import cardSizeHook from '../../card/hooks/cardSizeHook'
import cardDrag from '../../card/hooks/cardDrag.vue'
import cardDragHook from '../../card/hooks/cardDragHook'
import { message } from 'ant-design-vue'
import { Icon } from '@iconify/vue'
import notepad12Regular from '@iconify-icons/fluent/notepad-12-regular'
import Markdown from './markdown.vue'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { noteStore } from '../../../apps/note/store'
import Modal from '../../Modal.vue'
import { DTPWeb, LPA_JobNames } from 'dtpweb'
import RadioTab from "../../../components/RadioTab.vue"

import { validateDrive, startPrint, doPreview, doJob  } from '../../card/hooks/print'

const labelWidth = 40
const labelHeight = 60
const fontHeight = 3
export default {
  name: '便签',
  components: {
    Modal,
    Widget,
    Icon,
    cardDrag,
    Markdown,
    RadioTab,
  },
  mixins: [cardDragHook, cardSizeHook],
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk: {
      type: Object,
    },
    editing: {
      type: Boolean,
    },
  },
  directives: {
    // reSize,
  },
  computed: {
    ...mapWritableState(noteStore, ['selNoteText', 'initFlag']),
  },
  data () {
    return {
      showBuy:false,
      modelValue:false,
      // 是否删除数据
      isRemove:false,
      selectedPrinter: '',
      print: {
        // 打印机状态
        status: false,
        // 当前选中打印机
        printer: {},
        // 可用打印机列表
        printers: []//所有打印机
      },
      printPreviewVisible: false,
      fontColors: ['white', 'black', 'red', 'green', 'blue'],
      fontColor: 'white',
      tmpTitle: '桌面标签',
      printSetting:{

      },
      options: {
        className: 'card',
        title: '桌面便签',
        icon: '',
        // 用于窗口化
        // isCopy: true,
        // copyContent: () => {
        //   require('electron').clipboard.writeText(this.customData.text)
        //   message.success('已成功复制到剪切板')
        // },
        type: 'note',
        showColor:true,
        removeCard:()=>{
          this.modelValue = true
          this.isRemove = false
        }

      },
      settingVisible: false,
      menuList: [
        {
          newIcon: 'fluent:copy-20-regular',
          title: '复制内容',
          fn: () => {
            let content =this.$refs.mdEditor.getContent()
            // require('electron').clipboard.writeHTML(content)
            require('electron').clipboard.writeText(content)
            message.success('复制内容成功')
            console.log(content,'md内容')
          }
        },
        {
          newIcon: 'fluent:markdown-20-regular',
          title: '复制MD文本',
          fn: () => {
            let content =this.$refs.mdEditor.getMarkdown()
            require('electron').clipboard.writeText(content)
            message.success('复制内容成功')
            console.log(content,'md内容')
          }
        },
        {
          newIcon: 'fluent:clipboard-code-24-regular',
          title: '复制HTML代码',
          fn: () => {
            let content =this.$refs.mdEditor.getContent()
            require('electron').clipboard.writeText(content)
            message.success('复制内容成功')
            console.log(content,'md内容')
          }
        },
        {
          newIcon: 'fluent:print-20-regular',
          title: '打印',
          fn: () => {
            this.api = DTPWeb.getInstance()
            this.printPreviewVisible = true

            const div = document.createElement('div')
            this.print.previewText = div.innerText
            this.print.previewHtml = this.$refs.mdEditor.getContent()

            // 打印驱动检测  需要判断两个 目前只有一个
            DTPWeb.checkServer((value) => {
              this.print.status = !!value
              this.print.printer = value
              console.log(value)
              if (!value) {
                message.error('打印助手不可用')
              }if(!this.api.getPrinters({ onlyLocal: true })){
                this.print.status = false
                message.error('暂无打印机连接')
              } else {
                this.print.printers = this.print.printers = this.api.getPrinters({ onlyLocal: true })
                this.selectedPrinter = this.api.getDefaultPrinter().printerName
                this.$nextTick(()=>{
                  // 去生成预览图
                  this.doPreview()
                })
              }
            })
          },
        },
        {
          icon: 'shezhi1',
          title: '设置',
          fn: () => {
            this.$refs.homelSlotRef.visible = false
            this.settingVisible = true
          },
        },
        {
          newIcon: 'fluent:open-20-filled',
          title: '跳转便签',
          fn: () => {
            this.$router.push({
              name: 'note',
              params: {
                customIndex: this.customIndex
              }
            })
          }
        }
      ],
      color: {
        color1: '#57BF60',
        color2: '#815BD0',
        color3: '#C8BF55',
        color4: '#DE5D5D',
        color5: '#5898CB',
        color6: '#DE5DB2',
      },
      text: '',
      background: '',
      icons: {
        notepad12Regular,
      },
      cardSize: { name: '2x2', title: '2x2' },
      sizeType: [
          { name: '2x2', title: '2x2' },
          { name: '2x4', title: '2x4' },
          { name: '4x4', title: '4x4' },
          { name: '4x6', title: '4x6' },
      ],
      cardSize1: { name: '2x2', value: '2x2' },
      sizeType1: [
          { name: '2x2', value: '2x2' },
          { name: '2x4', value: '2x4' },
          { name: '4x4', value: '4x4' },
          { name: '4x6', value: '4x6' },
      ],
      colorIndex:1,
    }
  },
  created () {
    let setData = {}
    if (!this.customData.background) {
      setData.background = this.color.color1
    }
    if (!this.customData.text) {
      setData.text = ''
    }
    if (!this.customData.color) {
      setData.colors = '#ffffff'
    }
    if (this.customData.fontColor) {
      this.fontColor = this.customData.fontColor
    }
    if (Object.keys(setData)) {
      this.updateCustomData(this.customIndex, setData, this.desk)
    }
  },
  mounted () {
    this.text = this.customData.text
    this.colorIndex = this.customData.colorIndex
    this.options.showColor = this.customData.showColor
    this.tmpTitle = this.customData.title
    this.background = this.customData.background
    this.colors = this.customData.color
    if (!this.customData.fontColor) {
      this.fontColor = 'white'
    }
  },

  methods: {

    ...mapActions(noteStore, ['changeDeskBg', 'saveDeskTitle']),
    // 开始打印
    // startPrint () {
    //   const api = this.api
    //   doJob('default',this.selectedPrinter,this.$refs.printContent.innerText,() => {
    //     // 打印结束 关闭打印机以及弹窗
    //     api.closePrinter()
    //     this.printPreviewVisible = false
    //   })
    // },

    // doJob (jobName = 'default', callback) {
    //   //
    //   if (!this.selectedPrinter) {
    //     return message.error('请选择打印机')
    //   }
    //   const printerName = this.selectedPrinter

    //   const api = this.api
    //   const text = this.$refs.printContent.innerText
    //   console.log('需要打印的文本', text)
    //   if (!api) return message.error('api初始化失败')
    //   // 判断打印机是否链接
    //   api.openPrinter(printerName, (success) => {
    //     if (success) {
    //       api.startJob({ orientation: 0, width: labelWidth, height: labelHeight, jobName: jobName })
    //       //api.startPage()
    //       api.drawText(
    //         {
    //           text: text,
    //           x: 2,
    //           y: 2,
    //           lineSpace: '1_2',
    //           width: labelWidth - 4,
    //           height: labelHeight - 4,
    //           fontHeight
    //         })
    //       //api.endPage()
    //       // 这里进行打印
    //       api.commitJob({
    //         callback: callback
    //       })
    //     }
    //   })
    // },
    // 因为传递预览图会导致无法渲染 此方法暂时无法抽离\
    no(){
      this.modelValue = false
    },
    async ok(){
      this.modelValue = false
      // 删除桌面便签时需要清除db数据
      let getDb = await tsbApi.db.find({
        selector: {
          _id: 'note:' + this.customIndex,
        },
      })
      this.$refs.homelSlotRef.doRemoveCard()
      if(this.isRemove){
        // 清除数据
        if (getDb.docs.length) {
          await tsbApi.db.remove(getDb.docs[0])
        }
      }else{
        await tsbApi.db.put({
          ...getDb.docs[0],
          isDelete:true,
        })
      }
    },
    doPreview () {
      const api = this.api
      doJob(LPA_JobNames.Preview,this.selectedPrinter,this.$refs.printContent.innerText, (success) => {
        if (success) {
          // 当内容过长时 需要添加分页打印
          let page = api.getPageImage({ page: 0 })
          const img = document.createElement('img')
          img.setAttribute('style', 'object-fit:contains;width:100%;height:100%')
          img.src = page.data
          this.$refs.preivew.appendChild(img)
          api.closePrinter()
        } else {
          message.error('生成预览图失败')
        }
      })
    },
    printing(){
      // this.startPrint()
      startPrint(this.selectedPrinter,this.$refs.printContent.innerText)
    },

    // 更换打印机
    handleChangePrinter(){
      this.doPreview()
      // this.$refs.preivew.appendChild(img)
    },

    updateBackground (backgroundColor,n) {
      this.colorIndex = n

      message.success({
        content: '设置卡片背景成功',
        key: 'bg',
      })
      this.updateCustomData(
        this.customIndex,
        {
          background: backgroundColor,
          colorIndex: n,
        },
        this.desk
      )
      // 如果用户没有初始化过不加载
      if (this.initFlag) {
        this.changeDeskBg(this.customIndex, backgroundColor)
      }

      this.background = backgroundColor
      if (backgroundColor ==
        'linear-gradient(-45deg, #545454 0%, #F9F8F9 0%, #F2F1F2 100%)'
      ) {
        this.updateCustomData(
          this.customIndex,
          {
            color: '#000000',
          },
          this.desk
        )
        this.colors = '#000000'
      } else {
        this.updateCustomData(
          this.customIndex,
          {
            color: '#ffffff',
          },
          this.desk
        )
        this.colors = '#ffffff'
      }
    },
    updateFontColor (color) {
      message.success({
        content: '设置字体颜色成功',
        key: 'color',
      })
      this.updateCustomData(
        this.customIndex,
        {
          fontColor: color,
        },
        this.desk
      )
      this.fontColor = color
    },
    // 修改便签标题
    changeNoteTitle () {
      // 数据发生变动开始保存
      if (this.tmpTitle != this.customData.title) {
        this.updateCustomData(this.customIndex, {
          title: this.tmpTitle,
        }, this.desk)
        this.saveDeskTitle(this.customIndex, this.tmpTitle)
      }
    },
    closeSetting(){
      this.settingVisible = false
    },
    changeShowColor(){
      this.updateCustomData(this.customIndex, {
        showColor: this.options.showColor,
      }, this.desk)
    },
  }
  ,
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  background-color: rgba(165, 42, 42, 0);
  border: 0px;
  resize: none;
  border-radius: 8px;
  overflow: hidden;
  box-sizing: border-box;
  // padding: 12px;
  font-size: 16px;
  // border: 1PX solid RED;
  position: relative;
  top: -11px;
}

.box::-webkit-scrollbar {
  width: 0;
}

.box:focus {
  outline: none;
}

.item-box {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin-left: 2px;
}

.item {
  width: 40px;
  height: 40px;
  // opacity: 0.65;
  border-radius: 10px;
  cursor: pointer;
}

.drag-boxs {
  display: flex;
  margin-top: -24px;
  width: 100%;
  height: 20px;
  justify-content: end;
}

::-webkit-input-placeholder {
  color: var(--primary-text);
}

</style>
<style>
.printers .ant-select-selector{
  &:active{
    outline:none
  }
  border:none !important;
  outline: none;
}
</style>
