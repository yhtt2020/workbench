<template>
  <div class="flex">
    <div v-for="item in allList" class="mr-3 flex flex-col s-bg rounded-md">
      <ClipItem :clip="item" @openPreview="getClipShow" style="width:338px;"></ClipItem>
    </div>
  </div>
  <transition name="fade">
    <div class="home-blur" style=" position: fixed; top: 0;right: 0;left: 0;bottom: 0;z-index: 999;" v-if="allClipShow">
      <div class="flex">
         <div class="w-3/4 flex flex-col" style="border-right: 1px solid  rgba(255,255,255,0.10);">
          <div @click="closePreview" style="width:112px;" class="px-5 button-active py-3 s-bg  ml-5 mt-6 flex pointer items-center justify-center rounded-lg">
            <Icon icon="guanbi" style="font-size: 1.5em;"></Icon>
          </div> 
          <div class="w-full flex items-center justify-center" style="margin: 25% 0;" v-if="previewObj.type==='text'">
            <span class="preview-content">{{previewObj.content}}</span>
          </div>
          <div v-if="previewObj.type === 'image'" style="margin:8% 0;" class="w-full flex items-center justify-center">
             <div style="width:800px;height: 450px;" class="rounded-lg">
              <img :src="previewObj.imgUrl" class="rounded-lg" style="width:100%;height: 100%; object-fit: cover;" alt="">
             </div>
          </div>
          <div class="w-full flex items-center justify-center my-6">
             <div class="h-12">
              123
             </div>
          </div>
         </div>
         <div class="w-1/4 px-6  pt-6 flex flex-col items-center justify-between mb-6">
            <div>123</div>
            <div class="h-12">456</div>
         </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ClipItem from '../../components/ClipItem.vue'
import { allList} from '../../js/data/clipboardData'
export default {
  components:{
    ClipItem
  },
  data(){
    return{
      allList, 
      allClipShow:false,  
      previewObj:null   
    }
  },
  methods:{
    getClipShow(v){
      this.allClipShow = v.preview
      this.previewObj = v.content
    },
    closePreview(){
      this.allClipShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-container{
  position: fixed;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
.button-active{
  &:active{
    filter: brightness(0.8);
    background: rgba(42, 42, 42, 0.25);
  }
  &:hover{
    background: rgba(42, 42, 42, 0.25);
  }
}
.preview-content{
  width:600px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: rgba(255,255,255,0.60);
  font-weight: 500;
}
</style>