<template>
    <HomeComponentSlot 
    :sizeList="sizeList" 
    :options="options" 
    :custom-data="customData">
      <div class="film-box">
        <div v-for="item in 4" class="w-full  cursor-pointer" style="width: 116px;height: 171px;;position: relative;margin-bottom: 14px;">
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
        default: () => {},
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
        formulaBar:[{icon:'shezhi1',title:'设置',fn:()=>{this.settingVisible = true;this.$refs.cardSlot.visible = false}},],
        settingVisible:false,
      };
    },
    methods: {
        
    },
    mounted() {
      const { showName, mySize, myData } = this.customData;
      if (showName) this.showName = showName;
      if (mySize) this.mySize = { ...this.mySize, ...mySize };
      if (myData) this.myData = { ...this.myData, ...myData };
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
  }
</style>
  