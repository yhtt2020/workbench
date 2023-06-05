<template>
  <div class="flex">
    <div v-for="(item,index) in imageList" style="width:338px;" :key="index" :class="{'active-clip':selectedIndex === index}" class="mr-3 flex flex-col s-bg rounded-md">
      <ClipItem :clip="item" @openPreview="getClipShow"></ClipItem>
    </div>
  </div> 
  <ClipTextPreview :textShow="allClipShow" :textPreview="previewObj" @closeText="allClipShow = false"></ClipTextPreview>
</template>

<script>
import ClipItem from '../../components/ClipItem.vue';
import ClipTextPreview from '../../components/clipPreview/ClipTextPreview.vue'
import { imageList} from '../../js/data/clipboardData'
export default {
  components:{
    ClipItem,
    ClipTextPreview
  },
  data(){
    return{
      imageList,
      allClipShow:false,
      selectedIndex:0,
    }
  },
  mounted(){
    window.addEventListener('keydown',this.listKeyDown)
  },
  methods:{
    getClipShow(v){
      this.allClipShow = v.preview
      this.previewObj = v.content
    }, 
    // 键盘切换状态
    listKeyDown(e){
      const keyCode = e.keyCode
      if(keyCode === 37 && this.selectedIndex > 0){
        this.selectedIndex --
      }else if(keyCode === 39 && this.selectedIndex < this.imageList.length - 1){
        this.selectedIndex ++ 
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('keydown')
  },
}
</script>

<style lang="scss" scoped>
.active-clip{
  border: 6px solid rgba(80,139,254,1);
  &:deep(.clip-top){
    margin-bottom: 0 !important;
  }
  &:deep(.clip-text-center){
    padding-bottom: 28px !important;
  }
}
.s-bg{
  box-shadow:none !important;
}
</style>