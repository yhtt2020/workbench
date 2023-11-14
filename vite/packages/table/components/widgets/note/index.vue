<template>
  <Widget
    :customData="customData"
    :size="reSize"
    :customIndex="customIndex"
    :options="{...this.options,background:this.customData.background,title:this.customData.title}"
    :menuList="menuList"
    class="test"
    ref="homelSlotRef"
    :desk="desk"
  >
    <template #left-title-icon>
      <!-- 图标 -->
      <div class="icon flex justify-center align-center"
           style="width: 35px;height: 24px;position: absolute;left: 3px;top:16px;">
        <Icon :icon="icons.notepad12Regular" width="20" height="20"/>
      </div>
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

  <a-drawer :width="500" v-model:visible="settingVisible" placement="right">
    <template #title>
      <div class="text-center">设置</div>
    </template>

    <XtRadio @onChange="__updateSize" :data="customData.dragCardSize"></XtRadio>
    <!-- <div>文字颜色</div> -->
    <!-- <div class="item-box">
      <div
        class="item"
        :key="item"
        :style="{ background: item }"
        v-for="item in fontColors"
        @click="updateFontColor(item)"
      ></div>
    </div> -->
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
  </a-drawer>
  <teleport to="body">
    <Modal v-if="printPreviewVisible" v-model:visible="printPreviewVisible" :blurFlag="true" :mask-no-close="false">
      <div class="p-3" style="width:400px;height:auto">
        <div class="p-3">设备要求：德佟P1；纸张：40*60，间隙纸</div>
        <span v-if="!print.status">打印助手未就绪</span>

        <template v-else>
          <div class="px-3 pb-3">
            <a-select
              style="z-index: 99999999; position: relative;border:none"
              v-model:value="selectedPrinter"
              class="no-drag w-full rounded-xl printers"
              size="large"
              @change="handleChange"
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
              <div ref="previewText" class="rounded-lg mt-3  mb-3 "
                   style="display:inline-block;background:white;color:black;width:160px;height:240px;font-size:12px;overflow: hidden">
                <div ref="printContent" hidden v-html="print.previewHtml"></div>
                <div ref="preivew" class="item-content "></div>
              </div>
            </div>

            <div class="content-item">
              <xt-button type="theme" @click="startPrint"  style="width:100%" :h="30">打印</xt-button>
            </div>
          </div>
        </template>


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
    menuList: {
      type: Array,
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
      selectedPrinter: '',
      print: {
        status: false,
        printer: {},
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
        isCopy: true,
        copyContent: () => {
          require('electron').clipboard.writeText(this.customData.text)
          message.success('已成功复制到剪切板')
        },
        type: 'games',

      },
      settingVisible: false,
      menuList: [
        {
          newIcon: 'fluent:print-20-regular',
          title: '打印',
          fn: () => {

            this.printPreviewVisible = true
            this.print.previewHtml = this.$refs.mdEditor.getContent()
            // const div = document.createElement('div')
            // div.innerHTML = html
            //this.print.previewText = div.innerText
            //console.log(div, html, this.print.previewText)
            this.api = DTPWeb.getInstance()
            DTPWeb.checkServer((value) => {
              this.print.status = !!value
              this.print.printer = value
              if (!value) {

                message.error('打印助手不可用')
              } else {
                this.print.printers = this.print.printers = this.api.getPrinters({ onlyLocal: true })
                this.selectedPrinter = this.api.getDefaultPrinter().printerName
                this.$nextTick(()=>{
                  this.doPreview()
                })
                // setTimeout(() => {
                //
                // }, 1000)
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
        // color1: "linear-gradient(-45deg, #545454 0%, #C1E65B 0%, #71E293 100%)",
        // color2: "linear-gradient(-45deg, #545454 0%, #51E191 0%, #42CAAB 100%)",
        // color3: "linear-gradient(-45deg, #545454 0%, #CDF97D 0%, #A1E99D 100%)",
        // color4: "linear-gradient(-45deg, #545454 0%, #C0E0FF 0%, #ADC9FF 100%)",
        // color5: "linear-gradient(-45deg, #545454 0%, #89E5FF 0%, #70B3FF 100%)",
        // color6: "linear-gradient(-45deg, #545454 0%, #44D2DE 0%, #558AED 100%)",
        // color7: "linear-gradient(-45deg, #545454 0%, #D9ABE1 0%, #A772FC 100%)",
        // color8: "linear-gradient(-45deg, #545454 0%, #F5BC9A 0%, #D57FE6 100%)",
        // color9: "linear-gradient(-45deg, #545454 0%, #FDE485 0%, #F895AA 100%)",
        // color10:"linear-gradient(-45deg, #BA4348 0%, #A466E9 0%, #BA4244 100%)",
        // color11:"linear-gradient(-45deg, #A93AAE 0%, #DA6891 0%, #C987CC 100%)",
        // color12:"linear-gradient(-45deg, #545454 0%, #DA6991 0%, #A73781 100%)",
        // color13:"linear-gradient(-45deg, #545454 0%, #F1EBF9 0%, #F4CFF6 100%)",
        // color14:"linear-gradient(-45deg, #545454 0%, #F9F8F9 0%, #F2F1F2 100%)",
        // color15:"linear-gradient(-45deg, #252A31 0%, #30373F 0%, #15161A 100%)",
      },
      text: '',
      background: '',
      icons: {
        notepad12Regular,
      },
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
    this.tmpTitle = this.customData.title
    this.background = this.customData.background
    this.colors = this.customData.color
    if (!this.customData.fontColor) {
      this.fontColor = 'white'
    }
  },

  methods: {

    ...mapActions(noteStore, ['changeDeskBg', 'saveDeskTitle']),
    startPrint () {
      this.doJob('default',() => {
          api.closePrinter()
        })
    },
    doJob (jobName = 'default', callback) {
      if (!this.selectedPrinter) {
        return message.error('请选择打印机')
      }
      const printerName = this.selectedPrinter

      const api = this.api
      const text = this.$refs.printContent.innerText
      console.log('需要打印的文本', text)
      if (!api) return message.error('api初始化失败')
      api.openPrinter(printerName, (success) => {
        if (success) {
          api.startJob({ orientation: 0, width: labelWidth, height: labelHeight, jobName: jobName })
          //api.startPage()
          api.drawText(
            {
              text: text,
              x: 2,
              y: 2,
              lineSpace: '1_2',
              width: labelWidth - 4,
              height: labelHeight - 4,
              fontHeight
            })
          //api.endPage()
          api.commitJob({
            callback: callback
          })
        }
      })
    },
    doPreview () {
      const api = this.api
      this.doJob(LPA_JobNames.Preview, (success) => {
        if (success) {
          const info = api.getPageInfo()
          let page = api.getPageImage({ page: 0 })
          const img = document.createElement('img')
          img.setAttribute('style', 'object-fit:contains;width:100%;height:100%')
          img.src = page.data
          this.$refs.preivew.appendChild(img)
          api.closePrinter()
        } else {
          message.error('生成预览图失败')
          console.log(success)
        }
      })

    },

    // updateText() {
    //   this.updateCustomData(
    //     this.customIndex,
    //     {
    //       text: this.text,
    //     },
    //     this.desk
    //     // 将text存入db
    //   );
    // },
    updateBackground (backgroundColor) {
      message.success({
        content: '设置卡片背景成功',
        key: 'bg',
      })
      this.updateCustomData(
        this.customIndex,
        {
          background: backgroundColor,
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
    }
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
  width: 56px;
  height: 56px;
  opacity: 0.65;
  border-radius: 10px;
  cursor: pointer;
  margin: 9px;
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
