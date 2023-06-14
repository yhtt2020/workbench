<template>
  <div class="flex">
    <div class="flex items-center justify-center w-full" v-if="clipList.length === 0">
      <div class="flex items-center justify-center"  >
        <a-empty :image="simpleImage"/>
      </div>
    </div>
    <div v-else v-for="item in clipList" class="mr-3 flex flex-col s-bg rounded-lg" >
      <ClipItem :clip="item" @previewItem="getItem"></ClipItem>
    </div>
  </div>
  <ClipTextPreview :previewContent="previewData"></ClipTextPreview>
</template>

<script>
import ClipItem from '../../components/clipPreview/ClipItem.vue';
import ClipTextPreview from '../../components/clipPreview/ClipTextPreview.vue';
import { Empty } from 'ant-design-vue';
import {toRaw} from "vue";
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
  methods:{
    // 获取item
    getItem(v){
      // this.previewData = v
      switch(v.type){
        case 'text':
          this.previewData = v
          break;
        case 'image':
          const img = toRaw(v.content).toDataURL()
          this.previewData = {
            img,
            timeText:v.timeText,
            type:v.type
          }
          break;
        case 'video':
          this.previewData = v
          break;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.s-bg{
  box-shadow: none !important;
}
</style>