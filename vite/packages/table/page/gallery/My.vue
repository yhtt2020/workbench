<template>
  <div class="rotate-center" style="font-size: 2em;margin-bottom: 1em">
    我的收藏 {{this.mergedArr.length}}
  </div>

  <div class="pointer" style="position: fixed;right: 2em;top: 2em">
    <div  @click="playAll" style="display: inline-block;margin-right: 1em">
      <span>
        <Icon style="font-size: 2em;vertical-align: top" icon="bofang"></Icon>
      </span>
      <span  style="font-size:1.2em">轮播全部</span>
    </div>
    <div  @click="playActive" style="display: inline-block">
      <span>
        <Icon style="font-size: 2em;vertical-align: top" icon="bofang"></Icon>
      </span>
      <span  style="font-size:1.2em">激活壁纸（{{activePapers.length}}）</span>
    </div>
  </div>

<div>
  <vue-custom-scrollbar  id="containerWrapper" :settings="settingsScroller" style="height: 80vh">
    <viewer :images="mergedArr" :options="options">
      <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
        <a-col @click="this.visibleImport=true" class="image-wrapper " :span="6" style="">
          <a-avatar    class="image-item pointer"   style="font-size:2em;position: relative; line-height: 144.20px; height: 144.2px; background: rgba(10,10,10,0.31)">
            <Icon  style="font-size: 1.3em;vertical-align: text-bottom" icon="tianjiawenjianjia"></Icon> 导入
          </a-avatar>
        </a-col>
        <a-col class="image-wrapper " v-for="img in mergedArr" :span="6" style="">
          <div v-show="fileImageExtension(img) === false">
            <img @contextmenu.stop="showMenu(img)" @error="deleteAll(img)" :data-source="img.path ? img.path : img.src" :alt="img.resolution"  class="image-item pointer" :src="img.src" style="position: relative">
            <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
             <div @click.stop="addToActive(img)" class="bottom-actions pointer" :style="{background:isInActive(img)?'rgba(255,0,0,0.66)':''}">
              <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
              <Icon v-else style="" icon="yiwancheng"></Icon>
             </div>
            </div>  
          </div>
          <div v-show="fileImageExtension(img) === true">
            <div>
              <img @contextmenu.stop="visibleMenu=true" class="image-item del-image pointer"
              :src="img.img_src"  :data-source="img.img_src" style="position: relative">
              <div @click="previewVideo(img)" class="play-icon pointer" style="">
               <Icon icon="bofang" style="font-size:3em;margin-top: 8px"></Icon>
              </div>
              <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
               <div @click.stop="addToActive(img)" class="bottom-actions pointer" :style="{background:isInActive(img)?'rgba(255,0,0,0.66)':''}">
                <Icon v-if="!isInActive(img)" icon="tianjia1"></Icon>
                <Icon v-else style="" icon="yiwancheng"></Icon>
               </div>
               </div>  
              <div id="mse"></div>
             </div>
          </div>
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

  <a-drawer v-model:visible="visibleImport" placement="right">
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
const fs=require('fs-extra')
const path=require('path')
import { paperStore } from '../../store/paper'
import Player from 'xgplayer/dist/simple_player'

