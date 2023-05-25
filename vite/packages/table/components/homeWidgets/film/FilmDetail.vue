<template>
    <HomeComponentSlot :options="options" :customIndex="customIndex" :custom-data="customData">
      <div class="flex" style="margin: 13px 10px 0;" v-if="pageToggle">
        <div class="cursor-pointer" style="width: 240px;height: 354px;margin-right: 16px;">
          <img :src="detailMovie.img" style="width: 100%;height: 100%;object-fit: cover;" class="rounded-lg" alt="">
        </div>
        
        <div style="width:284px;">
          <div class="film-content">
            <span style="color: rgba(255,255,255,0.85);font-size: 20px;font-weight: 600;">{{ detailMovie.title }}</span>
            <div>主演：<span>{{ detailMovie.members }}</span></div>
            <div>类型：<span>{{ detailMovie.filmType }}</span></div>
            <div>制片国家/地区: <span>{{ detailMovie.src }}</span></div>
            <div>语言：<span>{{ detailMovie.oriLang }}</span></div>
            <div>上映时间：<span>{{ detailMovie.pubDesc }}</span></div>
          </div>
          <div class="items-center mb-2" style="display:flex;height:72px;">
            <span style="font-size: 48px;color: #FFFFFF;letter-spacing: 4px;font-weight: 500;margin-right: 11px;">{{ detailMovie.sc }}</span>
            <div>
              <div style="font-size:20px;position: relative;top: 5px;">
                <a-rate v-model:value="detailMovie.starRating" allow-half disabled/>
              </div>
              <span style="color: rgba(255,255,255,0.60);font-size: 16px;">{{ detailMovie.wish }}人评价</span>
            </div>
          </div>
          <span class="change pointer rounded-lg s-item  flex items-center justify-center" 
          style="padding:13px 70px;color: rgba(255,255,255,0.85);font-size: 16px;"
          @click="stripDay(detailMovie.shareInfo.url)"
          >
          猫眼条日
          </span>
        </div>
      </div>
      <div v-else>{{ detailMovie.msg }}</div>
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
          className:'card double',
          title:'正在热映 (开发中)',
          icon:'video',
          type:'singleDoubanFilm'
        },
        detailMovie: {
          img: ''
        },
        pageToggle: true
      };
    },
    methods: {
      setDoubanDetail(){
        this.detailMovie.members = this.detailMovie.star.replace(/,/g,' / ')
        this.detailMovie.filmType = this.detailMovie.cat.replace(/,/g,' / ')
        this.detailMovie.starRating = this.detailMovie.sc / 2
      },
      async getfilmDetail(){
        let detail = await sendRequest(`https://m.maoyan.com/ajax/detailmovie?movieId=${this.detailId}`,{},{
          localCache:true,
          localTtl:60
        })
        console.log('detail',detail)
        if(detail.data.code){
          this.pageToggle = false
          this.detailMovie = detail.data
          return
        }else{
          this.detailMovie = detail.data.detailMovie
        }
        console.log(detail)
        console.log("!@#",detail.data.detailMovie)
        // this.detailMovie = detail.data.detailMovie
      },
      stripDay(url){
        window.open(url, '_blank')
      }
    },
    async mounted() {
      await this.getfilmDetail()
      if(this.detailMovie.code !== 406){
        await this.setDoubanDetail()
      }
      
    },
  };
</script>
  
<style scoped lang="scss">
  .film-content{
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


  