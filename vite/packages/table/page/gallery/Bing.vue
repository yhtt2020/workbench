<template>
  <div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    必应壁纸
  </div>
  <vue-custom-scrollbar  id="containerWrapper" :settings="settingsScroller" style="height: 80vh">
    <!--            <lightgallery id="container"-->
    <!--                          :settings="settings"-->
    <!--                          :onInit="onInit"-->
    <!--                          :onBeforeSlide="onBeforeSlide"-->
    <!--            >-->
    <!--              <a class="gallery-item" v-for="image in images" :data-lg-size='image.lgSize' :data-src="image.src"-->
    <!--                 :data-sub-html='image.subHtml'>-->
    <!--                <img-->
    <!--                  class="img-responsive"-->
    <!--                  :src="image.url"-->
    <!--                />-->
    <!--              </a>-->
    <!--            </lightgallery>-->
    <div data-fit="cover" class="spotlight-group" data-control="autofit,page,fullscreen,close,zoom" data-play="true"
         data-autoslide="true" data-infinite="true" id="container">
      <a class="spotlight " v-for="img  in bingImages" :data-lg-size='img.lgSize' :href="img.src">
        <img :src="img.src" data-animation="my-rotate"/>
      </a>
    </div>
   <PaperList :list="bingImages"></PaperList>
  </vue-custom-scrollbar>
</template>

<script>
import axios from 'axios'
import Spotlight from 'spotlight.js'
import justifiedGallery from 'justifiedGallery'
import { appStore } from '../../store'
import {mapActions} from 'pinia'
import PaperList from '../../components/comp/PaperList.vue'
import { paperStore } from '../../store/paper'

export default {
  name: 'Bing',
  components:{PaperList},
  data () {
    return {
      page: 1,
      isLoading:false,
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
  mounted () {
    $('.image-wrapper').on('touchmove',(e)=>{
      console.log(e,'华东')
      e.stopPropagation()
    })
    $('.image-item').on('touchend',(e)=>{
      console.log(e,'结束')
    })
    justifiedGallery()
    $('#container').justifiedGallery({
      captions: false,
      lastRow: 'hide',
      rowHeight: 180,
      margins: 5
    })
    $('#containerWrapper').scroll(() => {
      if ($('#containerWrapper').scrollTop() +$('#containerWrapper').height()+20>= $('#bingImages').prop('scrollHeight') && this.isLoading===false) {
        this.page=this.page+1
        this.getBingWallPaper( this.page)
      }
    })

    this.getBingWallPaper(this.page++)
    this.getBingWallPaper(this.page++)

  },
  methods: {
    ...mapActions(paperStore,['addToMyPaper']),

    getBingWallPaper (page) {
      this.isLoading=true
      const axios = require('axios')
      let url=`https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${page}&n=8`
      console.log(url)
      let imagesResult = axios.get(url).then((imagesResult) => {
        if (imagesResult.status === 200) {
          let images = imagesResult.data.images
          console.log(images)
          //let animations = ['a-fadeout','a-fadeoutT', 'a-fadeoutR', 'a-fadeoutB', 'a-fadeoutL','a-rotateoutLT', 'a-rotateoutLB', 'a-rotateoutRT', 'a-rotateoutRB', 'a-flipout', 'a-flipoutX', 'a-flipoutY']
          let animations = ['ani-gray', 'bowen', 'ani-rotate']
          if (images) {
             images.forEach(img => {
                let random = Math.random()
                let randomIndex = Math.floor((Math.random() * animations.length))
                let image = {
                  title: false,// img.title,
                  src: 'https://cn.bing.com' + img.url,
                  animation: animations[randomIndex]//['gray','rate'][(Math.random()*2).toFixed()]//''slide','fade','scale',
                }
              this.bingImages.push(image)
              })
            this.$nextTick(()=>{
              this.isLoading=false
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


</style>
