<template>
  <div class="wallheaven-tab">
    <a-radio-group v-model:value="search.purity" style="margin-right: 16px;">
      <a-radio-button value="SFW" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-left-radius: 8px;border-bottom-left-radius: 8px;">SFW</a-radio-button>
      <a-radio-button value="Sketchy" style="border:none !important;background:rgba(255, 255, 255, 0.1) !important;border-top-right-radius: 8px;border-bottom-right-radius: 8px;">Sketchy</a-radio-button>
    </a-radio-group>
    <a-select ref="select" v-model:value="search.sorting"  style="width:200px;margin-right: 16px;" @change="wallSelectChange($event)" >
      <a-select-option value="date_added">最新</a-select-option>
      <a-select-option value="hot">最热</a-select-option>
      <a-select-option value="random">随机</a-select-option>
      <a-select-option value="toplist">热门列表</a-select-option>
      <a-select-option value="favorites">更多收藏</a-select-option>
    </a-select>
    <a-select ref="select" v-model:value="wallSizeValue" style="width:200px;margin-right: 16px;"  @change="getWallSelectValue($event)">
     <a-select-option value>不限</a-select-option>
     <a-select-option value="1920x1080">1080p+</a-select-option>
     <a-select-option value="2560x1080">2k+</a-select-option>
     <a-select-option value="3840x2160">4k+</a-select-option>
     <a-select-option value="7680x4320">8k+</a-select-option>
    </a-select>
    <a-input v-model:value="searchName" placeholder="搜索" style="border:none !important;">
      <template #prefix>
        <SearchOutlined style="cursor: pointer;color: rgba(255, 255, 255, 0.4);"/>
      </template>
    </a-input>
    <a-button type="ghost" class="search-button" @click="wallSearch">搜索</a-button>
  </div>
  <vue-custom-scrollbar id="wall-container-paper" :settings="settingsScroller" style="height: 80vh">
    <div v-if="list.length == 0" class="flex align-center justify-center" style="height: 80vh">
      <a-empty description="未找到图片信息"/>
    </div>
    <viewer :images="list" :options="options" ref="acgRef" v-else>
      <a-row :gutter="[20,20]" id="wallImages" style="margin-right: 1em">
        <a-col class="image-wrapper " v-for="img in list" :span="6" style="">
          <img  class="image-item pointer" :src="img.src" :data-source="img.path" style="position: relative">
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
</template>

<script>
import { defineComponent, ref } from "vue";
import { mapActions,mapState  } from 'pinia'
import { paperStore } from '../../../store/paper'
import axios from 'axios'
import { SearchOutlined } from "@ant-design/icons-vue";
import justifiedGallery from 'justifiedGallery'
export default defineComponent({
  name: "WallAcg",
  components:{
    SearchOutlined,
  },
  data() {
    return {
      search: {
        categories: "010",
        purity: "SFW",
        sorting: "date_added",
      },
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      page:1,
      isLoading:false,
      list: [],
      wallSizeValue:'',
      searchName:'',
      options:{
        url: 'data-source',
      }
    };
  },
  computed:{
    ...mapState(paperStore,['myPapers']),
  },
  mounted(){
    justifiedGallery()
    $('#wall-img-container').justifiedGallery({
      captions: false,
      lastRow: 'hide',
      rowHeight: 180,
      margins: 5
    })
    $('#wall-container-paper').scroll(()=>{
      if($('#wall-container-paper').scrollTop() + $('#wall-container-paper').height() + 20 >= $('#wallImages').prop('scrollHeight') && this.isLoading === false){
        this.page = this.page + 1
        this.getAnimeList(this.page)
      }
    })
    this.getAnimeList(this.page)
  },
  methods:{
    ...mapActions(paperStore,['addToMyPaper']),
    // 动漫数据加载
    getAnimeList(page){
      // console.log(page);
      let url = `https://wallhaven.cc/api/v1/search?&categories=${this.search.categories}&purity=${this.search.purity == 'SFW' ? '100' :'010'}&sorting=${this.search.sorting}&page=${page}`
      console.log(url);
      if(!this.isLoading){
          this.isLoading = true
          // 数据请求业务
          axios.get(url).then((res)=>{
            if(res.status === 200){
              console.log(res.data.data);
              let wallImg  = res.data.data
              let animations = ['ani-gray', 'bowen', 'ani-rotate']
              if(wallImg){
                 wallImg.forEach(img => {
                  let randomIndex = Math.floor((Math.random() * animations.length))
                  let image = {
                    title:false,
                    src:img.thumbs.large,
                    path:img.path,
                    animations:animations[randomIndex]
                  }
                  this.list.push(image)
                 });
                 this.$nextTick(()=>{
                    this.isLoading = false
                 })
              }
            }
          })

      }
    },
    // 获取搜索数据
    wallSearch(){
      this.list = []
      let searchUrl = `https://wallhaven.cc/api/v1/search?&categories=${this.search.categories}&purity=${this.search.purity=='SFW' ? '100':'010' }&sorting=${this.search.sorting}${this.wallSizeValue === ''? '':`&atleast=${this.wallSizeValue}`}${this.searchName !=='' ?`&q=${this.searchName}`:''}&page=${this.page}`
      console.log(searchUrl);
      if (!this.isLoading) {
        this.isLoading = true;
        axios.get(searchUrl).then(async (res) => {
          if (res.status === 200) {
            let wallImg = await res.data.data;
            let animations = ["ani-gray", "bowen", "ani-rotate"];
            if (wallImg) {
              wallImg.forEach((img) => {
                let randomIndex = Math.floor(Math.random() * animations.length);
                let image = {
                  title: false,
                  src: img.thumbs.large,
                  path: img.path,
                  animations: animations[randomIndex],
                };
                this.list.push(image);
              });
              this.$nextTick(() => {
                this.isLoading = false;
              });
            }
          }
        });
      }
    },
    wallSelectChange(e){
      this.search.sorting = e
    },
    getWallSelectValue(e){
      if(e !== ''){
        this.wallSizeValue = e 
      }
    },
    // 添加收藏
    addToMy(img){
      this.addToMyPaper(img)
    },
    isInMyPapers(image){
      return this.myPapers.findIndex(img=>{
      return image.src===img.src
      })>-1
    }
  }
});
</script>

<style lang="scss" scoped>
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