<template>
  <viewer :images="list" :options="options">
    <a-row :gutter="[20,20]" id="bingImages" style="margin-right: 1em">
      <a-col class="image-wrapper " v-for="img in list" :span="6" style="">
        <img @contextmenu.stop="paperShowMenu(img)"  class="image-item pointer" :src="img.src" :data-source="img.path" style="position: relative">
        <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
          <div @click.stop="addToMy(img)" class="bottom-actions pointer" :style="{background:isInMyPapers(img)?'#009d00a8':''}">
            <Icon v-if="!isInMyPapers(img)" icon="tianjia1"></Icon>
            <Icon v-else style="" icon="yiwancheng"></Icon>
          </div>
        </div>
      </a-col>
    </a-row>
  </viewer>
<a-drawer :height="200" v-model:visible="visibleMenu" placement="bottom">
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
    <a-col :span="4">
      <div @click="setAppPaper" class="btn relative">
        <Icon style="font-size: 3em" icon="tianjia1"></Icon>
        <div>设为工作台背景</div>
        <GradeSmallTip powerType="mainWallpaper"></GradeSmallTip>
      </div>
    </a-col>
  </a-row>
</a-drawer>
</template>

<script>
import { mapActions,mapState  } from 'pinia'
import { appStore} from '../../store'
import { paperStore } from '../../store/paper'
import GradeSmallTip from "../GradeSmallTip.vue";
import {message,Modal} from 'ant-design-vue'
export default {
  name: 'PaperList',
  props:['list'],
  components:{
    GradeSmallTip
  },
  data(){
    return{
      options:{
        url: 'data-source',
      },
      visibleMenu:false,
      paperCurrent:null
    }
  },

  mounted () {
  },
  methods:{
    ...mapActions(paperStore,['removeToMyPaper']),
    ...mapActions(appStore,['setBackgroundImage']),
    addToMy(img){
      let image = {
        src:img.src,
        path:img.src
      }
      this.removeToMyPaper(image)
    },
    isInMyPapers(image){
      return this.myPapers.findIndex(img=>{
        return image.src===img.src
      })>-1
    },
    paperShowMenu(item){
      this.paperCurrent = item
      this.visibleMenu = true
    },
    setDesktopPaper(){
      Modal.confirm({
        content:'确定将此壁纸设置为系统桌面壁纸？注意，此处设置不是工作台的壁纸。',
        okText:'设置桌面壁纸',
        onOk:()=>{
          message.info('正在为您下载并设桌面壁纸')
          tsbApi.system.setPaper(this.paperCurrent.src)
          this.visibleMenu = false
        }
      })
    },
    setAppPaper(){
      message.info('正在为您设置壁纸')
      this.setBackgroundImage(this.paperCurrent)
      this.visibleMenu = false
    },
    add(){}
  },
  computed:{
    ...mapState(paperStore,['myPapers']),

    // ...mapState(appStore,[
    //   {
    //     'papers':'appData.wallpapers.myPapers'
    //   }
    // ])
  }
}
</script>

<style  lang="scss">
.bottom-actions {
  color: rgb(234, 234, 234);
  font-size: 1.2em;
  width: 2em;

  height: 2em;
  line-height: 2em;
  background: rgba(0, 0, 0, 0.42);
  border-radius: 0px 6px 0px 6px;
}
.image-item {
  object-fit: cover;
  width: 100%;
  border-radius: 6px;
  aspect-ratio: 16/9;
}
.viewer-toolbar > ul{
li{
  margin-right: 10px;
  margin-left: 10px;
}
zoom: 1.6;
}

</style>
