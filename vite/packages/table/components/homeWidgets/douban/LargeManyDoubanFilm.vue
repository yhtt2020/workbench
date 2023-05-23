<template>
    <HomeComponentSlot :options="options" :customIndex="customIndex" :formulaBar="formulaBar" ref="cardSlot">
      <div class="film-box">
        <div v-for="item in 8" class="w-full rounded-t-lg  cursor-pointer mr-5" style="width: 116px;height: 171px;;position: relative;margin-bottom: 14px;">
          <img src="../../../../../public/img/test/film.jpg" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
          <div class="right-top w-20 h-6 text-center bg-black bg-opacity-70" style="font-weight: 600;">豆瓣：<span style="font-weight: 700;font-family: Oswald-Bold;">5.9</span></div>
        </div>
      </div>
    </HomeComponentSlot>
  </template>
  
  <script>
  import HomeComponentSlot from "../HomeComponentSlot.vue";
  export default {
    name: "LargeManyDoubanFilm",
    components:{HomeComponentSlot},
    props:{
      customIndex:{
        type:Number,
        default:0
      }
    },
    mounted() {
    },
    data() {
      return {
        options:{
          className:'card double',
          title:'正在热映',
          icon:'video',
          type:'largeManyDoubanFilm'
        },
        formulaBar:[{icon:'shezhi1',title:'设置',fn:()=>{this.settingVisible = true;this.$refs.cardSlot.visible = false}},],
      };
    },
    
  };
  </script>
  
  <style scoped lang="scss">
    .film-box{
      padding: 12px 0 0 18px;
      display: grid;
      grid-template-columns: repeat(4, 0.225fr);
      justify-content: center;
      align-items: center;
    }
    
    .right-top{
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 0px 8px 0px 8px;
    }
  </style>
  