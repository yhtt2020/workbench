<template>
    <div class="h-full w-full vditor-markdown" style="">
        <div @click="test">123456</div>
        <div ref="vditor" class="h-full vditor-markdown" style="border-radius:10px;"></div>
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
import { handleSuccessPrompts } from "../../../TUIKit/TUIComponents/container/utils";
//  import 

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
            // this.contentEditor = new Vditor(vditor, {
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

            toolbar: ['emoji', 'headings', 'bold', 'italic', 'strike', '|', 'line', 'quote', 'ordered-list', 'check', 'outdent', 'indent', 'code', 'inline-code', 'insert-before', 'link', 'table', 'insert-after', 'preview', 'fullscreen', 'devtools', 'upload', 'help', 'br'],
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
                // accept:'image/jpeg,image/png,image/jpg',
                // max:2*1024*1024,
                multiple: true,
                // filename(name) {
                //     return name
                //         .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
                //         .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
                //         .replace("/\\s/g", '');
                // },
                handler: async (files) => {
                    console.log(this);
                    let urls = []
                    let filesList = []
                    for (const file of files) {
                        let validate = validateFile(file, 2);
                        if (validate !== true) return message.error(validate);
                        // console.log(2);
                        let url = await fileUpload(file);

                        if (url) console.log(url);
                        // console.log(3);
                        // return `![image.png](${url})`
                        // vditor.tip.show(`![image.png](${url})`);
                        // vditor.getCursorPosition(`![image.png](${url})`)
                        urls.push(`![image.png](${url})`)
                        // filesList.push(url)
                    }
                    // console.log('urls');
                    // console.log(urls);
                    // console.log('this');
                    // console.log(this);
                    // console.log('getCursorPosition');
                    this.contentEditor.vditor.insertValue (urls)


                },
                // format(files,responseText){
                //     console.log('files,responseText');
                //     console.log(files,responseText);
                //     return JSON.stringify({
                //         msg:200,
                //         code:200,
                //         data:{
                //             errFiles:[],
                //             succMap:files
                //         }
                //     })
                // },
                // success(filesList){
                //     console.log('success');
                //     console.log(this);
                //     console.log(filesList);
                //     // console.log(_this.contentEditor);
                //     return JSON.stringify({
                //         msg:'',
                //         code:0,
                //         data:{
                //             errFiles:[],
                //             succMap:filesList
                //         }
                //     })

                // },
                // linkToImgCallback()
            },
        })
    },
    methods: {
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(noteStore, ['saveDeskNote','noteList','selNote']),
        // beforeUpload(file) {
        //     console.log(2);
        //     let validate = validateFile(file, 2);
        //     if (validate !== true) return message.error(validate);
        //     this.imgUpload(file);
        // },
        async imgUpload(file) {
            console.log(3);
            let url = await fileUpload(file);
            if (url) this.edit.src = url;
        },
        test(){
            console.log(this);
        }

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


:deep(.vditor-toolbar) {
    border: none;
    padding: 0 10px !important;
    // background: transparent;
}

:deep(.vditor-reset) {
    color: #fff !important;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    height: 101% !important;
    // padding: 5px 10px !important;
}

:deep(.vditor-ir pre.vditor-reset) {
    // background: rgba(255,255,255,0.5);
    // background: transparent;
}





    ::-webkit-scrollbar{
        -webkit-appearance: none;
        width: 6px;
        height: 6px;;
    }
    // ::-webkit-scrollbar-track {
    //     rder-radius: 6px; /* 轨道圆角 */
    // }
    // ::-webkit-scrollbar-thumb {
    //     background-color: ccc !important;
    //     /* 滚动条颜色 */
    //     border-radius: 6px !important;
    //     /* 滚动条圆角 */
    // }

    // ::-webkit-scrollbar-thumb:hover {
    //     background-color: 999;
    //     /* 悬停时滚动条颜色 */
    // }



    ::-webkit-scrollbar-thumb {
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }
    
    // ::-webkit-scrollbar-thumb:hover {
    //     background-color: #999; /* 悬停时滚动条颜色 */
    // }

    ::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }












</style>
 