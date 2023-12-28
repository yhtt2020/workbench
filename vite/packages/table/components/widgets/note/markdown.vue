 <template>
 <div class="h-full w-full box" style="position: relative;top: 6px;">
    <div ref="vditor" :id="vid" class="h-full " style="border-radius:10px;padding: 0;" ></div>
 </div>

 </template>

 <script>

import {
    validateFile,
    fileUpload,
} from "../../../components/card/hooks/imageProcessing";
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import {cardStore} from "../../../store/card";
import {noteStore} from "../../../apps/note/store";
import {mapActions, mapState,mapWritableState} from "pinia";
import { message } from 'ant-design-vue'

 export default {
   components: {
    // Vditor
   },
   props:['customData','customIndex','desk','vid'],
  computed:{
    ...mapWritableState(noteStore, ['initFlag']),
  },
    data() {
        return {
            contentEditor: {},
            tmpData:'',
        };
    },
    mounted(){
        this.contentEditor = new Vditor(this.$refs.vditor, {
            height: '100%',
            cdn: 'https://a.apps.vip/download/vditor',
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            },
            after: () => {
                this.contentEditor.setValue(this.customData.text)
                this.tmpData = this.customData.text
            },
            toolbar:[],
            blur:(value)=>{

                // 定义一个虚拟元素提取文本
                let tmpDiv = document.createElement('div')
                tmpDiv.innerHTML = this.contentEditor.getHTML()
                // let content = tmpDiv.textContent || tmpDiv.innerText || ''

                if (this.tmpData != value) {
                    this.updateCustomData(
                        this.customIndex,
                        {
                        text: value,
                        },
                        this.desk
                    );
                    this.tmpData = value
                    // 如果用户没有进行初始化 不加载
                    if (this.initFlag) {
                        this.saveDeskNote(this.customIndex,value)
                    }
                }
            },
            upload: {
                multiple: true,
                handler: async (files) => {
                    let urls = []
                    for (const file of files) {
                        let validate = validateFile(file, 2);
                        if (validate !== true) return message.error(validate);
                        let url = await fileUpload(file);
                        if (!url) return message.error('上传失败');
                        urls.push(`![image.png](${url})`)
                    }
                    this.contentEditor.insertValue(urls)
                },
            },
        })
    },
   methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(noteStore, ['saveDeskNote']),
     getContent(){
          return this.contentEditor.getHTML()
     },
     getMarkdown(){
       return this.contentEditor.getValue()
     }


   }
 };
 </script>
 <style lang="scss" scoped>
    .box{
        border-radius: 0 !important;
    }
    :deep(.vditor){
        border: none;
    }
    :deep(.vditor-toolbar){
        border: none;
    }
    :deep(.vditor-reset){
        color: #fff !important;
        padding: 5px 10px !important;
    }
    :deep(.vditor-ir pre.vditor-reset){
        background: transparent;
    }
    :deep(.vditor-ir pre.vditor-reset:focus){
        background: transparent;
    }
    :deep(.hljs){
        color: #fff;
        background: transparent;
    }

 </style>
