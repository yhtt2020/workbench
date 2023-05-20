<template>
    <HomeComponentSlot :sizeList="sizeList" :options="options" :customIndex="customIndex">
      <div class="w-full  cursor-pointer" style="width: 240px;height: 354px;margin: 13px auto 0;position: relative;">
        <img src="../../../../public/img/test/film.jpg" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
        <div class="right-top w-20 h-6 text-center bg-black bg-opacity-70" style="font-weight: 600;">豆瓣：<span style="font-weight: 700;font-family: Oswald-Bold;">5.9</span></div>
      </div>
    </HomeComponentSlot>
</template>
  
<script>
  import { sendRequest } from '../../js/axios/api'
  import HomeComponentSlot from "./HomeComponentSlot.vue";
  export default {
    name: "SingleDoubanFilm",
    components:{
      HomeComponentSlot
    },
    props: {
      customIndex:{
        type:Number,
        default:0
      },
    },
    data() {
      return {
        sizeList:[{title:'1x2',height:2,width:1,name:'1x2'},{title:'2x2',height:2,width:2,name:'2x2'},],
        options:{
          className:'card',
          title:'正在热映',
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
  .right-top{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 8px 0px 8px;
  }
</style>
  