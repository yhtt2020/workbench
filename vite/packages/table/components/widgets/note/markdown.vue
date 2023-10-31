 <template>    
 <div class="h-full w-full " style="">
    <div ref="vditor" class="h-full " style="border-radius:10px;padding: 0;" ></div>
 </div>

 </template>
 
 <script>
 import Vditor from 'vditor'
 import 'vditor/dist/index.css'
import {cardStore} from "../../../store/card";
import {noteStore} from "../../../apps/note/store";
import {mapActions, mapState,mapWritableState} from "pinia";

 export default {
   components: {
    // Vditor
   },
   props:['customData','customIndex','desk'],
   computed: {

    },
    data() {
        return {
            contentEditor: '',
            tmpData:'',
        };
    },
    mounted(){
        this.contentEditor = new Vditor(this.$refs.vditor, {
            height: '100%',
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
                // console.log(this.customData.text);
                // console.log(this.desk);

                if (this.tmpData != value) {
                    this.updateCustomData(
                        this.customIndex,
                        {
                        text: value,
                        },
                        this.desk
                    );
                    this.tmpData = value
                    this.saveDeskNote(this.customIndex,value)
                }
            }
        })
    },
   methods:{
        ...mapActions(cardStore, ['updateCustomData']),
        ...mapActions(noteStore, ['saveDeskNote']),
     

 
   }
 };
 </script>
 <style lang="scss" scoped>
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

    :deep(.vditor-ir::-webkit-scrollbar-thumb){
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }
    :deep(.vditor-ir::-webkit-scrollbar-thumb:hover){
        background-color: #999; /* 悬停时滚动条颜色 */
    }
    :deep(.vditor-ir::-webkit-scrollbar-track){
        border-radius: 6px; /* 轨道圆角 */
    }

    :deep(.vditor-reset::-webkit-scrollbar-thumb){
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }
    :deep(.vditor-reset::-webkit-scrollbar-thumb:hover){
        background-color: #999; /* 悬停时滚动条颜色 */
    }
    :deep(.vditor-reset::-webkit-scrollbar-track){
        border-radius: 6px; /* 轨道圆角 */
    }

    
 </style>
 