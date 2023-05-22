<template>
    <HomeComponentSlot :sizeList="sizeList" :options="options" :customIndex="customIndex" :custom-data="customData">
      <div class="w-full  cursor-pointer" style="width: 240px;height: 354px;margin: 13px auto 0;position: relative;" v-if="customData.width ? customData.width === 1 :  'true' ">
        <img src="../../../../../public/img/test/film.jpg" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
        <div class="right-top w-20 h-6 text-center bg-black bg-opacity-70" style="font-weight: 600;">豆瓣：<span style="font-weight: 700;font-family: Oswald-Bold;">5.9</span></div>
      </div>

      <div class="flex" style="margin: 13px 10px 0;" v-else-if="customData.width === 2">
        <div style="width: 240px;height: 354px;margin-right: 16px;">
          <img style="max-width:240px;" src="../../../../../public/img/test/film.jpg" alt="">
        </div>
        <div class="film-content">
          <span style="color: rgba(255,255,255,0.85);font-size: 20px;font-weight: 600;">蚁人与黄蜂女：量子狂潮</span>
          <div>主演：<span>保罗·路德 / 伊万杰琳·莉莉 / 迈克尔·道格拉斯 / 米歇尔·菲佛</span></div>
          <div>类型：<span>喜剧 / 动作 / 科幻 / 冒险</span></div>
          <div>制片国家/地区: <span>美国</span></div>
          <div>语言：<span>英语</span></div>
          <div>上映时间：<span>2023-02-17</span></div>
          <div class="items-center mb-2" style="display:flex;height:72px;">
            <span style="font-size: 48px;color: #FFFFFF;letter-spacing: 4px;font-weight: 500;margin-right: 11px;">5.9</span>
            <div>
              <div style="font-size:20px;position: relative;top: 5px;">
                <Icon icon="star-fill" class="icon mr-3" style="color: #FAAD14;"></Icon>
                <Icon icon="star-fill" class="icon mr-3" style="color: #FAAD14;"></Icon>
                <Icon icon="star-fill" class="icon mr-3" style="color: #FAAD14;"></Icon>
                <Icon icon="star" class="icon mr-3" style="color: #FAAD14;"></Icon>
                <Icon icon="star" class="icon mr-3" style="color: #FAAD14;"></Icon>
              </div>
              <span style="color: rgba(255,255,255,0.60);font-size: 16px;">2389438人评价</span>
            </div>
          </div>
            <span class="change pointer rounded-lg s-item  flex items-center justify-center" 
            style="padding:13px 74px;color: rgba(255,255,255,0.85);font-size: 16px;"
            >
            豆瓣条日
            </span>
        </div>
      </div>
    </HomeComponentSlot>
</template>
  
<script>
  import HomeComponentSlot from "../HomeComponentSlot.vue";
  export default {
    name: "ManyDoubanFilm",
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
      }
    },
    data() {
      return {
        sizeList:[{title:'1x2',height:2,width:1,name:'1x2'},{title:'2x2',height:2,width:2,name:'2x2'},],
        options:{
          className:'card',
          title:'正在热映 (开发中)',
          icon:'video',
          type:'singleDoubanFilm'
        },
      };
    },
    methods: {
        
    },
    mounted() {
        
      
    },
  };
</script>
  
<style scoped lang="scss">
  .film-content{
      width: 284px;
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
  
  .right-top{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 8px 0px 8px;
  }
</style>
  