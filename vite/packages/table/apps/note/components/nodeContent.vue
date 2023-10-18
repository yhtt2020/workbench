 <template>
    <div class="w-full h-full flex justify-center items-center" style="min-width: 800px;">
        <div>
            <!-- <div @click="test">123</div> -->
            <!-- 顶部 -->
            <div style="width: 800px;justify-content: space-between;" class="flex " >
                <div class="flex items-center">
                    <div class="flex justify-center items-center mr-3 pointer" style="background-color: var(--secondary-bg);border-radius:10px;width: 107px;height: 40px;">#日常桌面</div>
                    <div style="font-size: 14px;color: rgba(255,255,255,0.40);">10分钟前编辑</div>
                </div>
                <div class="flex" style="position: relative;">
                    <div  class="flex justify-center items-center mr-3 pointer shadow" style="width:40px;height:40px;border-radius: 10px;" :style="{backgroundImage:this.selNote>=0?this.noteList[this.selNote].backgroundColor:''}" @click="isColor=!isColor"></div>
                    <!-- 颜色选择 -->
                    <div v-show="isColor" style="justify-content: space-around;position: absolute;width: 168px;height: 120px;top: 46px;left: -118px;background-color: #2A2A2A;" class="flex flex-wrap rounded p-3">
                        <div class="flex rounded-lg pointer" style="height:40px;width:40px;"  v-for="(item,index) in this.noteBgColor" :key="index" :style="{backgroundImage:item}"></div>
                    </div>
                    <xt-button class="flex justify-center items-center" :w="40" :h="40"><Icon :icon="icons.moreHorizontal16Filled" /></xt-button>
                </div>
            </div>
            <!-- 主体 -->
            <div>
                <div class="mt-4 shadow" style="height: 600px;border-radius: 12px;padding: 24px;" :style="{backgroundImage:this.selNote>=0?this.noteList[this.selNote].backgroundColor:''}">
                    <div class="mb-4 " style="color: var(--primary-text);font-size: 18px;font-weight: 500;word-wrap: break-word;text-wrap: wrap;">{{ this.selNote>=0?this.noteList[this.selNote].title:'' }}</div>
                    <div class="font-16" style="color: var(--primary-text);">{{ this.selNote>=0?this.noteList[this.selNote].content:'' }}</div>
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
 export default {
   components: {
    Icon
   },
   computed: {
        ...mapWritableState(noteStore, ['noteList','selNote','noteBgColor']),
   },
   data() {
     return {
        icons: {
            moreHorizontal16Filled,
        },
        isColor:false,
 
     };
   },
   methods:{
    test(){
        console.log(this.noteList);
        console.log(this.selNote);
    }
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
 