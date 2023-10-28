 <template>    
 <div class="h-full w-full" style="">
    <div id="vditor" class="h-full" style="border-radius:10px;" ></div>
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
        this.contentEditor = new Vditor('vditor', {
            height: '100%',
            // width:500,
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            }, 
            after: () => {
                if (this.selNote>=0) {
                    this.contentEditor.setValue(this.noteList[this.selNote].customData.text)
                }
            },
            blur:(value)=>{
                if (this.tmpData != value && this.noteList.length>0) {
                    // 存在桌面就去修改
                    if(this.noteList[this.selNote].deskName != ''){
                        let n = -1
                        this.deskList.forEach((item,index)=>{
                            if (item.id == this.noteList[this.selNote].desk.id) {
                            n = index
                            }
                        })
                        this.updateCustomData(
                            this.noteList[this.selNote].id,
                            {
                            text: value,
                            },
                            this.deskList[n]
                        );
                    }

                    this.noteList[this.selNote].customData.text = value

                    this.saveDeskNote(this.noteList[this.selNote].id,value)
                }
            }
        })
        // this.contentEditor.setValue('f5f5a4')x
    },
   methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(noteStore, ['saveDeskNote']),

   },
   watch:{
    selNote(newval,oldval){
        //console.log('new',newval);
        //console.log(this.noteList);
        if(newval>=0){
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
        background: transparent;
    }
    :deep(.vditor-reset){
        color: #fff !important;
        // padding: 5px 10px !important;
    }
    :deep(.vditor-ir pre.vditor-reset){
        // background: rgba(255,255,255,0.5);
            background: transparent;
    }
    // :deep(.vditor-ir pre.vditor-reset:focus){
        //     // background: transparent;
    //     background: rgba(255,255,255,0.4);
    // }

    :deep(.vditor-tooltipped){
        color: #fff !important;
    }
 </style>
 