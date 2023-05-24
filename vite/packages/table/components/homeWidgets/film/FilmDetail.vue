<template>
    <HomeComponentSlot :options="options" :customIndex="customIndex" :custom-data="customData">
      <!-- <div class="flex" style="margin: 13px 10px 0;">
        <div class="cursor-pointer" style="width: 240px;height: 354px;margin-right: 16px;">
          <img style="width:100%;height: 100%;object-fit: cover;" class="rounded-lg" :src="singleFilm.img" alt="">
        </div>
        <div>
          <div class="film-content">
            <span style="color: rgba(255,255,255,0.85);font-size: 20px;font-weight: 600;">{{ singleFilm.title }}</span>
            <div>主演：<span>{{ singleFilm.members }}</span></div>
            <div>类型：<span>{{ singleFilm.filmType }}</span></div>
            <div>制片国家/地区: <span>{{ singleDilm. }}</span></div>
            <div>语言：<span>-</span></div>
            <div>上映时间：<span>{{ singleFilm.year }}</span></div>
          </div>
          <div class="items-center mb-2" style="display:flex;height:72px;">
            <span style="font-size: 48px;color: #FFFFFF;letter-spacing: 4px;font-weight: 500;margin-right: 11px;">{{ singleFilm.rating.average }}</span>
            <div>
              <div style="font-size:20px;position: relative;top: 5px;">
                <a-rate v-model:value="singleFilm.starRating" allow-half disabled/>
              </div>
              <span style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ singleFilm.collect_count }}人评价</span>
            </div>
          </div>
            <span class="change pointer rounded-lg s-item  flex items-center justify-center" 
            style="padding:13px 74px;color: rgba(255,255,255,0.85);font-size: 16px;"
            >
            豆瓣条日
            </span>
        </div>
      </div> -->
     </HomeComponentSlot>
</template>
  
<script>
  import HomeComponentSlot from "../HomeComponentSlot.vue";
  import { mapWritableState, mapActions } from 'pinia'
  import { filmStore } from '../../../store/douBan';
  import { sendRequest } from '../../../js/axios/api'
  import _ from 'lodash-es';
  export default {
    name: "ManyFilm",
    components:{
      HomeComponentSlot
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
      detailId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        options:{
          className:'card',
          title:'正在热映 (开发中)',
          icon:'video',
          type:'singleDoubanFilm'
        },
        singleFilm: {},
      };
    },
    computed: {
      ...mapWritableState(filmStore, ['filmDetail']),
    },
    methods: {
      ...mapActions(filmStore,['getData']),
      setDoubanDetail(){
        // this.singleFilm.members = this.singleFilm.star.replace(/,/g,' / ');
        // this.singleFilm.filmType = this.singleFilm.genres.join(' / ')
        // this.singleFilm.starRating = this.singleFilm.rating.average / 2
      },
      // refreshPage(){
      //   this.setDoubanDetail()
      // },
      async getfilmDetail(){
        let detail = await sendRequest(`https://m.maoyan.com/ajax/detailmovie?movieId=${this.detailId}`,{},{
          localCache:true,
          localTtl:60
        })
        // console.log("!@#",detail)
      }
    },
    mounted() {
      this.getfilmDetail()
      // console.log("detail",this.filmDetail)
      this.singleFilm = this.filmDetail
      // this.getData()
      this.setDoubanDetail()
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


  