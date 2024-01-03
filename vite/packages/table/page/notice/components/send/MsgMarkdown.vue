<template>
  <div class="h-full w-full vditor-markdown box " style="">
    <div ref="vditor" class="h-full vditor-markdown"></div>
  </div>
</template>

<script>
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { mapActions,mapWritableState } from 'pinia';
import { noticeStore } from '../../store/noticeStore';
import { validateFile, fileUpload,} from '../../../../components/card/hooks/imageProcessing'; 

export default {
  components: {},
 
  data () {
    return {

    }
  },

  computed:{
    ...mapWritableState(noticeStore,['msgSetting']),
  },

  mounted () {
    this.contentEditor = new Vditor(this.$refs.vditor, {
      height: '100%',
      mode: 'ir',
      theme: 'dark',
      placeholder: "正文",
      cdn: 'https://a.apps.vip/download/vditor',
      toolbarConfig: {
        pin: true,
        tipPosition:'s',
      },
      cache: {
        enable: false,
      },
      toolbar: [
        // {
        //     hotkey: "⌘E",
        //     icon: '<svg><use xlink:href="#vditor-icon-emoji"></use></svg>',
        //     name: "emoji",
        //     tipPosition: "s",
        // },
        {
            hotkey: "⌘H",
            icon:
                '<svg><use xlink:href="#vditor-icon-headings"></use></svg>',
            name: "headings",
            tipPosition: "s",
        },
        {
            hotkey: "⌘B",
            icon: '<svg><use xlink:href="#vditor-icon-bold"></use></svg>',
            name: "bold",
            prefix: "**",
            suffix: "**",
            tipPosition: "s",
        },
        {
            hotkey: "⌘I",
            icon: '<svg><use xlink:href="#vditor-icon-italic"></use></svg>',
            name: "italic",
            prefix: "*",
            suffix: "*",
            tipPosition: "s",
        },
        {
            hotkey: "⌘D",
            icon: '<svg><use xlink:href="#vditor-icon-strike"></use></svg>',
            name: "strike",
            prefix: "~~",
            suffix: "~~",
            tipPosition: "s",
        },
        {
            hotkey: "⇧⌘H",
            icon: '<svg><use xlink:href="#vditor-icon-line"></use></svg>',
            name: "line",
            prefix: "---",
            tipPosition: "s",
        },
        {
            hotkey: "⌘;",
            icon: '<svg><use xlink:href="#vditor-icon-quote"></use></svg>',
            name: "quote",
            prefix: "> ",
            tipPosition: "s",
        },
        {
            hotkey: "⌘O",
            icon:
                '<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',
            name: "ordered-list",
            prefix: "1. ",
            tipPosition: "s",
        },
        {
            hotkey: "⌘J",
            icon: '<svg><use xlink:href="#vditor-icon-check"></use></svg>',
            name: "check",
            prefix: "* [ ] ",
            tipPosition: "s",
        },
        {
            hotkey: "⌘U",
            icon: '<svg><use xlink:href="#vditor-icon-code"></use></svg>',
            name: "code",
            prefix: "```",
            suffix: "\n```",
            tipPosition: "s",
        },
        {
            hotkey: "⌘G",
            icon:
                '<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',
            name: "inline-code",
            prefix: "`",
            suffix: "`",
            tipPosition: "s",
        },
        {
            hotkey: "⌘K",
            icon: '<svg><use xlink:href="#vditor-icon-link"></use></svg>',
            name: "link",
            prefix: "[",
            suffix: "](https://)",
            tipPosition: "s",
        },
        {
            hotkey: "⌘M",
            icon: '<svg><use xlink:href="#vditor-icon-table"></use></svg>',
            name: "table",
            prefix: "| col1",
            suffix:
                " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
            tipPosition: "n",
        },
        {
            icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
            name: "upload",
            tipPosition: "s",
        },
        {
          name: "more",
          toolbar: [
              // "both",
              // "code-theme",
              // "content-theme",
              "export",
              "outline",
              "preview",
              "devtools",
              // "info",
              "help",
          ],
          tipPosition: 's',
        },
      ],
      after: () => {
        this.$nextTick(()=>{
          this.contentEditor.setValue(this.msgSetting.content);
        })
      },
      blur: (value) => {
        this.$nextTick(()=>{
          this.msgSetting.content = value
        })
      },
      upload: {
        multiple: true,
        handler: async (files) => {
          let urls = []
          for (const file of files) {
            let validate = validateFile(file, 2)
            if (validate !== true) return message.error(validate)
            let url = await fileUpload(file)
            if (!url) return message.error('上传失败')
            urls.push(`![image.png](${url})`)
          }
          this.contentEditor.insertValue(urls)
        },
      },
    })
  },
  methods: {
    setEditorValue (value) {
      // 子组件中的事件逻辑
      this.contentEditor.setValue(value);
    },
    getContent () {
      return this.contentEditor.getHTML()
    },
    getMarkdown () {
      return this.contentEditor.getValue()
    },
  },
}
</script>

