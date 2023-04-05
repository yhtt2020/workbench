<template>
  <div class="wallheaven-header">
    <a-row justify="center">
      <a-col class="wallheaven-item" :span="4" v-for="item in wallTitle" :class="wallStatus === item.id ? 'wallheaven-active':''" @click="wallTitleClick(item)"> 
        {{ item.name }}
      </a-col>
    </a-row>
  </div>
  <template v-if="wallStatus === 0">
    <div class="wallheaven-tab">
      <a-radio-group v-model:value="dataObj.purity" style="margin-right: 16px;"  @change="getPurity($event)">
        <a-radio-button value="100" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-left-radius: 8px;border-bottom-left-radius: 8px;">SFW</a-radio-button>
        <a-radio-button value="010" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-right-radius: 8px;border-bottom-right-radius: 8px;">Sketchy</a-radio-button>
      </a-radio-group>
      <a-select ref="select" v-model:value="hotSorting"  style="width:200px;margin-right: 16px;" @change="wallSelectChange($event)">
        <a-select-option value="date_added">最新</a-select-option>
        <a-select-option value="hot">最热</a-select-option>
        <a-select-option value="random">随机</a-select-option>
        <a-select-option value="toplist">热门列表</a-select-option>
        <a-select-option value="favorites">更多收藏</a-select-option>
      </a-select>
      <a-select ref="select" v-model:value="searchObj.wallSizeValue" style="width:200px;margin-right: 16px;" @change="getWallSelectValue($event)">
       <a-select-option value>不限</a-select-option>
       <a-select-option value="1920x1080">1080p+</a-select-option>
       <a-select-option value="2560x1080">2k+</a-select-option>
       <a-select-option value="3840x2160">4k+</a-select-option>
       <a-select-option value="7680x4320">8k+</a-select-option>
      </a-select>
      <a-input v-model:value="searchObj.searchName" placeholder="搜索" style="border:none !important;">
        <template #prefix>
          <SearchOutlined style="cursor: pointer;color: rgba(255, 255, 255, 0.4);"/>
        </template>
      </a-input>
      <a-button type="ghost" class="search-button" @click.stop="getSearchData">搜索</a-button>
    </div>
  </template>
  <template v-if="wallStatus === 1">
    <div class="wallheaven-tab">
      <a-radio-group v-model:value="dataObj.purity" style="margin-right: 16px;"  @change="getPurity($event)">
        <a-radio-button value="100" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-left-radius: 8px;border-bottom-left-radius: 8px;">SFW</a-radio-button>
        <a-radio-button value="010" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-right-radius: 8px;border-bottom-right-radius: 8px;">Sketchy</a-radio-button>
      </a-radio-group>
      <a-select ref="select" v-model:value="acgSorting"  style="width:200px;margin-right: 16px;" @change="wallSelectChange($event)">
        <a-select-option value="date_added">最新</a-select-option>
        <a-select-option value="hot">最热</a-select-option>
        <a-select-option value="random">随机</a-select-option>
        <a-select-option value="toplist">热门列表</a-select-option>
        <a-select-option value="favorites">更多收藏</a-select-option>
      </a-select>
      <a-select ref="select" v-model:value="searchObj.wallSizeValue" style="width:200px;margin-right: 16px;" @change="getWallSelectValue($event)">
       <a-select-option value>不限</a-select-option>
       <a-select-option value="1920x1080">1080p+</a-select-option>
       <a-select-option value="2560x1080">2k+</a-select-option>
       <a-select-option value="3840x2160">4k+</a-select-option>
       <a-select-option value="7680x4320">8k+</a-select-option>
      </a-select>
      <a-input v-model:value="searchObj.searchName" placeholder="搜索" style="border:none !important;">
        <template #prefix>
          <SearchOutlined style="cursor: pointer;color: rgba(255, 255, 255, 0.4);"/>
        </template>
      </a-input>
      <a-button type="ghost" class="search-button" @click.stop="getSearchData">搜索</a-button>
    </div>
  </template>
  <template v-if="wallStatus === 2">
    <div class="wallheaven-tab">
      <a-radio-group v-model:value="dataObj.purity" style="margin-right: 16px;" @change="getPurity($event)">
        <a-radio-button value="100" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-left-radius: 8px;border-bottom-left-radius: 8px;">SFW</a-radio-button>
        <a-radio-button value="010" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-right-radius: 8px;border-bottom-right-radius: 8px;">Sketchy</a-radio-button>
      </a-radio-group>
      <a-select ref="select" v-model:value="peopleSorting"  style="width:200px;margin-right: 16px;" @change="wallSelectChange($event)">
        <a-select-option value="date_added">最新</a-select-option>
        <a-select-option value="hot">最热</a-select-option>
        <a-select-option value="random">随机</a-select-option>
        <a-select-option value="toplist">热门列表</a-select-option>
        <a-select-option value="favorites">更多收藏</a-select-option>
      </a-select>
      <a-select ref="select" v-model:value="searchObj.wallSizeValue" style="width:200px;margin-right: 16px;" @change="getWallSelectValue($event)">
       <a-select-option value>不限</a-select-option>
       <a-select-option value="1920x1080">1080p+</a-select-option>
       <a-select-option value="2560x1080">2k+</a-select-option>
       <a-select-option value="3840x2160">4k+</a-select-option>
       <a-select-option value="7680x4320">8k+</a-select-option>
      </a-select>
      <a-input v-model:value="searchObj.searchName" placeholder="搜索" style="border:none !important;">
        <template #prefix>
          <SearchOutlined style="cursor: pointer;color: rgba(255, 255, 255, 0.4);"/>
        </template>
      </a-input>
      <a-button type="ghost" class="search-button" @click.stop="getSearchData">搜索</a-button>
    </div>
  </template>

  <vue-custom-scrollbar id="wall-container-paper" :settings="settingsScroller" style="height: 80vh">
    <template v-if="wallStatus === 0">
      <div  style="display: flex; align-items: center; justify-content: center;">
        <a-spin  v-if="isLoading" />
      </div>
      <viewer :images="hotHeavenList" :options="options" >
        <a-row :gutter="[20,20]" id="wallImages" style="margin-right: 1em">
          <a-col class="image-wrapper " v-for="img in hotHeavenList" :span="6" style="">
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
      <div v-if="isLoading === false && hotHeavenList.length === 0" class="flex align-center justify-center" style="height: 80vh">
        <a-empty description="未找到图片信息"/>
      </div> 
     </template>
     <template v-if="wallStatus === 1">
      <div  style="display: flex; align-items: center; justify-content: center;">
        <a-spin  v-if="isLoading" />
      </div>
      <viewer :images="acgHeavenList" :options="options" ref="peopleRef" >
        <a-row :gutter="[20,20]" id="wallImages" style="margin-right: 1em">
          <a-col class="image-wrapper " v-for="img in acgHeavenList" :span="6" style="">
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
      <div v-if="isLoading === false && acgHeavenList.length === 0" class="flex align-center justify-center" style="height: 80vh">
        <a-empty description="未找到图片信息"/>
      </div>
    </template>
    <template v-if="wallStatus === 2">
      <div  style="display: flex; align-items: center; justify-content: center;">
        <a-spin  v-if="isLoading" />
      </div>
      <viewer :images="peopleHeavenList" :options="options" ref="peopleRef" >
        <a-row :gutter="[20,20]" id="wallImages" style="margin-right: 1em">
          <a-col class="image-wrapper " v-for="img in peopleHeavenList" :span="6" style="">
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
      <div v-if="isLoading === false &&  peopleHeavenList.length === 0" class="flex align-center justify-center" style="height: 80vh">
        <a-empty description="未找到图片信息"/>
      </div>
    </template>
  </vue-custom-scrollbar>
