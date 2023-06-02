<template>
  <div class="flex">
    <div v-for="item in textList" style="width:338px;" class="mr-3 flex flex-col s-bg rounded-md">
      <ClipItem :clip="item" @openPreview="getClipShow"></ClipItem>
    </div>
  </div>
  <ClipTextPreview :textShow="allClipShow" :textPreview="previewObj" @closeText="allClipShow = false"></ClipTextPreview>
</template>

<script>
import ClipItem from '../../components/ClipItem.vue'
import ClipTextPreview from '../../components/clipPreview/ClipTextPreview.vue'
import { textList } from '../../js/data/clipboardData'
export default {
  components:{
    ClipItem,
    ClipTextPreview
  },
  data(){
    return{
      textList,
      allClipShow:false,
      previewObj:null,
    }
  },
  methods:{
    getClipShow(v){
      this.allClipShow = v.preview
      this.previewObj = v.content
    },
  }
}
</script>

<style lang="scss" scoped>

</style>