<style lang="scss" scoped >
:deep(.vditor-reset){
  color: var(--secondary-text) !important;
  padding: 10px 12px !important;
  background: var(--secondary-transp-bg) !important;
  &::placeholder{
    color: var(--secondary-text) !important;
  }
  border-bottom-left-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}

:deep(.vditor-toolbar){
  background: var(--secondary-bg) !important;
  border: none !important;
  border-top-right-radius: 8px !important;
  border-top-left-radius: 8px !important;
}

</style>

<!-- <style lang="scss" scoped >
.vditor-reset {
   color: #fff !important;
  padding: 10px 1% !important;
}

.box .vditor-reset {
  color: var(--primary-text) !important;
}

.box ::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
  height: 6px;;
}

.box ::-webkit-scrollbar-thumb {
  display: none;
  background-color: #ccc; /* 滚动条颜色 */
  border-radius: 6px; /* 滚动条圆角 */
}

.vditor-content:hover ::-webkit-scrollbar-thumb {
  display: block;
}


.box ::-webkit-scrollbar-track {
  border-radius: 6px; /* 轨道圆角 */
}

.vditor-toolbar {
  border: none;
  padding: 0 8% !important;
  display: flex;
  justify-content: center !important;
  flex-wrap: wrap;

}
  // 字数统计
  .vditor-counter{
    // position: absolute;
    // right: 0;
  }

.vditor-toolbar__item {
  -webkit-app-region: no-drag;
  margin-right: 6px;
}

.vditor-outline__title{
  text-align: center;
}

.box .vditor-markdown {
  border: none;
  border-radius: 0;
  z-index: 100 !important;
}

.box .vditor-toolbar__item .vditor-tooltipped {
  color: var(--primary-text) !important;
}

  .vditor-img__btn{
    -webkit-app-region:no-drag;
  }
  .vditor-ir .vditor-reset > h1:before{
    color: var(--primary-text);
  }
  // 以下样式针对全屏模式下的便签编辑器调整
  .pop-box .vditor-toolbar{
      position: absolute;
      // padding: 0 !important;
      // width: 75%;
      // left: 0;
      height: 52px;
      top: 6px;
      display: flex;
      // flex-;
      justify-content: center !important;
      flex-wrap: wrap;
      background-color: transparent !important;
      // overflow: hidden;
      padding: 0 10% !important;
  }
  .pop-box .vditor-panel{
    position: absolute;
    top: 50px;
  }

  .pop-box .vditor-reset {
    // height: 90% !important;
    padding: 20px 49px !important;
  }

  .pop-box .vditor-toolbar .vditor-toolbar__item {
    height: 100%;
    padding: 0 8px;
    display: flex !important;
    align-items: center;
    color: var(--primary-text) !important;
    // padding: 0 !important;
  }

  // vditor-tooltipped vditor-tooltipped__s
  // 修改更多选项的弹窗
  .pop-box .vditor-hint{
    position: absolute;
    top: 53px;
    left: 6px;
  }


  // 大纲
  .vditor-outline{
    width: 25%;
  }

  // 以下样式针对markdown特殊格式进行调整
  .vditor-ir h1 {
    margin: 16px 0 12px;
    font-size: 22px;
    font-weight: 85;
    color:var(--primary-text);
  }

  .vditor-ir h2 {
    margin: 16px 0 12px;
    font-size: 20px;
    font-weight: 85;
    color:var(--primary-text);
  }

  .vditor-ir h3 {
    margin: 16px 0 12px;
    font-size: 18px;
    font-weight: 85;
    color:var(--primary-text);
  }

  .vditor-ir h4 {
    margin: 16px 0 12px;
    font-size: 16px;
    font-weight: 85;
    color:var(--primary-text);
  }

  .vditor-ir h5 {
    margin: 16px 0 12px;
    font-size: 15px;
    font-weight: 85;
    color:var(--primary-text);
  }

  .vditor-ir h6 {
    margin: 16px 0 12px;
    font-size: 15px;
    font-weight: 85;
    color:var(--primary-text);
  }

  .vditor-ir [data-type='em'] {
    font-size: 15px;
    font-weight: 55;
  }

  .vditor-ir [data-type='strong'] {
    font-size: 15px;
    font-weight: bolder;
  }

  .vditor-ir [data-type='s'] {
    font-size: 15px;
    font-weight: 60;
  }

  .vditor-ir blockquote {
    font-size: 15px;
    background: #2A2A2A;
    color: #e6e6e6 !important;
  }

  .vditor-ir ol {
    font-size: 15px;
    font-weight: 55;
  }

  .vditor-ir ul {
    font-size: 15px;
    font-weight: 55;
  }

  .vditor-ir table {
    font-size: 15px;
    font-weight: 55;
    color: #000 !important;
  }
</style> -->
