<template>
    <div class="h-full w-full vditor-markdown box " style="">
        <div ref="vditor" class="h-full vditor-markdown"></div>
    </div>
</template>
 
<script>
import {
    validateFile,
    fileUpload,
} from "../../../components/card/hooks/imageProcessing";
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { mapActions, mapState, mapWritableState } from "pinia";
import { noteStore } from '../store'
import { cardStore } from "../../../store/card";
export default {
    components: {
        // Vditor
    },
    computed: {
        ...mapWritableState(noteStore, ['noteList', 'selNote', 'noteBgColor', 'selNoteTitle', 'selNoteText', 'deskList', 'isSelTab']),
    },
    data() {
        return {
            contentEditor: '',
            tmpData: '',
        };
    },
    mounted() {
        this.contentEditor = new Vditor(this.$refs.vditor, {
            height: '100%',
            mode: 'ir',
            theme: "dark",
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            },
            // emoji , headings , bold , italic , strike , | , line , quote , list , ordered-list , check ,outdent ,indent , code , inline-code , insert-after , insert-before ,undo , redo , upload , link , table , record , edit-mode , both , preview , fullscreen , outline , code-theme , content-theme , export, devtools , info , help , br
            toolbar: ['emoji', 'headings', 'bold', 'italic', 'strike', 'line', 'quote', 'ordered-list', 'check', 'outdent', 'indent', 'code', 'inline-code', 'insert-before', 'link', 'table', 'insert-after', 'preview', 'devtools', 'upload', 'help', 'br'],
            after: () => {
                if (this.selNote >= 0 && this.noteList.length) {
                    this.contentEditor.setValue(this.noteList[this.selNote].customData.text)
                }
            },
            blur: (value) => {
                if (this.tmpData != value && this.noteList.length > 0) {
                    // 存在桌面就去修改
                    // 定义一个虚拟元素提取文本
                    let tmpDiv = document.createElement('div')
                    tmpDiv.innerHTML = this.contentEditor.getHTML()
                    let content = tmpDiv.textContent || tmpDiv.innerText || ''

                    if (this.noteList[this.selNote].deskName != '') {
                        let n = -1
                        this.deskList.forEach((item, index) => {
                            if (item.id == this.noteList[this.selNote].deskId) {
                                n = index
                            }
                        })
                        if (n >= 0) {
                            this.updateCustomData(
                                this.noteList[this.selNote].id,
                                {
                                    text: value,
                                },
                                this.deskList[n]
                            );
                        }
                    }
                    this.noteList[this.selNote].customData.text = value

                    this.saveDeskNote(this.noteList[this.selNote].id, value, content)
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
    methods: {
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(noteStore, ['saveDeskNote','noteList','selNote']),

    },
    watch: {
        selNote(newval, oldval) {
            if (newval >= 0 && this.noteList.length >= 0) {
                this.tmpData = this.noteList[newval].customData.text
                this.contentEditor.setValue(this.noteList[newval].customData.text)
            }
        }
    }
};
</script>
<style lang="scss">
    // .vditor-ir{
    //     display: flex;
    //     justify-content: center;
    // }

    .vditor-reset{
        
        color: #fff !important;
        padding: 10px 9% !important;
        // padding: 10px 0 !important;
        // width: 90%;
    }
    .box .vditor-reset{
        color: #fff !important;
        height: 101% !important;
    }
    ::-webkit-scrollbar{
        -webkit-appearance: none;
        width: 6px;
        height: 6px;;
    }


    ::-webkit-scrollbar-thumb{
        display: none;
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }

    .vditor-content:hover ::-webkit-scrollbar-thumb{
        display: block;
    }
    

    ::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }

    .vditor-toolbar{
        border: none;
        padding: 0 8% !important;

    }
    .vditor-toolbar__item{
        -webkit-app-region: no-drag;

    }

    .box .vditor-markdown{
        border: none;
        border-radius: 0;
        z-index: 100 !important;

    }

    // 以下样式针对全屏模式下的便签编辑器调整
    .pop-box .vditor-toolbar{
        position: absolute;
        // padding: 0;
        width: 100%;
        left: 0; 
        height: 52px;
        top: 64px;
        display: flex;
        // flex-;
        justify-content: center !important;
        flex-wrap: wrap;
    }

    .pop-box .vditor-reset{
        height: 90% !important;
        padding: 20px 49px !important;
    }

    .pop-box .vditor-toolbar .vditor-toolbar__item{
        height: 100%;
        padding: 0 8px;
        display: flex !important;
        align-items: center;
    }


    // 以下样式针对markdown特殊格式进行调整
    .vditor-ir h1{
        margin: 16px 0 12px;
        font-size: 22px;
        font-weight: 85;
    }
    .vditor-ir h2{
        margin: 16px 0 12px;
        font-size: 20px;
        font-weight: 85;
    }
    .vditor-ir h3{
        margin: 16px 0 12px;
        font-size: 18px;
        font-weight: 85;
    }
    .vditor-ir h4{
        margin: 16px 0 12px;
        font-size: 16px;
        font-weight: 85;
    }
    .vditor-ir h5{
        margin: 16px 0 12px;
        font-size: 15px;
        font-weight: 85;
    }
    .vditor-ir h6{
        margin: 16px 0 12px;
        font-size: 15px;
        font-weight: 85;
    }
    .vditor-ir [data-type='em']{
        font-size: 15px;
        font-weight: 55;
    }
    .vditor-ir [data-type='strong']{
        font-size: 15px;
        font-weight: 75;
    }
    .vditor-ir [data-type='s']{
        font-size: 15px;
        font-weight: 60;
    }
    .vditor-ir blockquote{
        font-size: 15px;
        background: #2A2A2A;
        color: #e6e6e6 !important;
    }
    .vditor-ir ol{
        font-size: 15px;
        font-weight: 55;
    }
    .vditor-ir ul{
        font-size: 15px;
        font-weight: 55;
    }
    .vditor-ir table{
        font-size: 15px;
        font-weight: 55;
        color: #000 !important;
    }
</style>
 