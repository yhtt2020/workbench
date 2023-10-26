<template>
    <Widget :options="options" :customIndex="customIndex" :custom-data="customData">
      <div class="example" v-if="isLoading">
        <a-spin />
      </div>
      <div v-else>
        <div class="flex" style="margin-top: 13px;color: var(--primary-text);" v-if="pageToggle">
          <div class="cursor-pointer" style="width: 240px;height: 354px;margin: 0 16px 0 5px;" v-if="fatherWidth == 2">
            <a-image :src="detailMovie.img" width="240px" height="354px" style="object-fit: cover;" class="rounded-lg" alt="" />
          </div>
          <div :class="fatherWidth == 2 ? 'size-max' : 'size-min'">
            <div style="height:304px;">
              <div class="film-content" :class="fatherWidth == 2 ? 'size-max' : 'size-min'">
              <div style="font-family: PingFangSC-Semibold;font-size: 20px;color: var(--primary-text);font-weight: 600;margin-bottom: 8px;">
                {{ detailMovie.nm }}
              </div>
              <span style="color: var(--primary-text);font-size: 20px;font-weight: 600;">{{ detailMovie.title }}</span>
              <div>主演：<span>{{ detailMovie.members }}</span></div>
              <div>导演：<span>{{ detailMovie.dir }}</span></div>
              <div>类型：<span>{{ detailMovie.filmType }}</span></div>
              <div>制片国家/地区: <span>{{ detailMovie.src }}</span></div>
              <div>语言：<span>{{ detailMovie.language }}</span></div>
              <div>上映：<span>{{ detailMovie.pubDesc }}</span></div>
            </div>
            <div v-if="detailMovie.sc" class="items-center s-item mt-2 mb-3 rounded-lg pl-4" style="display:flex;height:55px;" :class="fatherWidth == 2 ? 'size-max' : 'size-min'"  >
              <span class="mr-4" style="font-size: 16px;color: var(--secondary-text);" v-if="fatherWidth == 2">猫眼</span>
              <span style="font-size: 32px;color: #FFFFFF;letter-spacing: 4px;font-weight: 500;margin-right: 11px;">{{ detailMovie.score }}</span>
              <span style="font-size:20px;position: relative;top: -3px;">
                <a-rate v-model:value="detailMovie.starRating" allow-half disabled/>
              </span>
            </div>
            </div>
            <div class="flex items-center justify-between">
              <div @click="discountBack(false)"
                  class="s-item change cursor-pointer rounded-lg w-12 h-12 flex items-center justify-center">
                <Icon icon="xiangzuo" style="font-size: 20px;color: var(--primary-text);"></Icon>
              </div>
              <span class="change pointer rounded-lg s-item  flex items-center justify-center"
              style="color: var(--primary-text);font-size: 16px;"
              @click="stripDay(detailMovie.shareInfo.url)"
              :style="fatherWidth == 2 ? 'padding: 13px 80px;' : 'padding:13px 62px;'"
              >
              猫眼电影
              </span>
            </div>
          </div>
        </div>
        <DataStatu v-else-if="!pageToggle" @notData="notData"></DataStatu>
      </div>
     </Widget>
</template>

<script>
  import Widget from "../../card/Widget.vue";
  import DataStatu from "../DataStatu.vue"
  import { cacheRequest } from '../../../js/axios/api'
  import _ from 'lodash-es';
  export default {
    name: "ManyFilm",
    components:{
      Widget,
      DataStatu
    },
    props: {
      customIndex:{
        type:Number,
        default:0
      },
      customData: {
        type: Object,
        default: () => {},
      },
      detailId: {
        type: Number,
        default: 0
      },
      fatherWidth: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        options:{
          className:'card',
          title:'正在热映',
          icon:'video',
          type:'singleDoubanFilm'
        },
        detailMovie: {},
        pageToggle: true,
        isLoading: false
      };
    },
    methods: {
      setDetail(){
        this.detailMovie.image = this.detailMovie.img.replace('2500x2500','240x354')
        this.detailMovie.members = this.detailMovie.star.replace(/,/g,' / ')
        this.detailMovie.filmType = this.detailMovie.cat.replace(/,/g,' / ')
        this.detailMovie.language = this.detailMovie.oriLang.replace(/,/g,' / ')
        this.detailMovie.score = this.priceFormat(this.detailMovie.sc)
        this.detailMovie.starRating = this.detailMovie.score / 2
      },
      priceFormat(num){
        if(!isNaN(num)){
          return ( (num + '').indexOf('.') != -1 ) ? num: num.toFixed(1);
        }
      },
      async getFilmDetail(){
        let detail = await cacheRequest(`https://m.maoyan.com/ajax/detailmovie?movieId=${this.detailId}`,{},{
          localCache:true,
          localTtl:60*60*12
        })
        if(detail.data.code){
          this.pageToggle = false
          this.detailMovie = detail.data
          return
        }else{
          this.detailMovie = detail.data.detailMovie
          await this.setDetail()
        }
      },
      stripDay(url){
        window.browser.openInUserSelect(url)
      },
      notData(val){
        this.$emit('detailBack',val)
      },
      discountBack(val){
        this.$emit('detailBack',val)
      },
    },
    async mounted() {
      this.isLoading = true
      await this.getFilmDetail()
      setTimeout(() => {
        this.isLoading = false
      })
    },
  };
</script>

<style scoped lang="scss">
  .film-content{
      height: 230px;
      width:250px;
      font-weight: 400;
      div{
        color: var(--secondary-text);
        line-height: 32px;
        font-size: 16px;
        word-break: normal;
        white-space: nowrap;
        word-wrap: break-word;
        text-overflow: ellipsis;
        overflow: hidden;
        span{
          color: var(--primary-text);
          line-height: 32px;
          font-size: 16px;
        }
      }
    }
    .size-min{
      width: 252px;
    }
    .size-max{
      width: 282px;
    }
  .title-refresh{
    position: absolute;
    left: 15px;
    top:10px;
    width: 200px;
    height: 40px;
    // background:red;
  }
  .right-top{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 8px 0px 8px;
  }
  .example {
    width: 100%;
    height: 328px;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 20px;
    padding: 30px 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>


