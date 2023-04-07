<template>
<div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    我的收藏 {{ myPapers.length }}  
</div>
<div class="pointer" style="position: fixed;right: 2em;top: 5.5em">
  <div @click="playAll" class="bg-white bg-opacity-5 rounded-lg list-hover"  style="display: inline-block;margin-right: 1em;padding: 10px;">
    <span>
      <Icon style="font-size: 2em;vertical-align: top" icon="bofang"></Icon>
    </span>
    <span  style="font-size:1.2em">轮播全部</span>
  </div>
  <div  @click="playActive" class="bg-white bg-opacity-5 rounded-lg list-hover" style="display: inline-block; margin-right: 1em;padding: 10px;">
      <span>
        <Icon style="font-size: 2em;vertical-align: top" icon="bofang"></Icon>
      </span>
      <span  style="font-size:1.2em">激活壁纸（ {{activePapers.length}} ）</span>
  </div>
  <div @click="this.visibleImport=true" class="bg-white bg-opacity-5 rounded-lg list-hover" style="display: inline-block;margin-right: 1em;padding: 10px;">
     <span>
      <Icon  style="font-size: 2em;vertical-align: top;margin-right: 0.2em;" icon="tianjiawenjianjia"></Icon>
     </span>
     <span style="font-size:1.2em;">导入</span>
  </div>
</div>

<div>
  <vue-custom-scrollbar  id="containerWrapper" :settings="settingsScroller" style="height: 80vh">
    <viewer :images="myPapers" :options="options">
      <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
        <a-col class="image-wrapper " v-for="img in myPapers" :span="6" style="">
          <img @contextmenu.prevent="showMenu(img)" @error="deleteAll(img)" :data-source="img.path" :alt="img.resolution" class="image-item pointer" :src="fileImageExtension(img) === true ? img.path : img.src" style="position: relative">
          <div @click="previewVideo(img)" v-if="fileImageExtension(img) === true" class="play-icon pointer" style="">
            <Icon icon="bofang" style="font-size:3em;margin-top: 8px"></Icon>
          </div>
          <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
            <div @click.stop="addToActive(img)" class="bottom-actions pointer" :style="{background:isInActive(img)?'rgba(255,0,0,0.66)':''}">
             <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
             <Icon v-else style="" icon="yiwancheng"></Icon>
            </div>
          </div>
          <div id="mse" v-if="fileImageExtension(img) === true"></div>
        </a-col>
      </a-row>
    </viewer>
   </vue-custom-scrollbar>
</div>


<a-drawer v-model:visible="visibleMenu" placement="bottom">
  <a-row :gutter="20" style="text-align: center">
    <a-col :span="4">
      <div @click="setDesktopPaper" class="btn">
        <Icon style="font-size: 3em" icon="tianjia1"></Icon>
        <div>设置为桌面壁纸</div>
      </div>
    </a-col>

    <a-col>
      <div  @click="add()" class="btn">
        <Icon style="font-size: 3em" icon="xiazai"></Icon>
        <div>下载该壁纸</div>
      </div>
    </a-col>

    <a-col :span="2">
      <div class="btn" @click="del()">
        <Icon icon="guanbi2" style="font-size: 3em"></Icon>
        <div>删除该壁纸</div>
      </div>
    </a-col>
  </a-row>
</a-drawer>

<a-drawer v-model:visible="visibleImport" placement="right" class="no-drag">
  <Import :loadStaticPaper="loadStaticPaper"></Import>
</a-drawer>

<div v-show="previewVideoVisible" style="position: fixed;left: 0;right: 0;top: 0;bottom: 0;z-index:9999999" id="previwer">
    <div id="actions" style="position: fixed;right: 2em;top: 2em;z-index: 9999999999;">
      <div @click="closePreview" class="btn pointer" style="background: rgba(0,0,0,0.76);min-width: 4em;">
        <Icon icon="guanbi1" style="font-size: 2em"></Icon>
      </div>
    </div>
    <div id="my-mse"></div>
