<template>
    <HomeComponentSlot :sizeList="sizeList" :options="options">
        <div style="width: 240px;height: 354px;margin: 12px auto;">
            <img style="max-width:240px;" src="../../../../public/img/test/film.jpg" alt="">
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
    data() {
      return {
        sizeList:[{title:'1x2',height:2,width:1,name:'1x2'},{title:'2x2',height:2,width:2,name:'2x2'},],
        options:{
          className:'card small',
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
  
</style>
  