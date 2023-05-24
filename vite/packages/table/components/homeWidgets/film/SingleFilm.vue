<template>
    <HomeComponentSlot :options="options" v-if="!detailToggle">
      <div class="pointer title-refresh" @click="refreshPage"></div>
      <div class="w-full  cursor-pointer" 
      style="width: 240px;height: 354px;margin: 13px auto 0;position: relative;"
      @click="btnDetail(singleFilm.id)"
      >
        <img :src="singleFilm.img" alt="" class="rounded-lg" style="width:100%;heigth:100%;object-fit: cover;">
        <div class="right-top w-20 h-6 text-center bg-black bg-opacity-70" style="font-weight: 600;">
          豆瓣：<span style="font-weight: 700;font-family: Oswald-Bold;">{{ singleFilm.sc }}</span>
        </div>
      </div>
    </HomeComponentSlot>
    <FilmDetail v-if="detailToggle" :detailId="detailId"></FilmDetail>
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
        detailId: -1
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
        // this.$router.push({name:'FilmDetail',params:{id}})
      },
      refreshPage(){
        this.singleFilm = _.sampleSize(this.filmList,1)[0]
      }
    },
    mounted() {
      this.getData()
      this.filmList = this.data
      this.singleFilm = _.sampleSize(this.filmList,1)[0]
      // console.log(this.singleFilm)
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
  }



  .star_rate{
    display: flex;
}
.movie_score{
    width: 3.382vw;
    height: 3.382vw;
    background-size: contain;
    background-repeat: no-repeat;
    margin-right: 0.753vw;
}
.score_text{
    font-size: 2.899vw;
    color: #ff6600;
    margin-top: 0.242vw;
    margin-left: 1.558vw;
}

</style>


  