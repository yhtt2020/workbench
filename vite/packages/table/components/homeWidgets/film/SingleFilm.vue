<template>
    <HomeComponentSlot :options="options" v-if="!detailToggle">
      <div v-if="isLoading">
        <a-spin style="display: flex; justify-content: center; align-items:center;margin-top: 60%"/>
      </div>
      <div v-else>
        <div class="pointer title-refresh" @click="refreshPage"></div>
        <div class="w-full  cursor-pointer" 
        style="width: 240px;height: 354px;margin: 13px auto 0;position: relative;"
        @click="btnDetail(singleFilm.id)"
        >
          <a-image :preview="false" :src="singleFilm.img" width="240px" height="354px" alt="" class="rounded-lg" style="object-fit: cover;" />
          <div class="right-top text-center bg-black bg-opacity-70" 
          style="font-weight: 600;font-family: PingFangSC-Semibold;">
            <span v-if="singleFilm.sc" style="font-family: PingFangSC-Semibold;font-weight: 600;">
              猫眼：<span style="font-weight: 700;font-family: Oswald-Bold;">{{singleFilm.sc}}</span>
            </span>
            <span v-else style="font-weight: 700;font-family: Oswald-Bold;">{{ singleFilm.comingDate }}</span>
          </div>
        </div>
      </div>
    </HomeComponentSlot>
    <FilmDetail v-if="detailToggle" :detailId="detailId" @detailBack="detailBack"></FilmDetail>
</template>
  
<script>
  import HomeComponentSlot from "../HomeComponentSlot.vue";
  import FilmDetail from './FilmDetail.vue'
  import { mapWritableState, mapActions } from 'pinia'
  import { filmStore } from '../../../store/douBan';
  import _ from 'lodash-es';
  export default {
    name: "ManyFilm",
    components:{
      HomeComponentSlot,
      FilmDetail
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
      }
    },
    data() {
      return {
        options:{
          className:'card',
          title:'正在热映 (开发中)',
          icon:'video',
          type:'singleFilm'
        },
        filmList: [],
        singleFilm: {},
        detailToggle: false,
        detailId: -1,
        isLoading: false
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
        // console.log(this.singleFilm)
      },
      detailBack(val){
        this.detailToggle = val
      }
    },
    async mounted() {
      this.isLoading = true
      await this.getData()
      this.filmList = this.data
      if(this.filmList){
        this.isLoading = false
      }
      this.singleFilm = _.sampleSize(this.filmList,1)[0]
      setTimeout(() => {
        this.isLoading = false
      })
      // console.log("singleFilm",this.singleFilm)
    },
  };
</script>
  
<style scoped lang="scss">
  .film-content{
      width: 284px;
      height: 224px;
      div{
        font-size: 16px;
        color: rgba(255,255,255,0.60);
        line-height: 32px;
        font-weight: 400;
        word-break: normal;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        span{
          font-size: 16px;
          color: rgba(255,255,255,0.85);
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


  