</div> 
</template>

<script>
import {mapWritableState,mapActions} from 'pinia'
import { appStore } from '../../store'
import Import from './Import.vue'
import {message,Modal} from 'ant-design-vue'
import Spotlight from 'spotlight.js'
const fs=window.$models.fs
const path=require('path')
import { paperStore } from '../../store/paper'
import Player from 'xgplayer/dist/simple_player'
import {defineComponent ,ref} from 'vue'

export default defineComponent({
  name:'My',
  components:{Import},
  computed:{
    ...mapWritableState(paperStore,['settings','activePapers','myPapers']),
  },
  data(){
    return{
      visibleMenu:false,
      visibleImport:false,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      livelyPapers:[],
      currentPaper:null,//当前壁纸，显示菜单用
      paperTime:'',
      livelyTime:'',
      previewVideoVisible:false,
      options:{
        url: 'data-source',
      }
    }
  },
  mounted () {
    if(this.settings.savePath){
      this.getLoadLively()
      this.loadStaticPaper()
    }
    $('#previwer').mousemove(() => {
      $('#actions').show()
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        $('#actions').fadeOut()
      }, 5000)
    })
  },
  methods:{
    ...mapActions(paperStore,['addToActive','addToMyPaper','addToStaticPaper']),
    // 获取本地视频目录数据
    getLoadLively(){
      const videos = fs.readdirSync(path.join(this.settings.savePath,'lively'))
      videos.filter(v=>{
        const livelyItem = {
          src:path.join(this.settings.savePath,'lively',v),
          path:`https://up.apps.vip/lively/${ path.join(path.join(this.settings.savePath,'lively'),v).split("\\")[path.join(path.join(this.settings.savePath,'lively'),v).split("\\").length - 1].split(".")[0]}.jpg`,
          srcProtocol:'file://'+ path.join(this.settings.savePath,'lively',v),
        }
        this.addToStaticPaper(livelyItem)
      })
    },
    // 获取本地图片数据
    loadStaticPaper(){
      const staticDir = path.join(path.join(this.settings.savePath),'static')
      // 判断文件目录是否存在
      fs.pathExists(staticDir).then((exists)=>{
        // 存在就读取指定壁纸目录
        if(exists){
          let promptPaper = fs.readdirSync(staticDir)
          promptPaper.map(el=>{
            this.getFileCreatedTime(path.join(`${staticDir}/${el}`)).then(createTime=>{
              this.paperTime = this.changeTime(createTime)
            }).catch(err=>{
              console.log(err);
            })
            let image = {
              title:false,
              src:`file://${staticDir}/${el}`,
              path:`file://${staticDir}/${el}`,
              time:this.paperTime
            }
            this.addToStaticPaper(image)
          })
        }else{  // 不存在就删除
          this.$emit('error')
        }
      })
    },

    setDesktopPaper(){
      Modal.confirm({
        content:'确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
        okText:'设置桌面壁纸',
        onOk:()=>{
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.currentPaper.path)
          this.visibleMenu= false
        }
      })
    },

    showMenu(item){
      this.currentPaper=item
      this.visibleMenu=true
    },

    playAll(){
      const playArr = []
      this.myPapers.map(el=>{
          playArr.push({
            src:el.path
          })
      })
      window.Spotlight.show(playArr,{
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false,
        fullscreen:true,
      })
    },

    playActive(){
      const playArr = []
      this.activePapers.map(el=>{
        playArr.push({
          src:el.path
        })
      })
      window.Spotlight.show(playArr, {
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false
      })
    },

    // 获取文件时间
    async getFileCreatedTime(filePath){
      try {
       const stats = await fs.stat(filePath);
       return stats.birthtime;
      }catch(err) {
       console.error(err);
      }
    },

    // 时间转换
    changeTime(msec){
      let datetime = new Date(msec);
      let year = datetime.getFullYear();
      let month = datetime.getMonth();
      let date = datetime.getDate();
      let hour = datetime.getHours();
      let minute = datetime.getMinutes();
      let second = datetime.getSeconds();
      return year +  '/' + ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) +  '/' + ((date + 1) < 10 ? '0' + date : date) + ' ' +  ((hour + 1) < 10 ? '0' + hour : hour) + ':' + ((minute + 1) < 10 ? '0' + minute : minute) +  ':' +  ((second + 1) < 10 ? '0' + second : second);
    },
    
    isInActive(image){
      return this.activePapers.findIndex(img=>{
        return image.src===img.src
      })>-1
    },

    // 删除壁纸
    del(){
      const imageExtensions = ['jpg','jpeg','gif','bmp','png']
      if(this.fileImageExtension(this.currentPaper)){
        this.activePapers.filter(img =>{
          if(img.path ===  this.currentPaper.path){
            this.activePapers.splice(this.currentPaper.path,1)
          }
        })
        fs.removeSync(path.join(this.currentPaper.src))
        if(this.myPapers.indexOf(this.currentPaper) !== -1){
          this.myPapers.splice(this.myPapers.indexOf(this.currentPaper),1)
        }
      }else{
        this.activePapers.filter(img =>{
          if(img.path ===  this.currentPaper.path){
            this.activePapers.splice(this.currentPaper.path,1)
          }
        })
        if(this.currentPaper.src.split('//')[0] === 'file:' && imageExtensions.indexOf(this.currentPaper.src.split('.')[1]) !== -1){
          fs.removeSync(path.join(this.currentPaper.src.split('//')[1])) 
          if(this.myPapers.indexOf(this.currentPaper) !== -1){
           this.myPapers.splice(this.myPapers.indexOf(this.currentPaper),1)
          }
        }else{
          if(this.myPapers.indexOf(this.currentPaper) !== -1){
           this.myPapers.splice(this.myPapers.indexOf(this.currentPaper),1)
          }
        }
      }
      this.visibleMenu=false
    },

    // 删除有问题的图片
    deleteAll(img){
      this.myPapers.indexOf(img) !== -1 ? this.myPapers.splice(this.myPapers.indexOf(img),1):''
    },

    closePreview () {
      this.previewVideoVisible = false
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
        window.$xgplayer = null
      }
    },
    // 判断文件是否为图片
    fileImageExtension(filePath){
      const fileExtensions = filePath.src.split('.').pop()
      const extensions = ['mp4','mpeg','avi','rmvb']
      if(extensions.indexOf(fileExtensions) !== -1){
        return true
      }else{
        return false
      }
    },
    // 视频播放
    previewVideo(img){
      $('#actions').show()
      this.timer = setTimeout(() => {
        $('#actions').fadeOut()
      }, 5000)
      this.previewVideoVisible = true
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
      }
      const url = `${img.srcProtocol}`
      window.$xgplayer = new Player({
        id: 'my-mse',
        url: url,
        // fitVideoSize: 'fixWidth',
        fitVideoSize: 'fixWidth',
        // width:300,
        // height:300,
        loop: true,
        fluid: true,
        videoInit: true,
        autoplay: true
      })
    },
    closePreview () {
      this.previewVideoVisible = false
      if (window.$xgplayer) {
        window.$xgplayer.destroy()
        window.$xgplayer = null
      }
    },

  },
})
</script>

<style scoped>
.play-icon {
  position: absolute;
  z-index: 999;
  background: rgba(0, 0, 0, 0.51);
  text-align: center;
  width: 4em;
  height: 4em;
  left: 50%;
  top: 50%;
  border-radius: 100px;
  transform: translate(-50%, -50%);
}
.list-hover:hover{
  background: rgba(255, 255, 255, 0.2);
}
.rotate-center{
  text-align: left !important;
}
</style>