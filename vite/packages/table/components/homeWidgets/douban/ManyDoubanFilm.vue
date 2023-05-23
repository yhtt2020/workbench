<template>
    <HomeComponentSlot 
    :sizeList="sizeList" 
    :options="options" 
    :customIndex="customIndex"
    :custom-data="customData"
    :formulaBar="formulaBar"
    >
      <div class="film-box" v-if="customData.width ? customData.width === 1 :  'true' ">
        <div v-for="(item,index) in 4" :key="index" class="w-full  cursor-pointer" style="width: 116px;height: 171px;position: relative;margin-bottom: 14px;">
          <img src="../../../../../public/img/test/film.jpg" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
          <div class="right-top w-20 h-6 text-center bg-black bg-opacity-70" style="font-weight: 600;">
            豆瓣：<span style="font-weight: 700;font-family: Oswald-Bold;">5.9</span>
          </div>
        </div>
      </div>
      <div class="film-item" v-else-if="customData.width === 2">
        <div v-for="(item,index) in 8" :key="index" class="w-full rounded-t-lg  cursor-pointer mr-5" style="width: 116px;height: 171px;position: relative;margin-bottom: 14px;">
          <img src="../../../../../public/img/test/film.jpg" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
          <div class="right-top w-20 h-6 text-center bg-black bg-opacity-70" style="font-weight: 600;">豆瓣：<span style="font-weight: 700;font-family: Oswald-Bold;">5.9</span></div>
        </div>
      </div>
    </HomeComponentSlot> 
</template>
  
<script>
  import { mapWritableState, mapActions } from 'pinia'
  import HomeComponentSlot from "../HomeComponentSlot.vue";
  import { douBanStore } from '../../../store/douBan';
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
          type:'singleDoubanFilm'
        },
        mySize: { title: "1x2", height:2,width:1,name:'1x2' },
      };
    },
    computed: {
      ...mapWritableState(douBanStore, ['data']),
    },
    methods: {
      ...mapActions(douBanStore,['getData'])
    },
    mounted() {
      this.getData()
      // console.log('data',this.data)  
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
  .film-item{
      padding: 12px 0 0 18px;
      display: grid;
      grid-template-columns: repeat(4, 0.225fr);
      justify-content: center;
      align-items: center;
    }
</style>
  