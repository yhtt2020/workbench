<template>
    <Widget :desk="desk" :options="options" v-if="!detailToggle">
      <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:movies-and-tv-16-regular" style="font-size: 24px;" />
        </div>
      </template>
      <span style="position: absolute;top: 18px;left: 115px"><icon style="font-size: 18px" icon="shuaxin"></icon></span>
      <div v-if="pageToggle">
        <div v-if="isLoading">
          <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 60%"/>
        </div>
        <div v-else>
          <div class="pointer title-refresh" @click="refreshPage"></div>
          <div class="w-full cursor-pointer"
          style="width: 240px;height: 354px;margin: 13px auto 0;position: relative;"
          @click="btnDetail(singleFilm.id)"
          >
            <a-image :preview="false" :src="singleFilm.img" width="240px" height="354px" alt="" class="rounded-lg" style="object-fit: cover;" />
            <div class="text-center bg-black right-top bg-opacity-70"
            style="font-weight: 600;font-family: PingFangSC-Semibold;background:var(--primary-bg) !important;">
              <span v-if="singleFilm.sc" style="font-family: PingFangSC-Semibold;font-weight: 600;color: var(--primary-text);">
                猫眼：<span style="font-weight: 700;font-family: Oswald-Bold;">{{singleFilm.score}}</span>
              </span>
              <span v-else style="font-weight: 700;font-family: Oswald-Bold;color: var(--primary-text);">{{ singleFilm.comingDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <DataStatu v-else imgDisplay="/img/test/load-ail.png" :btnToggle="false" textPrompt="暂无数据"></DataStatu>
    </Widget>
    <FilmDetail v-if="detailToggle" :detailId="detailId" @detailBack="detailBack"></FilmDetail>
</template>

<script>
  import Widget from "../../card/Widget.vue";
  import FilmDetail from './FilmDetail.vue'
  import DataStatu from "../DataStatu.vue"
  import { mapWritableState, mapActions } from 'pinia'
  import { filmStore } from '../../../store/douBan';
  import {Icon as newIcon} from '@iconify/vue'
  import _ from 'lodash-es';
  export default {
    name: "ManyFilm",
    components:{
      Widget,
      FilmDetail,
      DataStatu,
      newIcon
    },
    props: {
      desk:{
        type:Object,
      },
      customIndex:{
        type:Number,
        default:0
      },
      customData: {
        type: Object,
        default: () => {

        },
      }
    },
    data() {
      return {
        options:{
          className:'card',
          title:'正在热映',
          // icon:'video',
          type:'singleFilm'
        },
        filmList: [],
        singleFilm: {},
        detailToggle: false,
        detailId: -1,
        isLoading: false,
        pageToggle: true,
      };
    },
    computed: {
      ...mapWritableState(filmStore, ['data']),
    },
    methods: {
      ...mapActions(filmStore,['getData','getFilmDetail']),
      btnDetail(id){
        this.detailId = id
        this.detailToggle = true
      },
      refreshPage(){
        this.singleFilm = _.sampleSize(this.filmList,1)[0]
      },
      detailBack(val){
        this.detailToggle = val
      },

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
        this.singleFilm = _.sampleSize(this.filmList,1)[0]
      }
      setTimeout(() => {
        this.isLoading = false
      })
    },
  };
</script>

<style scoped lang="scss">
  .film-content{
      width: 284px;
      height: 224px;
      div{
        font-size: 16px;
        color: var(--secondary-text);
        line-height: 32px;
        font-weight: 400;
        word-break: normal;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        span{
          font-size: 16px;
          color: var(--primary-text);
          line-height: 32px;
          font-weight: 400;
        }
      }
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
    width: 68px;
    height: 24px;
    line-height: 24px;
    font-size: 13px;
  }
</style>