</template>

<script>
import { defineComponent,ref } from 'vue'
import { SearchOutlined } from "@ant-design/icons-vue";
import axios from "axios";
import justifiedGallery from 'justifiedGallery'
import { paperStore } from "../../store/paper";
import { mapActions, mapState } from "pinia";
import Spotlight from 'spotlight.js'

export default defineComponent({
  name: 'Wallheaven',
  components:{
    SearchOutlined
  },
  data(){
    return{
      wallTitle:[
       {
        id:0,
        name:'热门推荐',
        categories:'111',
        sorting:'hot',
       },
       {
        id:1,
        name:'动漫精选',
        categories:'010',
        sorting:'date_added'
       },
       {
        id:2,
        name:'人物精选',
        categories:'001',
        sorting:'date_added'
       }
      ],
      wallStatus:0,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true,
      },
      purity:'SFW',
      page: 1,
      hotHeavenList:[],
      acgHeavenList:[],
      peopleHeavenList:[],
      hotSorting:'hot',
      acgSorting:'date_added',
      peopleSorting:'date_added',
      isLoading:false,
      dataObj:{
        categories:'111',
        purity:'100',
        sorting:'hot',
      },
      searchObj:{
        wallSizeValue:this.wallSizeValue,
        searchName:'',
        wallSizeValue:'',
      },
      options:{
        url: 'data-source',
      }
    }
  },
  computed: {
    ...mapState(paperStore, ["myPapers"]),
  },
  mounted(){
    justifiedGallery()
    $('#wall-container-paper').scroll(() => {
      if ($('#wall-container-paper').scrollTop() +$('#wall-container-paper').height()+20>= $('#wallImages').prop('scrollHeight') && this.isLoading===false) {
        this.page=this.page+1
        this.getWallHeavenData(this.page)
       }
    })
    this.getWallHeavenData(this.page++)
  },
  methods:{
    ...mapActions(paperStore, ["removeToMyPaper"]),
    // wallheaven壁纸分类标题
    wallTitleClick(item){
      this.wallStatus = item.id
      this.dataObj.categories = item.categories
      this.dataObj.sorting = item.sorting 
      if(this.wallStatus === 0){
        this.getWallHeavenData(this.page)
      }else if(this.wallStatus === 1){
        this.getWallHeavenData(this.page)
      }else if(this.wallStatus === 2){
        this.getWallHeavenData(this.page)
      }
    },
    // 初始化数据
    getWallHeavenData(page){
      const url = `https://wallhaven.cc/api/v1/search?&categories=${this.dataObj.categories}&purity=${this.dataObj.purity}&sorting=${this.dataObj.sorting}&page=${page}`
      if(!this.isLoading){
         this.isLoading = true
         axios.get(url).then(async res=>{
           let wallImageData = res.data.data
           let animations = ["ani-gray", "bowen", "ani-rotate"];
           if (wallImageData){
            wallImageData.forEach(img => {
              let randomIndex = Math.floor(Math.random() * animations.length);
              const image = {
                title: false,
                src: img.thumbs.large,
                path: img.path,
                resolution:img.resolution,
                animations: animations[randomIndex],
              };
              if(this.wallStatus === 0){
                this.hotHeavenList.push(image);
              }else if(this.wallStatus === 1){
                this.acgHeavenList.push(image)
              }else if(this.wallStatus === 2){
                this.peopleHeavenList.push(image)
              }
            })
            this.$nextTick(() => {
              this.isLoading = false;
            });
           }
         })
      }
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
    getSearchData(){
      let searchUrl = `https://wallhaven.cc/api/v1/search?&categories=${this.dataObj.categories}&purity=${this.dataObj.purity}${this.searchObj.wallSizeValue === '' ? '':`&atleast=${this.searchObj.wallSizeValue}`}${this.wallStatus === 0 ? `&sorting=${this.hotSorting}` : this.wallStatus === 1 ? `&sorting=${this.acgSorting}`: this.wallStatus === 2 ? `&sorting=${this.peopleSorting}` : ''}${this.searchObj.searchName !=='' ?`&q=${this.searchObj.searchName}`:''}&page=${this.page}`
      if(this.wallStatus === 0){
        this.hotHeavenList = [];
      }else if(this.wallStatus === 1){
        this.acgHeavenList = []
      }else if(this.wallStatus === 2){
        this.peopleHeavenList = []
      }
      if(!this.isLoading){
         this.isLoading = true
         axios.get(searchUrl).then(async res=>{
           let searchImageData = res.data.data
           let animations = ["ani-gray", "bowen", "ani-rotate"];
           if (searchImageData){
            searchImageData.forEach(img => {
              let randomIndex = Math.floor(Math.random() * animations.length);
              const image = {
                title: false,
                src: img.thumbs.large,
                path: img.path,
                resolution:img.resolution,
                animations: animations[randomIndex],
              };
              if(this.wallStatus === 0){
                this.hotHeavenList.push(image);
              }else if(this.wallStatus === 1){
                this.acgHeavenList.push(image)
              }else if(this.wallStatus === 2){
                this.peopleHeavenList.push(image)
              }
            })
            this.$nextTick(() => {
              this.isLoading = false;
            });
           }
         })
      }
    },
    wallSelectChange(e){
      this.searchObj.sorting = e
    },
    getWallSelectValue(e){
      if(e !== ''){
        this.searchObj.wallSizeValue = e 
      }
    },
    getPurity(e){
      this.dataObj.purity = e.target.value
    }

  }
})
</script>

