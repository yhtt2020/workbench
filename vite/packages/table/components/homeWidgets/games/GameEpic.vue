<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex" >
    <template v-if="epicAppShow === false">
      <div class="flex h-11 justify-between items-center bg-white bg-opacity-30 p-1 rounded-md mt-4">
        <span class="flex items-center h-9 cursor-pointer justify-center change-item" :class="weekIndex === item.id ? 'epic-active':''" v-for="item in teaserTips" @click="weekPick(item.id)">
           {{ item.name }}
        </span>
      </div>
      <div v-if="weekIndex === 0">
        本周
      </div>
      <div v-else>
        下周
      </div>
    </template>
    <template v-if="epicAppShow === true">
      应用详情
    </template>
      
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue"
import { sendRequest,startOfNextWeek,startOfWeek } from "../../../js/axios/api";
import { mapActions, mapWritableState } from 'pinia';
import { steamStore } from "../../../store/steam";
export default {
  name:'GamesDiscount',
  props:{
    customIndex:{
      type:Number,
      default:0
    },
  },
  components:{
    HomeComponentSlot,
  },
  data(){
    return{
      options:{
        className:'card',
        title:'Epic喜加一',
        icon:'epicgames',
        type:'games',
        epicShow:true,
      },
      teaserTips:[
        { id:0, name:'本周免费',},
        { id:1,name:'下周预告'}
      ],
      epicAppShow:false,
      weekIndex:0,
    }
  },
  mounted(){
     this.getEpicData()
  },
  computed:{
    ...mapWritableState(steamStore,["epicList"])
  },
  methods:{
    ...mapActions(steamStore,['setEpicData']),
    getEpicData(){
       sendRequest('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions',3).then(res=>{
         const epicData = res.data.data.Catalog.searchStore.elements
         // 获取下周预告的数据
         const epicIndex = epicData.filter(el=>{
           return el.promotions !== null 
         })
         console.log(epicIndex);
       })
    },
    weekPick(val){
      this.weekIndex = val
    }
  },
  watch:{
   
  },

  
}
</script>

<style lang="scss" scoped>
.change-item{
  width: 122px;
}
.epic-active{
  background: rgba(42, 42, 42, 0.8);
  border-radius: 6px;
}
</style>