export default {
  name: 'My',
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
  components:{Import},
  computed:{
    ...mapWritableState(paperStore,['settings','activePapers','myPapers']),
    mergedArr(){
      return [...this.myPapers,...this.livelyPapers].sort((a,b)=>{
        return new Date(a.time) - new Date(b.time);
      })
    }, 
    
 
  },
  mounted () {
    if(this.settings.savePath){
      this.loadLivelyPapers()
      this.loadStaticPaper()
    }
    console.log(this.myPapers);
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
    ...mapActions(paperStore,['addToActive','addToMyPaper']),
    showMenu(item){
      this.currentPaper=item
      this.visibleMenu=true

    },
    setDesktopPaper(){
      Modal.confirm({
        content:'确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
        okText:'设置桌面壁纸',
        onOk:()=>{
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.currentPaper.src)
        }
      })
    },
    loadLivelyPapers(){
      let videos=fs.readdirSync(path.join(this.settings.savePath,'lively'))
      videos.filter(el=>{
        const livePath = path.join(path.join(this.settings.savePath,'lively'),el)
        this.getFileCreatedTime(livePath).then(createTime=>{
          const returnTime = this.changeTime(createTime) 
          const imgFileName = path.join(path.join(this.settings.savePath,'lively'),el).split("\\")[path.join(path.join(this.settings.savePath,'lively'),el).split("\\").length - 1].split(".")[0]
          let livelyItem = {
           src:path.join(livePath),
           img_src:`https://up.apps.vip/lively/${imgFileName}.jpg`,
           srcProtocol:'file://'+ livePath,
           time:returnTime
          }
          this.livelyPapers.push(livelyItem)
        }).catch(err=>{
          console.log(err);
        })
      })
    },
    isInActive(image){
      return this.activePapers.findIndex(img=>{
        return image.src===img.src
      })>-1
    },
    playAll(){
      window.Spotlight.show(this.mergedArr,{
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
      // console.log('active')
      window.Spotlight.show(this.activePapers, {
        control: 'autofit,page,fullscreen,close,zoom,prev,next',
        play: true,
        autoslide: true,
        infinite: true,
        progress: false,
        title: false
      })
    },


    // 删除壁纸
    del(){
      // if(this.myPapers.indexOf(this.currentPaper) !== -1){
      //   this.myPapers.splice(this.myPapers.indexOf(this.currentPaper),1)
      //   this.visibleMenu = false
      // }  
      // this.mergedArr.forEach(el=>{
      //   console.log(el[3]);
      //   // if(this.fileImageExtension(el)){
      //   //   console.log(el.src);
      //   // }else{
      //   //    if(el.src){
      //   //     // console.log(el[this.myPapers].src);
      //   //     console.log(el[this.myPapers.indexOf(this.currentPaper)]);
      //   //     // const staticDir = path.join(path.join(this.settings.savePath),'static')
      //   //     // fs.removeSync(path.join(staticDir,`${this.myPapers[this.myPapers.indexOf(this.currentPaper)].src.split("//")[1].split('\\')[this.myPapers[this.myPapers.indexOf(this.currentPaper)].src.split("//")[1].split('\\').length-1].split('/')[this.myPapers[this.myPapers.indexOf(this.currentPaper)].src.split("//")[1].split('\\')[this.myPapers[this.myPapers.indexOf(this.currentPaper)].src.split("//")[1].split('\\').length-1].split('/').length-1]}`))
             
      //   //    }else{
      //   //     return
      //   //    }
      //   // }
      // }) 
        
    },
    // 下载壁纸
    add(){},

     // 删除有问题的图片
     deleteAll(img){
      this.myPapers.indexOf(img) !== -1 ? this.myPapers.splice(this.myPapers.indexOf(img),1):''
    },
    loadStaticPaper(){
      const staticDir = path.join(path.join(this.settings.savePath),'static')
      // 判断文件目录是否存在 
      fs.pathExists(staticDir).then((exists)=>{
        if(exists){
          // 存在读取指定壁纸目录
          let promptPaper = fs.readdirSync(staticDir)
          promptPaper.forEach(el=>{
            this.getFileCreatedTime(path.join(`${staticDir}/${el}`)).then(createTime=>{
              this.paperTime = this.changeTime(createTime)
            }).catch(err=>{
              console.log(err);
            })
            let image = {
              title:false,
              srcProtocol:'',
              src:`file://${staticDir}/${el}`,
              time:this.paperTime
            }
            this.addToMyPaper(image)
          })
        }else{
          this.$emit('error') 
        }
      }).catch(err=>{
        console.log(err);
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

    // 判断文件是否为图片
    fileImageExtension(filePath){
      const fileExtensions = filePath.src.split('.').pop()
      const extensions = ['mp4','mpeg','avi','rmvb']
      if(extensions.indexOf(fileExtensions) !== -1){
        return true
      }else{
        return false
      }
    }
  }
}
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
</style>
