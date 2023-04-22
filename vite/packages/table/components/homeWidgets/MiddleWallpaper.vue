<template>

  <HomeComponentSlot :options="options" @pickFilterChange="pickFilterChange">
    <div class="absolute inset-0 " style="border-radius: 8px;z-index: -1">
      <div class="h-full w-full flex justify-center items-center" v-if="imgList.length<=0">
        <a-empty :image="simpleImage" />
      </div>
      <div class="h-full w-full" v-else>
        <video class="fullscreen-video" style="border-radius: 8px;object-fit: cover" playsinline="" autoplay="" muted="" loop="" v-if="currentImg.srcProtocol">
        <source :src="currentImg.srcProtocol" type="video/mp4" id="bgVid">
        </video>
      <img :src="currentImg.path" alt="" class="h-full w-full" style="border-radius: 8px;object-fit: cover" v-else>

    </div>
    </div>
    <div class="flex flex-row absolute bottom-4 justify-between" style="width: 543px">
      <div class="item-icon flex justify-center items-center pointer" @click="lastImg"> <Icon class="icon"  icon="caret-left"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="nextImg"> <Icon class="icon"  icon="caret-right"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="randomImg"> <Icon class="icon " :class="randomFlag?'replace-it':''"  icon="reload"></Icon></div>
      <div class="item-icon flex justify-center items-center pointer" @click="collect" v-if="addressType.name!=='my'">
        <Icon v-if="!isInMyPapers()" icon="star"></Icon>
        <Icon v-else style="fill: yellow" icon="star-fill"></Icon>
      </div>
      <div class="item-icon flex justify-center items-center pointer" @click="settingImg"> <Icon class="icon"  icon="desktop"></Icon></div>
    </div>
  </HomeComponentSlot>

</template>

<script>
import HomeComponentSlot from "./HomeComponentSlot.vue";
import axios from 'axios';
import {mapActions, mapWritableState} from "pinia";
import { Empty } from 'ant-design-vue';
import {paperStore} from "../../store/paper";
import {appStore} from "../../store";
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
      imgIndex:0,
      randomFlag:false
    }
  },
  methods:{
    ...mapActions(paperStore, ["removeToMyPaper"]),
    ...mapActions(appStore, ['setBackgroundImage']),
    pickFilterChange(e){
        this.addressType = e
      if(this.addressType.path !=='') {
        axios.get(this.addressType.path,{

        }).then(res => {
          this.imgList=[]
          if(res.data.data){
            let pickImage = res.data.data
            this.count = res.data.count
            let animations = ["ani-gray", "bowen", "ani-rotate"];
            if(pickImage){

              pickImage.forEach(img=>{
                if(img.thumburl !== null){
                  let randomIndex = Math.floor(Math.random() * animations.length);
                  const image = {
                    title:false,
                    src:img.thumburl,
                    path:img.imgurl,
                    resolution:img.size,
                    score:img.score,
                    no:img.no,
                    animations: animations[randomIndex],
                  }
                  this.imgList.push(image)
                }
              })
            }
          }else{
            let images = res.data.images
            let animations = ['ani-gray', 'bowen', 'ani-rotate']
            if (images) {
              images.forEach(img => {
                let random = Math.random()
                let randomIndex = Math.floor((Math.random() * animations.length))
                let image = {
                  title: false,// img.title,
                  src: 'https://cn.bing.com' + img.url,
                  path: 'https://cn.bing.com' + img.url,
                  animation: animations[randomIndex]//['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
                }
                this.imgList.push(image)
              })
            }
          }
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


    },
    lastImg(){
      this.imgIndex-=1
      if(this.imgIndex < 0){
        this.imgIndex = this.imgList.length -1
      }
    },
   async nextImg(){

      // if(this.imgIndex>=this.imgList.length-1){
      //   if(this.addressType.name ==='picking') {
      //
      //       let res = await  axios.get(this.addressType.path, {
      //         params: {
      //           no: 5
      //         }
      //       })
      //     if(res.data.data){
      //       let pickImage = res.data.data
      //       this.count = res.data.count
      //       let animations = ["ani-gray", "bowen", "ani-rotate"];
      //       if(pickImage){
      //         pickImage.forEach(img=>{
      //           if(img.thumburl !== null){
      //             let randomIndex = Math.floor(Math.random() * animations.length);
      //             const image = {
      //               title:false,
      //               src:img.thumburl,
      //               path:img.imgurl,
      //               resolution:img.size,
      //               score:img.score,
      //               no:img.no,
      //               animations: animations[randomIndex],
      //             }
      //             this.imgList.push(image)
      //           }
      //         })
      //       }
      //
      //     }else{
      //       this.imgIndex = 0
      //     }
      //
      //   }else {
      //     this.imgIndex = 0
      //   }
      //
      // }
      this.imgIndex+=1
     if(this.imgIndex >= this.imgList.length){
       this.imgIndex = 0
     }
    },
    randomImg(){
      if(this.randomFlag===true)return
      this.randomFlag = true
      setTimeout(()=>{
        this.randomFlag = false
        let nmb =  parseInt((Math.random()*(this.imgList.length)))
        this.imgIndex === nmb ? this.randomImg():this.imgIndex = nmb
      },500)

    },
    collect(){
      if(this.addressType.name ==='picking'){
        this.removeToMyPaper(this.imgList[this.imgIndex]);
      }else if(this.addressType.name ==='bing'){
        let image = {
          src:this.imgList[this.imgIndex].src,
          path:this.imgList[this.imgIndex].src
        }
        this.removeToMyPaper(image)
      }


    },
    settingImg(){
      if(this.addressType.name ==='my'){
        if (this.imgList[this.imgIndex].srcProtocol) {
          this.setBackgroundImage({
            path:'',
            runpath:`file://${this.imgList[this.imgIndex].src}`
          })
        }else{
          if(!this.imgList[this.imgIndex].path){
            this.imgList[this.imgIndex].path =  this.imgList[this.imgIndex].src
          }

          this.setBackgroundImage(this.imgList[this.imgIndex])
        }
      }else{
        this.setBackgroundImage(this.imgList[this.imgIndex])
      }


    },
    isInMyPapers() {
      return (
        this.myPapers.findIndex((img) => {
          return this.imgList[this.imgIndex].src === img.src;
        }) > -1
      );
    },
  },
  computed:{
    ...mapWritableState(paperStore, ['myPapers']),
  },
  mounted() {
   // this.myPapers.pop()
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
