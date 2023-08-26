<template>
  <div class="flex flex-wrap h-full"
       style="justify-items: center;align-content: start;flex-direction: column;
    justify-content: center;align-items: center;">
    <div class="flex items-center justify-center w-full my-32" v-if="clipList.length === 0">
      <div class="flex items-center justify-center"  >
        <a-empty :image="simpleImage"/>
      </div>
    </div>
    <div   v-for="item in clipList" class="m-2 flex flex-col s-bg rounded-lg">
      <ClipItem :key="item.updateTime" :clipItem="item" @previewItem="getItem"></ClipItem>
    </div>
  </div>
  <ClipTextPreview :previewContent="previewData"></ClipTextPreview>
</template>

<script>
import ClipItem from '../components/ClipItem.vue';
import ClipTextPreview from '../components/clipPreview/ClipTextPreview.vue';
import { Empty } from 'ant-design-vue';
import {toRaw} from "vue";
import { mapWritableState } from 'pinia'
import { clipboardStore } from '../store'
export default {
  components:{
    ClipItem,
    ClipTextPreview
  },
  props:{
    clipList:{
      type:Array,
      default:()=>[]
    }
  },
  data(){
    return{
      simpleImage: '/public/img/test/not-data.png',
      previewData:null
    }
  },
  computed:{
    ...mapWritableState(clipboardStore,['previewShow'])
  },
  methods:{
    // 获取item
    getItem(item){
      console.log('预览',item)
      // this.previewData = v
      switch(item.type){
        case 'text':
          this.previewData = item
          break;
        case 'image':
          const img = toRaw(item.content).toDataURL()
          this.previewData = {
            img,
            timeText:item.timeText,
            type:item.type
          }
          break;
        case 'video':
          this.previewData = item
          break;
        case 'file':
          this.previewData = item
          break;
        case 'audio':
          this.previewData = item
          break;
      }
      this.previewShow=true
    }
  }
}
</script>

<style lang="scss" scoped>
.s-bg{
  box-shadow: none !important;
  background: var(--secondary-bg);
  color: var(--primary-text) !important;
}
</style>
