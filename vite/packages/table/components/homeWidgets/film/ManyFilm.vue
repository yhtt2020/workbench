<template>
    <HomeComponentSlot 
    :sizeList="sizeList" 
    :options="options" 
    :customIndex="customIndex"
    :custom-data="customData"
    :formulaBar="formulaBar"
    v-if="!detailToggle"
    >
      <div class="pointer title-refresh" @click="refreshPage"></div>
      <div class="film-box" v-if="customData.width ? customData.width === 1 :  'true' ">
        <div v-for="item in filmArrange" :key="item.id" 
        @click="btnDetail(item.id)" 
        class="w-full  cursor-pointer one-film">
          <img :src="item.img" alt="" class="rounded-lg img-film">
          <div class="right-top text-center bg-black bg-opacity-70">
          <span v-if="item.sc" style="font-family: PingFangSC-Semibold;font-weight: 600;">
            猫眼：<span style="font-weight: 700;font-family: Oswald-Bold;">{{item.sc}}</span>
          </span>
          <span v-else style="font-weight: 700;font-family: Oswald-Bold;">{{ item.comingDate }}</span>
          </div>
        </div>
      </div>
      <div class="film-item" v-else-if="customData.width === 2">
        <div v-for="item in filmArrange" :key="item.id" @click="btnDetail(item.id)"
        class="w-full rounded-t-lg  cursor-pointer mr-5 one-film">
          <img :src="item.img" alt="" class="rounded-lg img-film">
          <div class="right-top text-center bg-black bg-opacity-70">
            <span v-if="item.sc" style="font-family: PingFangSC-Semibold;font-weight: 600;">
              猫眼：<span style="font-weight: 700;font-family: Oswald-Bold;">{{item.sc}}</span>
            </span>
            <span v-else style="font-weight: 700;font-family: Oswald-Bold;">{{ item.comingDate }}</span>
          </div>
        </div>
      </div>
    </HomeComponentSlot> 
    <FilmDetail v-if="detailToggle" :detailId="detailId"></FilmDetail>
</template>
  
<script>
  import { mapWritableState, mapActions } from 'pinia'
  import HomeComponentSlot from "../HomeComponentSlot.vue";
  import { filmStore } from '../../../store/douBan';
  import FilmDetail from './FilmDetail.vue'
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
      },
    },
    data() {
      return {
        sizeList:[{title:'1x2',height:2,width:1,name:'1x2'},{title:'2x2',height:2,width:2,name:'2x2'},],
        options:{
          className:'card',
          title:'正在热映 (开发中)',
          icon:'video',
          type:'singleFilm'
        },
        mySize: { title: "1x2", height:2,width:1,name:'1x2' },
        filmList: [],
        filmPart: [],
        filmArrange: [],
        detailToggle: false,
        detailId: -1
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
      refreshPage(){
        this.filmPart = _.sampleSize(this.filmList, 8)
        this.getDoubanList()
      },
      btnDetail(id){
        // console.log(id)
        this.detailId = id
        this.detailToggle = true
      }
    },
    mounted() {
      this.getData()
      this.filmList = this.data
      this.filmPart = _.sampleSize(this.filmList, 8)
      this.getDoubanList()
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
      padding: 12px 0 0 18px;
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
      left: 15px;
      top:10px;
      width: 200px;
      height: 40px;
      // background:red;
    }
</style>
  