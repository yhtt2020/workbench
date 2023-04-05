<template>
  <div class="flex w-full justify-between items-center" style="margin-bottom: 16px;">
       <div class="w-96 h-12 flex items-center">
          <div class="w-80 h-12 bg-black bg-opacity-10 rounded-lg flex items-center ">
              <div class="w-20 h-12 flex items-center justify-center" style="border-right: 1px solid rgba(255, 255, 255, 0.1);">壁纸源</div>
              <a-select class="w-full" :bordered="false" v-model:value="pickFilterValue" @change="pickFilterChange($event)">
                <!-- <a-select-option value="">ONE • 一个</a-select-option> -->
                <a-select-option value="/timeline/v2">拾光</a-select-option>
                <a-select-option value="/glutton/journal">贪食鬼</a-select-option>
                <a-select-option value="/wallhaven/v2">wallhaven</a-select-option>
              </a-select>
          </div>
       </div>
       <div class="w-48 h-12 flex items-center">
          <div class="w-2/5 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10" @click="openFilter">
            <Icon icon="filter" style="font-size: 1.715em;"></Icon>
            <span style="font-size: 1.15em;">筛选</span>
          </div>
          <div class="w-12 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10" @click="openInfo" style="margin-left: 12px;">
            <InfoCircleOutlined style="font-size: 1.715em;"/>
          </div>
       </div>
  </div>

  <vue-custom-scrollbar  id="pick-wrapper" :settings="settingsScroller" style="height: 80vh">
    <div  style="display: flex; align-items: center; justify-content: center;">
      <a-spin  v-if="isLoading" />
    </div>
    <viewer :images="pickDataList" :options="options">
      <a-row :gutter="[20,20]" id="pick-images" style="margin-right: 1em">
        <a-col class="image-wrapper " v-for="img in pickDataList" :span="6" style="">
          <img  class="image-item pointer" :src="img.src"  :data-source="img.path"  :alt="img.resolution"  style="position: relative">
          <div style="position: absolute;right: 0;top: -10px ;padding: 10px">
            <div @click.stop="addToMy(img)" class="bottom-actions pointer" :style="{background:isInMyPapers(img)?'#009d00a8':''}">
              <Icon v-if="!isInMyPapers(img)" icon="tianjia1"></Icon>
              <Icon v-else style="" icon="yiwancheng"></Icon>
            </div>
          </div>
        </a-col>
      </a-row>
    </viewer>
  </vue-custom-scrollbar>

  <a-drawer v-model:visible="pickFilterShow" title="筛选" style="text-align: center !important;" class="no-drag">
     
  </a-drawer>

  <a-drawer v-model:visible="pickInfoShow" title="信息" style="text-align: center !important;" class="no-drag">
      <div class="flex w-full   justify-center items-center flex-col">
          <div class="w-60" style="margin: 50%;">
            <div class="flex" style="margin-bottom: 12px;">
              <span style="margin-right: 16px;">壁纸源</span>
              <span>ONE • 一个</span>
            </div>
            <div class="flex" style="margin-bottom: 12px;">
              <span style="margin-right: 30px;">简介</span>
              <span>复杂的世界里，一个就够了</span>
            </div>
            <div class="flex items-center">
              <span style="margin-right: 30px;">官网</span>
              <span class="w-40 h-12 flex items-center rounded-lg cursor-pointer justify-center bg-black bg-opacity-10" @click="toOfficialWebsite">
                访问官网
              </span>
            </div>
          </div>
      </div>
      <template #footer>
        <span>「拾光壁纸」提供技术支持</span>
      </template>
  </a-drawer>
</template>

<script>
import axios from 'axios';
import {InfoCircleOutlined} from '@ant-design/icons-vue'
import { paperStore } from "../../store/paper";
import { mapActions, mapState } from "pinia";
import justifiedGallery from "justifiedGallery";
export default {
  name:'Picking',
  components:{
    InfoCircleOutlined
  },
  data(){
    return{
      pickFilterValue:'/glutton/journal',
      pickDataList:[],
      pickFilterShow:false,
      pickInfoShow:false,
      options:{
        url: 'data-source',
      },
      isLoading:false,
    }
  },
  computed: {
    ...mapState(paperStore, ["myPapers"]),
  },
  mounted(){
    // this.getPickPaperData(this.pickFilterValue);
    // justifiedGallery();
    // $("#container").justifiedGallery({
    //   captions: false,
    //   lastRow: "hide",
    //   rowHeight: 180,
    //   margins: 5,
    // });
    // $("#pick-wrapper").scroll(() => {
    //   if ($("#pick-wrapper").scrollTop() +  $("#pick-wrapper").height() + 20 >= $("#pick-images").prop("scrollHeight") && this.isLoading === false) {
    //     // this.getPickPaperData(this.page);
        
    //   }
    // });
    // this.getPickPaperData(this.page ++)
    // this.getPickPaperData(this.page ++)
  },
  methods:{
    ...mapActions(paperStore, ["removeToMyPaper"]),
    pickFilterChange(e){
      this.pickFilterValue = e;
      this.getPickPaperData(this.pickFilterValue)
    },
    getPickPaperData(val){
      const url = `https://api.nguaduot.cn${val}`;
      console.log(url);
      if(!this.isLoading){
        this.isLoading = true;
        axios.get(url).then(res=>{
          console.log(res.data.data);
          let pickImageData = res.data.data;
          let animations = ["ani-gray", "bowen", "ani-rotate"];
          if(pickImageData){
            pickImageData.forEach(img => {
              let randomIndex = Math.floor(Math.random() * animations.length);
              const image = {
                title: false,
                src: img.thumburl,
                path: img.imgurl,
                resolution:img.size,
                animations: animations[randomIndex],
              };
              this.pickDataList.push(image)
            });
            this.$nextTick(() => {
              this.isLoading = false;
            });
          }
        }).catch(err=>{
          return
        })
      }
    },
    openFilter(){
      this.pickFilterShow = true
    },
    openInfo(){
      this.pickInfoShow = true
    },
    // 添加收藏
    addToMy(img) {
      this.removeToMyPaper(img);
    },
    isInMyPapers(image) {
      return (
        this.myPapers.findIndex((img) => {
          return image.src === img.src;
        }) > -1
      );
    },
    // 点击跳转官网
    toOfficialWebsite(){
      ipc.send('addTab',{url:'https://app.nguaduot.cn/timeline'})
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep.ant-drawer-footer{
  border-top: none !important;
}
</style>
