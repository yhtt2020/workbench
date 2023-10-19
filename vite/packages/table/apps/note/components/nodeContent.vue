 <template>
    <div class="w-full h-full flex justify-center items-center">
        <div class="w-full center" style="max-width: 800px;">
            <!-- 顶部 -->
            <div style="max-width: 800px;justify-content: space-between;" class="flex w-full" >
                <div class="flex items-center">
                    <div 
                    class="flex justify-center items-center mr-3 pointer" style="background-color: var(--secondary-bg);border-radius:10px;width: 107px;height: 40px;"
                    @click="selDesk"
                    >#{{ this.selNote>=0?this.noteList[this.selNote].deskName:"" }}</div>
                    <div style="font-size: 14px;color: rgba(255,255,255,0.40);">10分钟前编辑</div>
                </div>
                <div class="flex" style="position: relative;">
                    <div  class="flex justify-center items-center mr-3 pointer shadow" style="width:40px;height:40px;border-radius: 10px;" :style="{backgroundImage:this.selNote>=0?this.noteList[this.selNote].customData.background:''}" @click="isColor=!isColor"></div>
                    <!-- 颜色选择 -->
                    <div v-show="isColor" style="justify-content: space-around;position: absolute;width: 168px;height: 120px;top: 46px;left: -118px;background-color: #2A2A2A;z-index: 100;" class="flex flex-wrap rounded p-3">
                        <div class="flex rounded-lg pointer" style="height:40px;width:40px;"  v-for="(item,index) in this.noteBgColor" :key="index" :style="{backgroundImage:item}" @click="changeBgColor(index)"></div>
                    </div>
                    <xt-button class="flex justify-center items-center" :w="40" :h="40"><Icon :icon="icons.moreHorizontal16Filled" /></xt-button>
                </div>
            </div>
            <!-- 主体 -->
            <div>
                <div class="mt-4 shadow" style="height: 600px;border-radius: 12px;padding: 24px;" :style="{backgroundImage:this.selNote>=0?this.noteList[this.selNote].customData.background:''}">
                    <!-- 标题 -->
                    <a-input
                        style="color: var(--primary-text);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;
                        border: none;box-shadow: none;padding: 0;"
                        v-model:value="this.selNoteTitle"
                        maxlength="15"
                    ></a-input>
                    <!-- <a-input
                        style="color: var(--primary-text);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;
                        border: none;box-shadow: none;padding: 0;"
                        :value="this.selNote>=0?this.noteList[this.selNote].customData.title:''"
                    ></a-input> -->
                    <!-- <div class="mb-4 " style="color: var(--primary-text);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;">
                        {{ this.selNote>=0?this.noteList[this.selNote].customData.title:'' }}
                    </div> -->
                    <!-- 正文 -->
                    <!-- <div class="font-16 mt-4" style="color: var(--primary-text);">{{ this.selNote>=0?this.noteList[this.selNote].customData.text:'' }}</div>
                    <div class="font-16 mt-4" style="color: var(--primary-text);">??{{ this.selNoteText }}</div> -->
                    <a-textarea
                        style="color: var(--primary-text);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;
                        border: none;box-shadow: none;padding: 0;"
                        v-model:value="this.selNoteText"
                        placeholder="请输入内容"
                        :auto-size="{ minRows: 2, maxRows: 5 }"
                    />
                </div>

            </div>
        </div>
    </div>
 </template>
 
 <script>
    import { Icon } from '@iconify/vue';
    import moreHorizontal16Filled from '@iconify-icons/fluent/more-horizontal-16-filled';
    import {mapActions, mapState,mapWritableState} from "pinia";
    import { noteStore } from '../store'
    import { cardStore } from '../../../store/card';
 export default {
   components: {
    Icon
   },
   props:['selDesk'],
   computed: {
        ...mapWritableState(noteStore, ['noteList','selNote','noteBgColor','selNoteTitle','selNoteText']),
   },
   data() {
       return {
           icons: {
               moreHorizontal16Filled,
            },
            isColor:false,
            
        };
    },
    mounted(){
    },
   methods:{
    ...mapActions(cardStore, ['updateCustomData']),
    // 修改当前便签颜色
    changeBgColor(i){
        this.noteList[this.selNote].customData.background = this.noteBgColor[i]
        this.updateCustomData(this.noteList[this.selNote].id,{
            background:this.noteBgColor[i]
        },this.noteList[this.selNote].desk)
        this.isColor=false
    },
   },
   watch:{
    selNoteTitle(newval,oldval){
        this.noteList[this.selNote].customData.title = newval
        this.updateCustomData(this.noteList[this.selNote].id,{
            title:newval
        },this.noteList[this.selNote].desk)
    },
    selNoteText(newval,oldval){
        console.log(newval);
        this.noteList[this.selNote].customData.text = newval
        this.updateCustomData(this.noteList[this.selNote].id,{
            text:newval
        },this.noteList[this.selNote].desk)
    },
   }
 };
 </script>
 <style lang="scss" scoped>
 .shadow{
    box-shadow: 0px 0px 3.12px 0px rgba(0,0,0,0.03);
    box-shadow: 0px 0px 10.23px 0px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.2);
 }
 </style>
 