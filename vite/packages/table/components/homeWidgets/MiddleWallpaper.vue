<template>
  <a-spin tip="切换壁纸源中..." :spinning="true">
  <HomeComponentSlot :options="options" @pickFilterChange="pickFilterChange">
    <div class="absolute inset-0 " style="border-radius: 8px;z-index: -1">
      <div class="h-full w-full flex justify-center items-center" v-if="imgList.length<=0">
        <a-empty :image="simpleImage" />
      </div>
      <div class="h-full w-full" v-else>
      <img :src="currentImg.path" alt="" class="h-full w-full" style="border-radius: 8px;object-fit: cover" v-if="currentImg.path!==''">
      <video class="fullscreen-video" style="border-radius: 8px;object-fit: cover" playsinline="" autoplay="" muted="" loop="" v-else>
        <source :src="currentImg.srcProtocol" type="video/mp4" id="bgVid">
      </video>
    </div>
    </div>
    <div class="flex flex-row absolute bottom-4 justify-between" style="width: 543px">
      <div class="item-icon flex justify-center items-center pointer" @click="lastImg"> <Icon class="icon"  icon="caret-left"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="nextImg"> <Icon class="icon"  icon="caret-right"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="randomImg"> <Icon class="icon"  icon="reload"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="collect" v-if="addressType.name!=='my'"> <Icon class="icon"  icon="star"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="settingImg"> <Icon class="icon"  icon="desktop"></Icon></div>
    </div>
  </HomeComponentSlot>
  </a-spin>
</template>

<script>
import HomeComponentSlot from "./HomeComponentSlot.vue";
import axios from 'axios';
import {mapWritableState} from "pinia";
import { Empty } from 'ant-design-vue';
import {paperStore} from "../../store/paper";
export default {
  name: "MiddleWallpaper",
  components:{
    HomeComponentSlot
  },
  data(){
    return {
      options:{
        className:'card double',
        title:'壁纸',
        icon:'image',
        type:'MiddleWallpaper'
      },
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE,
      addressType:{
        value:'我的收藏',
        path:'',
        name:'my'
      },
      imgList:[],
      currentImg:{
        srcProtocol:null,
        path:''
      },
      imgIndex:0
    }
  },
  methods:{
    pickFilterChange(e){
        this.addressType = e
      if(this.addressType.path !=='') {
        axios.get(this.addressType.path).then(res => {
          this.imgList = res.data.data ||  res.data.images
          this.initImg()
        }).catch(err =>{
          this.imgList = []
          this.initImg()
        })
      }else{
        this.imgList = this.myPapers
        this.initImg()
      }
    },
    initImg(){
      this.imgIndex = 0
      this.setImg()
    },
    setImg(){
      this.currentImg =  this.imgList[this.imgIndex] || {
        srcProtocol:null,
        path:''
      }

      if(this.addressType.name ==='bing'){
        this.currentImg = {
          title: false,
          src: 'https://cn.bing.com' + this.currentImg.url,
          path: 'https://cn.bing.com' + this.currentImg.url,
        }
      }
      try{
        if(this.imgList[this.imgIndex].imgurl){
          this.currentImg.path = this.imgList[this.imgIndex].imgurl
        }
        if(this.imgList[this.imgIndex].path===''&&this.currentImg.src){
          this.currentImg.path = this.currentImg.src
        }
        if(this.imgList[this.imgIndex].srcProtocol){
            this.currentImg.path = ''
          }
      }catch (err){

    }

    },
    lastImg(){
      this.imgIndex-=1
      if(this.imgIndex < 0){
        this.imgIndex = this.imgList.length -1
      }
    },
    nextImg(){
      this.imgIndex+=1
      if(this.imgIndex>=this.imgList.length){
        this.imgIndex = 0
      }
    },
    randomImg(){
      let nmb =  parseInt((Math.random()*(this.imgList.length)))
      this.imgIndex === nmb ? this.randomImg():this.imgIndex = nmb
    },
    collect(){},
    settingImg(){}
  },
  computed:{
    ...mapWritableState(paperStore, ['myPapers']),
  },
  mounted() {
    this.imgList = this.myPapers
    this.setImg()
  },
  watch:{
    imgIndex:{
      handler(){
       this.setImg()
      },
    }
  }
}
</script>

<style lang="scss" scoped>
.item-icon{
  width: 100px;
  height: 56px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  .icon{
    height: 36px;
    width: 36px;
  }
}
</style>
