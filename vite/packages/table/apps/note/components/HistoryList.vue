<script lang="ts">
import {defineComponent} from 'vue'
import { formatTime, formatTimestamp } from '../../../util'
import { Icon } from '@iconify/vue'
import { noteStore } from '../store'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { message } from 'ant-design-vue'
import Markdown from './markdown.vue'
export default defineComponent({
  name: "HistoryList",
  props:['noteId', 'changeShowVersion', 'changeEditorValue'],
  components:{Icon, Markdown},
  data(){
    return{
      versions: [],
      selectVersion:null,
      selIndex: 0,
      settingsTab: [
        { name: "全部记录", value: "all" },
        { name: "手动保存", value: "handleSave" },
      ],
      currentSettingTab: 'all',
      contentValue:'',
    }
  },
  computed:{
    timeType(){
      if(this.versions.length){
        const time = this.formatTimestamp(this.versions[this.selIndex]?.createTime, true)
        const type = this.versions[this.selIndex]?.isAutoSave?'手动保存':'自动保存'
        return ' ' + time + '·' + type
      }else{
        return ''
      }
    },
    selList(){
      if(this.currentSettingTab == 'all'){
        return this.versions
      }else{
        return this.versions.filter(item=>{
          return item.isAutoSave
        })
      }
    }
    
  },
  watch:{
    noteId:{
      async handler() {
        this.versions = await this.getHistory(this.noteId)
        if (this.versions.length > 0) {
          this.selectVersion = this.versions[0]
        }
      },
      immediate:true
    },
    selIndex:{
      handler(newVal, oldVal) {
        this.getHistoryContent()
      },
      immediate:true
    },
  },
  mounted(){
    
    this.getHistoryContent()
  },
  methods:{
    ...mapActions(noteStore,['saveAppNote']),
    // formatTime,
    getHistoryContent(){
      if(this.$refs.historyEditor){
        this.$refs.historyEditor?.setEditorValue(this.selectVersion?.content);
        this.contentValue = this.$refs.historyEditor?.getContent();
      }else{
        setTimeout(()=>{
          this.$refs.historyEditor?.setEditorValue(this.selectVersion?.content);
          this.contentValue = this.$refs.historyEditor?.getContent();
        },500)
      }
    },
    formatTimestamp,
    async getHistory (id) {
      // console.log(id, '要查询的id')
      const result = await tsbApi.db.find({
        selector: {
          noteId: {
            $eq: id
          }
        }
      })
      // console.log(result, '查找到的版本历史')
      const history = result.docs.map(doc => doc)
      // console.log(history, '查找到的历史')
      return history.reverse()
    },
    restore(){
      if (this.versions.length) {
        this.$xtConfirm("确定恢复此版本吗？", `恢复 ${this.formatTimestamp(this.selList[this.selIndex]?.createTime, true)} 为保存的版本。` , {
          ok: () => {
            const tmp = this.selList[this.selIndex]
            this.saveAppNote(tmp?.noteId.slice(5), tmp.content, true).then(res=>{
              this.changeEditorValue(tmp.content)
              this.changeShowVersion(false)
              message.success('版本恢复成功。')
            })
            
          },
          type:'warning'
        });
      }else{
        message.warning('暂无历史版本恢复！')
      }
    },
  }
})
</script>

<template>
  <div class="h-full flex flex-wrap " style="background:var(--main-bg);width:200px;" >
    <div class=" p-3 mb-0">
      <XtTab
        style="height: 32px; width: 176px"
        boxClass="p-1 xt-bg-2"
        :boxStyle="{ 'border-radius': '10px' }"
        :itemStyle="{ 'border-radius': '6px' }"
        v-model="currentSettingTab"
        :list="settingsTab"
      ></XtTab>
    </div>
    <div  class="px-3 w-full xt-scrollbar tab-mb h-full" style="height:520px;">
      <!-- <xt-scrollbar :y="true" :w="false" > -->
        <div @click="selectVersion=version;selIndex = index;" :class="{'xt-bg-2':version===selectVersion}" class="pointer pb-2 flex p-2 rounded-md" v-for="(version,index) in selList"
             style="gap:15px;">
          <div>
            <div class="xt-text" style="font-size: 18px;font-family: '优设标题黑';">
              #{{ versions.length - index }}
            </div>
            <div class="xt-text-2">{{ formatTimestamp(version.createTime, true) }}</div>
            <div class="xt-text-2">{{ version.isAutoSave?'手动保存':'自动保存' }}</div>
          </div>
        </div>
      <!-- </xt-scrollbar> -->
    </div>

  </div>
  <div class="px-4 w-full"  style="max-width: 600px;">
    <div class="w-full flex items-center justify-between" style="height:64px" >
      <div class="flex items-center">
        <div class="xt-text" style="font-size: 18px;font-family: '优设标题黑';">
        #{{ versions.length - selIndex }}
        </div>
        <div class="font-14 xt-text-2 ml-2">{{timeType}}</div>
        </div>
      <div class=" flex">
        <div class="flex items-center pointer justify-center mr-3 button-top" style="width: 97px;" @click="restore">
          恢复此版本
        </div>
        <div class="flex items-center pointer justify-center mr-3 button-top" style="width: 32px;" @click="changeShowVersion(false)">
          <Icon icon="fluent:dismiss-16-regular" width="16" height="16"/>
        </div>
      </div>
    </div>
    
    <div class="p-4 w-full overflow-auto rounded-lg xt-scrollbar" style="background:var(--main-bg);height: 520px;"     v-if="selectVersion">
      <!-- v-html="selectVersion.content" -->
      <div v-html="contentValue" class="word-wrap"></div>
      <Markdown ref="historyEditor" class="overflow-hidden" style="width:0;height:0;"></Markdown>
      <!-- setEditorValue -->
    </div>
  </div>
</template>

<style scoped lang="scss">
  .word-wrap{
    word-wrap: break-word;
  }
  .button-top{
    height: 32px;
    border-radius: 8px !important;
    background: var(--secondary-bg);
  }
    ::-webkit-scrollbar-thumb {
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }

    ::-webkit-scrollbar-thumb:hover {
        background-color: #999; /* 悬停时滚动条颜色 */
    }

    ::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }

    .tab-mb:not(:nth-last-of-type()){
      margin-bottom: 4px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background-color: #999; /* 悬停时滚动条颜色 */
    }

    ::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }

</style>
