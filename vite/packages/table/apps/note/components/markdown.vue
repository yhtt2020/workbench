 <template>    
 <div class="h-full w-full" style="">
    <div ref="vditor" class="h-full" style="border-radius:10px;" ></div>
 </div>

 </template>
 
 <script>
 import Vditor from 'vditor'
 import 'vditor/dist/index.css'
 import {mapActions, mapState,mapWritableState} from "pinia";
 import { noteStore } from '../store'
 import {cardStore} from "../../../store/card";
//  import 

 export default {
   components: {
    // Vditor
   },
   computed: {
    ...mapWritableState(noteStore, ['noteList','selNote','noteBgColor','selNoteTitle','selNoteText','deskList','isSelTab']),
    },
    data() {
        return {
            contentEditor: '',
            tmpData:'',
        };
    },
    mounted(){
        this.contentEditor = new Vditor(this.$refs.vditor, {
        // this.contentEditor = new Vditor(vditor, {
            height: '100%',
            mode:'ir',
            theme:"dark",
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            }, 
            // emoji , headings , bold , italic , strike , | , line , quote , list , ordered-list , check ,outdent ,indent , code , inline-code , insert-after , insert-before ,undo , redo , upload , link , table , record , edit-mode , both , preview , fullscreen , outline , code-theme , content-theme , export, devtools , info , help , br

            toolbar:['emoji','headings','bold','italic','strike','|','line','quote','ordered-list','check','outdent','indent','code','inline-code','insert-before','link','table','insert-after','preview','fullscreen','devtools','help','br'],
            after: () => {
                if (this.selNote>=0 && this.noteList.length) {
                    this.contentEditor.setValue(this.noteList[this.selNote].customData.text)
                }
            },
            blur:(value)=>{
                if (this.tmpData != value && this.noteList.length>0) {
                    // 存在桌面就去修改
                    // 定义一个虚拟元素提取文本
                    let tmpDiv = document.createElement('div')
                    tmpDiv.innerHTML = this.contentEditor.getHTML()
                    let content = tmpDiv.textContent || tmpDiv.innerText || ''

                    if(this.noteList[this.selNote].deskName != ''){
                        let n = -1
                        this.deskList.forEach((item,index)=>{
                            if (item.id == this.noteList[this.selNote].deskId) {
                                n = index
                            }
                        })
                        if (n>=0) {
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

                    this.saveDeskNote(this.noteList[this.selNote].id,value,content)
                }
            }
        })
    },
   methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(noteStore, ['saveDeskNote']),

   },
   watch:{
    selNote(newval,oldval){
        if(newval>=0 && this.noteList.length>=0){
            this.tmpData = this.noteList[newval].customData.text
            this.contentEditor.setValue(this.noteList[newval].customData.text)
        }
    }
   }
 };
 </script>
 <style lang="scss" scoped>
 
    :deep(.vditor){
        border: none;
    }
    :deep(.vditor-toolbar){
        border: none;
        padding: 0 10px !important;
        // background: transparent;
    }
    :deep(.vditor-reset){
        color: #fff !important;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        height: 101% !important;
        // padding: 5px 10px !important;
    }
    :deep(.vditor-ir pre.vditor-reset){
        // background: rgba(255,255,255,0.5);
            // background: transparent;
    }
    // :deep(.vditor-ir pre.vditor-reset:focus){
    //         // background: transparent;
    //     background: rgba(255,255,255,0.4);
    // }

    :deep(.vditor-tooltipped){
        // color: #fff !important;
    }
 </style>
 