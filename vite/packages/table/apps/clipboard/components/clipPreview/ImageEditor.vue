<script lang="ts">
import {defineComponent} from 'vue'
// import "tui-image-editor/dist/tui-image-editor.css";
// import "tui-color-picker/dist/tui-color-picker.css";

// import ImageEditor from "tui-image-editor";
import {message, Modal} from "ant-design-vue";
const locale_zh = {
  ZoomIn: "放大",
  ZoomOut: "缩小",
  Hand: "手掌",
  History: '历史',
  Resize: '调整宽高',
  Crop: "裁剪",
  DeleteAll: "全部删除",
  Delete: "删除",
  Undo: "撤销",
  Redo: "反撤销",
  Reset: "重置",
  Flip: "镜像",
  Rotate: "旋转",
  Draw: "画",
  Shape: "形状标注",
  Icon: "图标标注",
  Text: "文字标注",
  Mask: "遮罩",
  Filter: "滤镜",
  Bold: "加粗",
  Italic: "斜体",
  Underline: "下划线",
  Left: "左对齐",
  Center: "居中",
  Right: "右对齐",
  Color: "颜色",
  "Text size": "字体大小",
  Custom: "自定义",
  Square: "正方形",
  Apply: "应用",
  Cancel: "取消",
  "Flip X": "X 轴",
  "Flip Y": "Y 轴",
  Range: "区间",
  Stroke: "描边",
  Fill: "填充",
  Circle: "圆",
  Triangle: "三角",
  Rectangle: "矩形",
  Free: "曲线",
  Straight: "直线",
  Arrow: "箭头",
  "Arrow-2": "箭头2",
  "Arrow-3": "箭头3",
  "Star-1": "星星1",
  "Star-2": "星星2",
  Polygon: "多边形",
  Location: "定位",
  Heart: "心形",
  Bubble: "气泡",
  "Custom icon": "自定义图标",
  "Load Mask Image": "加载蒙层图片",
  Grayscale: "灰度",
  Blur: "模糊",
  Sharpen: "锐化",
  Emboss: "浮雕",
  "Remove White": "除去白色",
  Distance: "距离",
  Brightness: "亮度",
  Noise: "噪音",
  "Color Filter": "彩色滤镜",
  Sepia: "棕色",
  Sepia2: "棕色2",
  Invert: "负片",
  Pixelate: "像素化",
  Threshold: "阈值",
  Tint: "色调",
  Multiply: "正片叠底",
  Blend: "混合色",
  Width: "宽度",
  Height: "高度",
  "Lock Aspect Ratio": "锁定宽高比例",

};
const customTheme = {

  "common.bi.image": "", // 左上角logo图片

  "common.bisize.width": "0px",

  "common.bisize.height": "0px",

  "common.backgroundImage": "none",

  "common.backgroundColor": "#f3f4f6",

  "common.border": "1px solid #333",



  // header

  "header.backgroundImage": "none",

  "header.backgroundColor": "#f3f4f6",

  "header.border": "0px",



  // load button

  "loadButton.backgroundColor": "#fff",

  "loadButton.border": "1px solid #ddd",

  "loadButton.color": "#222",

  "loadButton.fontFamily": "NotoSans, sans-serif",

  "loadButton.fontSize": "12px",

  "loadButton.display": "none", // 隐藏



  // download button

  "downloadButton.backgroundColor": "#fdba3b",

  "downloadButton.border": "1px solid #fdba3b",

  "downloadButton.color": "#fff",

  "downloadButton.fontFamily": "NotoSans, sans-serif",

  "downloadButton.fontSize": "12px",

  "downloadButton.display": "none", // 隐藏



  // icons default

  "menu.normalIcon.color": "#8a8a8a",

  "menu.activeIcon.color": "#555555",

  "menu.disabledIcon.color": "#ccc",

  "menu.hoverIcon.color": "#e9e9e9",

  "submenu.normalIcon.color": "#8a8a8a",

  "submenu.activeIcon.color": "#e9e9e9",



  "menu.iconSize.width": "24px",

  "menu.iconSize.height": "24px",

  "submenu.iconSize.width": "32px",

  "submenu.iconSize.height": "32px",



  // submenu primary color

  "submenu.backgroundColor": "#1e1e1e",

  "submenu.partition.color": "#858585",



  // submenu labels

  "submenu.normalLabel.color": "#858585",

  "submenu.normalLabel.fontWeight": "lighter",

  "submenu.activeLabel.color": "#fff",

  "submenu.activeLabel.fontWeight": "lighter",



  // checkbox style

  "checkbox.border": "1px solid #ccc",

  "checkbox.backgroundColor": "#fff",



  // rango style

  "range.pointer.color": "#fff",

  "range.bar.color": "#666",

  "range.subbar.color": "#d1d1d1",



  "range.disabledPointer.color": "#414141",

  "range.disabledBar.color": "#282828",

  "range.disabledSubbar.color": "#414141",



  "range.value.color": "#fff",

  "range.value.fontWeight": "lighter",

  "range.value.fontSize": "11px",

  "range.value.border": "1px solid #353535",

  "range.value.backgroundColor": "#151515",

  "range.title.color": "#fff",

  "range.title.fontWeight": "lighter",



  // colorpicker style

  "colorpicker.button.border": "1px solid #1e1e1e",

  "colorpicker.title.color": "#fff",

};
function decodeBase64Image(dataString)
{
  var matches = dataString.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  var response = {};

  if (matches.length !== 3)
  {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

export default defineComponent({
  name: "ImageEditor",
  props:['filepath'],
  mounted() {
    this.path = 'file://' + this.$route.params['path']
    this.init(this.filepath)

  },
  methods: {
    init(path) {
      this.instance = new ImageEditor(
        document.querySelector("#tui-image-editor"),
        {
          includeUI: {
            loadImage: {
              path: path,
              name: "图片",
            },
            initMenu: "draw", // 默认打开的菜单项
            menuBarPosition: "bottom", // 菜单所在的位置
            theme:{ "common.bi.image": "",
              "common.bisize.width": "0px",
              "common.bisize.height": "0px",
              "loadButton.display": "none",
              "downloadButton.display": "none", },//customTheme,
            locale: locale_zh,
          },
          initMenu: "rotate",
          cssMaxWidth: 1000, // canvas 最大宽度
          cssMaxHeight: 600, // canvas 最大高度


        }

      )
      return customTheme
      //document.getElementsByClassName("tui-image-editor-main")[0].style.top = "45px"; // 图片距顶部工具栏的距离
    },
    abort(){
      Modal.confirm({
        content:'确认放弃？',
        centered:true,
        onOk:()=>{
          this.$emit('abort')
        }
      })
    },
    // 保存图片，并上传
    getBase64Data(){
      const base64String = this.instance.toDataURL() // base64 文件
      const data = window.atob(base64String.split(',')[1])
      const ia = new Uint8Array(data.length)
      for (let i = 0; i < data.length; i++) {
        ia[i] = data.charCodeAt(i)
      }
      return base64String
    },
    copyToClip(){
      const image=require('electron').nativeImage.createFromDataURL(this.getBase64Data())
      require('electron').clipboard.writeImage(image)
      message.success('复制到剪切板成功。')
    },

    save () {
      Modal.confirm({
        title: '确认',
        content: '是否覆盖原图片文件？此操作无法恢复。建议另存为新的文件。',
        okText: '确认覆盖',
        centered:true,
        cancelText: '取消',
        onOk: () => {
          let imageBuffer=decodeBase64Image(this.getBase64Data())
          require('fs').writeFile(this.filepath,imageBuffer.data,(err)=>{
            if(err){
              console.warn(err)
              message.error('保存失败。意外错误。')
            }else{
              message.success('保存成功。')
            }
          })
        }
      })
    },
    async saveAs() {
      let oldFilename = this.filepath.replace('\\', '/')
      let dir = this.filepath.substr(0, oldFilename.lastIndexOf('/'))
      let newFilename = dir + '/' + this.filepath.substring(this.filepath.lastIndexOf('/'), this.filepath.lastIndexOf('.')) + '_副本' + this.filepath.substr(this.filepath.lastIndexOf('.'))
      let path = await tsbApi.dialog.showSaveDialog({
        title: '另存为',
        defaultPath: newFilename,
      })
      if (path) {
        let imageBuffer = decodeBase64Image(this.getBase64Data())
        require('fs').writeFile(path, imageBuffer.data, (err) => {
          if (err) {
            console.warn(err)
            message.error('保存失败。意外错误。')
          } else {
            message.success('保存成功。')
          }
        })
      }
    }

  }

})
</script>

<template>
  <div style="background: #171717" class="w-full">
    <div style="float:right;width: 200px;display: flex">
      <div style="position:absolute;right: 40px;bottom: 17px;z-index: 9">
        <a-button shape="round" @click="abort" style="margin-right: 10px">放弃</a-button>
        <a-button shape="round" @click="copyToClip" style="margin-right: 10px">复制到剪切板</a-button>
        <a-button shape="round" @click="save" style="margin-right: 10px">保存</a-button>
        <a-button shape="round" @click="saveAs()" type="primary" style="">另存为</a-button>
      </div>
    </div>
    <a-layout-content style="background: white;height:calc(100vh - 80px);position:relative;">
      <div id="tui-image-editor" ></div>
    </a-layout-content>
  </div>

</template>

<style scoped lang="scss">

</style>
