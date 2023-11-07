<template>
    <Widget
    :desk="desk"
    :sizeList="sizeList"
    :options="options"
    :customIndex="customIndex"
    :custom-data="customData"
    :menuList="menuList"
    :env="env"
    v-if="!detailToggle"
    >
      <span style="position: absolute;top: 16px;left: 120px"><icon style="font-size: 18px" icon="shuaxin"></icon></span>
      <div v-if="pageToggle">
        <div class="example" v-if="isLoading">
          <a-spin />
        </div>
        <div v-else>
        <div class="pointer title-refresh" @click="refreshPage"></div>
          <div class="film-box" v-if="customData.width ? customData.width === 1 :  'true' ">
            <div v-for="item in filmArrange" :key="item.id"
            @click="btnDetail(item.id)"
            class="w-full  cursor-pointer one-film"
            style="display:hiddle;">
              <!-- <img :src="item.img" alt="" class="rounded-lg img-film"> -->
              <a-image :src="item.img" :preview="false" class="rounded-lg" style="object-fit: cover;" width="116px" height="171px"/>
              <div class="right-top text-center bg-black bg-opacity-70"  style="background: var(--primary-bg) !important;">
              <span v-if="item.sc" style="font-family: PingFangSC-Semibold;font-weight: 600;color: var(--primary-text);">
                猫眼：<span style="font-weight: 700;font-family: Oswald-Bold;">{{item.score}}</span>
              </span>
              <span v-else style="font-weight: 700;font-family: Oswald-Bold;color: var(--primary-text);">{{ item.comingDate }}</span>
              </div>
            </div>
          </div>
          <div class="film-item" v-else-if="customData.width === 2">
            <div v-for="item in filmArrange" :key="item.id" @click="btnDetail(item.id)"
            class="w-full rounded-t-lg  cursor-pointer mr-5 one-film">
              <!-- <img :src="item.img" alt="" class="rounded-lg img-film"> -->
              <a-image :src="item.img" :preview="false" alt="" class="rounded-lg" style="object-fit: cover;" width="116px" height="171px"/>
              <div class="right-top text-center bg-black bg-opacity-70" style="background: var(--primary-bg) !important;">
                <span v-if="item.sc" style="font-family: PingFangSC-Semibold;font-weight: 600;">
                  猫眼：<span style="font-weight: 700;font-family: Oswald-Bold;color: var(--primary-text);background: background: var(--primary-bg);">{{item.score}}</span>
                </span>
                <span v-else style="font-weight: 700;font-family: Oswald-Bold;color: var(--primary-text);">{{ item.comingDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"></DataStatu>
    </Widget>
    <FilmDetail v-if="detailToggle" :detailId="detailId" :fatherWidth="customData.width" @detailBack="detailBack"></FilmDetail>
</template>

<script>
  import { mapWritableState, mapActions } from 'pinia'
  import Widget from "../../card/Widget.vue";
  import { filmStore } from '../../../store/douBan';
  import DataStatu from "../DataStatu.vue"
  import FilmDetail from './FilmDetail.vue'
  import _ from 'lodash-es';
  export default {
    name: "ManyFilm",
    components:{
      Widget,
      FilmDetail,
      DataStatu
    },
    props: {
      customIndex:{
        type:Number,
        default:0
      },
      customData: {
        type: Object,
        default: () => {

        },
      },
      desk:{
        type:Object
      }
    },
    data() {
      return {
        sizeList:[{title:'1x2',height:2,width:1,name:'1x2'},{title:'2x2',height:2,width:2,name:'2x2'},],
        options:{
          className:'card',
          title:'正在热映',
          icon:'video',
          type:'singleFilm'
        },
        mySize: { title: "1x2", height:2,width:1,name:'1x2' },
        filmList: [],
        filmPart: [],
        filmArrange: [],
        detailToggle: false,
        detailId: -1,
        isLoading: false,
        pageToggle: true,
        env:{
          web: false,
          mobile: false,
          client: false,
          offline:true
        }
      };
    },
    computed: {
      ...mapWritableState(filmStore, ['data']),
    },
    watch:{
      'customData.width': {
        handler() {
          this.getDoubanList()
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      ...mapActions(filmStore,['getData']),
      getDoubanList(){
        if(this.customData.width ? this.customData.width === 1 :  'true'){
          this.filmArrange = this.filmPart.slice(0,4)
        }else if(this.customData.width === 2){
          this.filmArrange = this.filmPart
        }
      },
      async refreshPage () {
        this.filmPart = _.sampleSize(this.filmList, 8)
        await this.getData(0)
        this.getDoubanList()
      },
      btnDetail(id){
        this.detailId = id
        this.detailToggle = true
      },
      detailBack(val){
        this.detailToggle = val
      }
    },
    async mounted() {
      this.isLoading = true
      await this.getData()
      if(!this.data){
        this.pageToggle = false
      }else{
        this.filmList = this.data.list || []
        if(!this.filmList.length){
          this.pageToggle = false
        }
        this.filmPart = _.sampleSize(this.filmList, 8)
        this.getDoubanList()
      }
      setTimeout(() => {
        this.isLoading = false
      })
    },
  };
</script>

<style scoped lang="scss">
  .film-box{
    display: flex;
    flex-flow: wrap;
    margin: 13px 0 0 3px;
  }
  .film-box>div:nth-child(odd){
    margin-right: 16px;
  }

  .right-top{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 8px 0px 8px;
    width: 68px;
    height: 24px;
    line-height: 24px;
    font-size: 13px;
  }
  .film-item{
      padding: 12px 0 0 20px;
      display: grid;
      grid-template-columns: repeat(4, 0.225fr);
      justify-content: center;
      align-items: center;
    }
    .one-film{
      width: 116px;
      height: 171px;
      position: relative;
      margin-bottom: 14px;
      .img-film{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .title-refresh{
      position: absolute;
      left: 20px;
      top:10px;
      width: 230px;
      height: 40px;
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