<style lang="scss" scoped>
.wallheaven-header {
  width: auto;
  padding-bottom: 32px;
  .wallheaven-item {
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    user-select: none;
    padding: 11.87px 28px 11px 28px;
    margin-right: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .wallheaven-active {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 12px;
  }
}

.wallheaven-tab {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  .ant-cascader {
    width: 200px !important;
    margin-right: 16px !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
  .ant-input-affix-wrapper {
    width: 200px !important;
    background: rgba(255, 255, 255, 0.15) !important;
  }
  ::v-deep .ant-select-selector {
    background: rgba(255, 255, 255, 0.15) !important;
    border: none !important;
    border-radius: 8px !important;
  }
  ::v-deep .ant-select-item {
    background-color: rgba(255, 255, 255, 0.15) !important;
  }
  .ant-input-affix-wrapper {
    border: none !important;
    border-radius: 8px !important;
  }
  .search-button {
    margin-left: 16px;
    padding: 6px 22px 7px 21px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ant-btn-ghost:hover,
  .ant-btn-ghost:focus {
    color: rgba(255, 255, 255, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
  }
  .ant-radio-button-wrapper-checked:not(
      .ant-radio-button-wrapper-disabled
    )::before {
    display: none !important;
  }
  .ant-radio-button-wrapper:not(:first-child)::before {
    background-color: transparent !important;
  }
  .ant-radio-button-wrapper:focus-within {
    box-shadow: none !important;
    background: rgba(255, 255, 255, 0.4) !important;
  }
}
</style>

<style  lang="scss">
.bottom-actions {
  color: rgb(234, 234, 234);
  font-size: 1.2em;
  width: 2em;
  height: 2em;
  line-height: 2em;
  background: rgba(0, 0, 0, 0.42);
  border-radius: 0px 6px 0px 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image-item {
  object-fit: cover;
  width: 100%;
  border-radius: 6px;
}
.viewer-toolbar > ul {
  li {
    margin-right: 10px;
    margin-left: 10px;
  }
  zoom: 1.6;
}
</style>