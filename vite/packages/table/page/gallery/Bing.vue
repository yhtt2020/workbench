<template>
  <div class="w-full h-full flex flex-col">
    <div class=" flex items-center justify-between mb-2 " :class="isModal ? 'h-8' : 'h-10'">
      <div class="flex ">
        <xt-new-icon icon="uim:bing" :size="isModal ? 20 : 32" class="mr-2"></xt-new-icon>
        <span  class="xt-text xt-font" :class="isModal ? 'font-14 font-400' : 'font-16 font-600'">必应壁纸</span>
      </div>
      <div v-if="isModal">
        <ClosePaperButton />
      </div>
    </div>

    <div class="flex-1 h-4/5">
      <vue-custom-scrollbar  :settings="settingsScroller" class="grow shrink" style="height: 100%;">
        <div style="height: 8px;"></div>
        <PaperList :list="bingImages" :isModal="isModal"></PaperList>
        <div style="height: 16px;"></div>
      </vue-custom-scrollbar>
    </div>
  </div>

  <!-- <div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    必应壁纸
  </div> -->
  <!-- <vue-custom-scrollbar id="containerWrapper" :settings="settingsScroller" style="margin-top: 1.5em;">
     
               <lightgallery id="container"
                             :settings="settings"
                             :onInit="onInit"
                             :onBeforeSlide="onBeforeSlide"
               >
                 <a class="gallery-item" v-for="image in images" :data-lg-size='image.lgSize' :data-src="image.src"
                    :data-sub-html='image.subHtml'>
                   <img
                     class="img-responsive"
                     :src="image.url"
                   />
                 </a>
               </lightgallery>
    <div data-fit="cover" class="spotlight-group" data-control="autofit,page,fullscreen,close,zoom" data-play="true"
      data-autoslide="true" data-infinite="true" id="container">
      <template v-for="dayImages  in bingImages">
        <div>{{ dayImages.day }}</div>
        <a class="spotlight " v-for="img in dayImages.images" :data-lg-size='img.lgSize' :href="img.src">
          <img :src="img.src" data-animation="my-rotate" />
        </a>
      </template>

    </div>
    <PaperList :list="bingImages"></PaperList>
    <template v-for="dayImages  in bingImages">  </template>
    {{ bingImages.length }}
  </vue-custom-scrollbar> -->
</template>

<script>
import axios from 'axios'
import Spotlight from 'spotlight.js'
import justifiedGallery from 'justifiedGallery'
import { mapActions } from 'pinia'
import _ from 'lodash-es';

import { paperStore } from '../../store/paper'

import PaperList from '../../components/comp/PaperList.vue'
import ClosePaperButton from './components/close/ClosePaperButton.vue'

export default {
  name: 'Bing',

  components: { PaperList,ClosePaperButton },

  props:['isModal'],

  data() {
    return {
      page: 0,
      isLoading: false,
      bingImages: [],//必应壁纸
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }

  },

  mounted() {
    $('.image-wrapper').on('touchmove', (e) => {
      e.stopPropagation()
    })
    $('.image-item').on('touchend', (e) => {
    })
    justifiedGallery()
    $('#container').justifiedGallery({
      captions: false,
      lastRow: 'hide',
      rowHeight: 180,
      margins: 5
    })
    // $('#containerWrapper').scroll(() => {
    //   if ($('#containerWrapper').scrollTop() + $('#containerWrapper').height() + 20 >= $('#bingImages').prop('scrollHeight') && this.isLoading === false) {
    //     this.getBingWallPaper(this.page)
    //     console.log('执行111',this.page);
    //   }
    // })
    
    this.getBingWallPaper(this.page)
    this.page += 8
    this.getBingWallPaper(this.page)

    // this.getBingWallPaper(this.page , () => {
    //   // console.log('执行222',this.page);
    //   // this.getBingWallPaper(this.page).then()
    //   // console.log('执行333',this.page);
    // })

  },

  methods: {
    ...mapActions(paperStore, ['addToMyPaper']),

    getBingWallPaper(page, cb) {
      // if (page > 32) {
      //   return
      // }
      this.isLoading = true
      let url = `https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${page}&n=8`
      let imagesResult = axios.get(url).then((imagesResult) => {
        if (imagesResult.status === 200) {
          // let dayImages = []
          let images = imagesResult.data.images
          //let animations = ['a-fadeout','a-fadeoutT', 'a-fadeoutR', 'a-fadeoutB', 'a-fadeoutL','a-rotateoutLT', 'a-rotateoutLB', 'a-rotateoutRT', 'a-rotateoutRB', 'a-flipout', 'a-flipoutX', 'a-flipoutY']
          let animations = ['ani-gray', 'bowen', 'ani-rotate']
          if (images) {
            for(const img of images){
              let random = Math.random()
              let randomIndex = Math.floor((Math.random() * animations.length));
              let image = {
                title: false,// img.title,
                src: 'https://cn.bing.com' + img.url,
                path: 'https://cn.bing.com' + img.url,
                animation: animations[randomIndex]//['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
              }
              const index  = _.findIndex(this.bingImages,function(find){ return String(find.src) === String(image.src) });
              if(index === -1){
                this.bingImages.push(image)
              }
            }
            
            // images.forEach(img => {
            //   let random = Math.random()
            //   let randomIndex = Math.floor((Math.random() * animations.length))
              // let image = {
              //   title: false,// img.title,
              //   src: 'https://cn.bing.com' + img.url,
              //   path: 'https://cn.bing.com' + img.url,
              //   animation: animations[randomIndex]//['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
              // }
            //   this.bingImages.push(image)
            // })
            // this.bingImages.push({...dayImages})
            this.$nextTick(() => {

              this.isLoading = false
              if (cb) cb()
              // setTimeout(()=>{
              //
              // },500)
            })
          }

        }
      }).catch((err) => {
      })
    },
  }
}
</script>

<style scoped lang="scss">
@import 'justifiedGallery/dist/css/justifiedGallery.min.css';

.s-text {
  text-shadow: none;
}
</style>
