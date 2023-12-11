<template>
  <div id="galleryContainer"  style="text-align: center;display: flex;height: 100%">
    <SecondPanel :search="true" :goHome="goHome" :menus="menus" :gallery="gallery" style="padding: 1em; text-align: left; "  @changeTab="changeTab"></SecondPanel>
    <div id="parentScroller" class="grow shrink mx-4 flex flex-col w-full h-full xt-bg p-3 rounded-xl">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
import justifiedGallery from 'justifiedGallery'


import VueCustomScrollbar from '../../../src/components/vue-scrollbar.vue'
import GradeSmallTip from "../components/GradeSmallTip.vue";
import SecondPanel from '../components/SecondPanel.vue'

export default {
  name: 'Gallery',
  components: {
    SecondPanel,
    VueCustomScrollbar,
    GradeSmallTip
  },
  data: () => ({
    tab: '',
    menus: [
      {
        index: 'm',
        title: '我的收藏',
        // icon:'xihuan',
        newIcon:'fluent:star-16-regular',
        route:
          {
            name: 'my'
          }
      },
      {
        title:'精选壁纸',
        index:'w',
        // icon:'',
        newIcon:'fluent:emoji-smile-slight-24-regular',
        route:{
          name:'sift',
        }
      },
      {
        title: '必应壁纸',
        index: 'b',
        // icon:'bing',
        newIcon:'uim:bing',
        route:
          {
            name: 'bing',

          }
      },
      // {
      //   title: 'Wallheaven',
      //   index: 'w',
      //   icon:'lu',
      //   route:
      //     {
      //       name: 'wallheaven'
      //     }
      // },
      {
        index:'p',
        title:'拾光壁纸',
        // icon:'wallpaper',
        newIcon:'fluent:image-multiple-16-regular',
        route:{
          name:'pickingPaper'
        }
      },
      {
        index: 'l',
        title: '动态壁纸',
        // icon:'a-zujiantianchong_huaban1fuben7',
        newIcon:'fluent:image-sparkle-16-regular',
        route:
          {
            name: 'lively'
          }
      },
      {
        index: 's',
        title: '设置',
        // icon:'shezhi',
        newIcon:'fluent:settings-16-regular',
        route:
          {
            name: 'papersSetting'
          }
      },

    ],
    tmp: {
      width: 250,
      height: 400,
      lgSize: '1406-1390',
      src: 'https://images.unsplash.com/photo-1581894158358-5ecd2c518883?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1406&q=80',
      subHtml: `<h4>Photo by - <a href='https://unsplash.com/@entrycube' >Diego Guzmán </a></h4> <p> Location -
          <a href='https://unsplash.com/s/photos/fushimi-inari-taisha-shrine-senbontorii%2C-68%E7%95%AA%E5%9C%B0-fukakusa-yabunouchicho%2C-fushimi-ward%2C-kyoto%2C-japan'>Fushimi Ward,
          Kyoto, Japan</a></p>`,
      url: 'https://images.unsplash.com/photo-1581894158358-5ecd2c518883?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=240&q=80'
    },

    images: [],//当前相册图片
    gallery:true,
  }),
  async mounted () {
    $('#galleryContainer').on('touchend',(e)=>{
      e.stopPropagation();
    })
    // this.$router.push({name:'my'})
    // justifiedGallery()
    // $('#container').justifiedGallery({
    //   captions: false,
    //   lastRow: 'hide',
    //   rowHeight: 180,
    //   margins: 5
    // })

  },
  methods: {
    changeTab (args) {
      this.$router.push(args.menu.route)
      this.tab = args.index
    },
    goLock () {
      this.$router.push('/lock')
    },

    play () {
      window.Spotlight.show(this.bingImages, {
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false
      })
    },
    goHome() {
      this.$router.go(-1)
    }
  },
}
</script>
<style lang="scss" scoped>
@import 'justifiedGallery/dist/css/justifiedGallery.min.css';
.float-left{
  width: 175px;
  height:auto;
  padding: 0 1em;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.menu {
  &:hover {
    background: #696969;
  }
  width: 8em;
  padding-left: 1em;
  font-size: 1.3em;
  height: 3em;
  line-height: 3em;
  border-radius: 0.3em;
  cursor: pointer;
  margin-bottom: 0.5em;
}
</style>

<style>
.s-icon svg {
 filter: none  !important;
}

.s-text {
    text-shadow: none;
}

.spl-pane > * {
  filter: grayscale(0) blur(0);
  transform: rotate(0deg);
  transition: all 4s ease-out, transform 3s linear;
}

.spl-pane>*{
  top:0 !important;
  left: 0 !important;
  width:100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.spl-pane .ani-gray {
  filter: grayscale(1) blur(5px);
  opacity: 0;
}

.spl-pane .ani-rotate {
  display: inline-block;
  transform: rotate(360deg);
}


.spl-scene {
  transition: transform 0.2s ease;
}

/* custom animation "visible state" (css context by custom classname "only-this-gallery" to apply these animation just on a specific gallery) */
.spl-pane > * {
  clip-path: circle(100% at center);
  transition: transform 0.35s ease,
  opacity 0.65s ease,
  clip-path 0.8s ease, filter 3s ease-out;
}

/* custom animation "hidden state" ("custom" is the name of the animation you pass as gallery option) */
/* 波纹动画*/

/* animation state when gallery is hidden */
.spl-pane .bowen {
  clip-path: circle(0px at center);
}

/* animation state when gallery will open */
.spl-pane {
  clip-path: circle(100% at center);
  transition: clip-path 0.65s ease 0.15s;
}

/*.spl-pane > * {*/
/*  transform: rotate(0deg);*/
/*  transition: all 1s ease-out;*/
/*}*/

/*.spl-pane .my-rotate {*/
/*  transform: rotate(180deg)*/
/*}*/
</style>
