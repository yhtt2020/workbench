<template>
<!-- class="main"  text-align: center;-->
<div id="galleryContainer"  style="padding-top: 2em;">
  <div class="w-auto flex">
     <div class="float-left">
       <div :onClick="goHome" class="w-36 h-12 text-2xl cursor-pointer bg-black rounded-lg flex bg-opacity-10 justify-center items-center" style="margin-bottom: 12px;">
        <Icon icon="xiangzuo"></Icon> 
        <span>返回</span>
       </div>
       <div class="menu"  :class="{'active':activeIndex == menu.index}" v-for="(menu) in menus" @click="change(menu)">
        <Icon v-if="menu.icon" :icon="menu.icon" style=" font-size: 1.319em;"></Icon> 
        <span style="margin-left: 0.1em;"> {{ menu.title }}</span>
       </div> 
     </div>
     <div id="parentScroller" style="margin-left: 5em">
      <router-view></router-view>
     </div>
  </div>
</div>
</template>

<script>
import { defineComponent,ref } from 'vue';
export default defineComponent({
  name:'Gallery',
  data: () => ({
    tab: '',
    menus: [
      {
        index: 'm',
        title: '我的收藏',
        icon:'xihuan',
        route:
          {
            name: 'my'
          }
      },
      {
        title: '必应壁纸',
        index: 'b',
        icon:'bing',
        route:
          {
            name: 'bing',

          }
      },
      {
        title: 'Wallheaven',
        index: 'w',
        icon:'lu',
        route:
          {
            name: 'wallheaven'
          }
      },
      {
        index:'p',
        title:'拾光壁纸',
        icon:'wallpaper',
        route:{
          name:'PickingPaper'
        }
      },
      {
        index: 'l',
        title: '动态壁纸',
        icon:'a-zujiantianchong_huaban1fuben7',
        route:
          {
            name: 'lively'
          }
      },
      {
        index: 's',
        title: '设置',
        icon:'shezhi',
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
    activeIndex: '',
  }),
  mounted(){
    $('#galleryContainer').on('touchend',(e)=>{
      e.stopPropagation();
    })
    this.activeIndex = this.menus[0].index
  },
  methods:{
    change(menu){
      this.activeIndex = menu.index
      this.$router.push(menu.route)
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
    goHome(){
      this.$router.push({
        name:'home'
      })
    },
    onInit: () => {
      console.log('lightGallery has been initialized')
    },
    onBeforeSlide: () => {
      console.log('calling before slide')
    },
  },

})
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