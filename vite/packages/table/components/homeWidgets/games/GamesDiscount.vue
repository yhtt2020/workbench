<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex">
    <div class="discount-item flex flex-col" style="margin-top: 1em;">
      <div class="flex flex-col ">
       <div class="w-full h-20 flex" v-for="item in list" style="margin-bottom: 20px;">
         <img :src="item.image" alt="" class="h-20 rounded-md" style="width:120px; object-fit: cover;"> 
         <div class="flex  discount-content flex-col" style="margin-left: 10px;">
             <div class="name truncate h-20" >{{item.name}}</div>
             <!-- <div class="flex flex-row">
               <span  class="bg-white bg-opacity-40 rounded-md text-white text-opacity-60" v-for="activeItme in item.genres" style="padding: 0 6px; margin-right: 4px; font-size: 12px;">
                 {{ activeItme.description}}
               </span>
             </div> -->
             <span class="line-through text-white text-opacity-60" style="font-size: 10px;">
               ￥{{item.initial_price}}
             </span>
             <div class="flex w-full justify-between ">
                <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 13px;font-weight: 400; padding-right: 2.41em;">
                 ￥{{item.final_price}}    
                </span>
                <div style="flex justify-end">
                 <span class="bg-red-600 rounded-md" style="padding: 3px 6px 3px 7px;font-size: 12px;">
                   -{{item.discount_percent}}%
                  </span>
                </div>
             </div>
         </div>
       </div>
      </div>
      <div class="bg-black change bg-opacity-10 flex rounded-md cursor-pointer" @click="discountChange" style="padding:13px 80px;">
       <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-if="reloadShow === true"></Icon>
       <Icon icon="reload" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-else></Icon>
       <span style="margin-left: 1em;color: rgba(255, 255, 255, 0.85);">换一换</span>
      </div>
    </div>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import {requestData,randomData} from '../../../js/axios/api'
import { mapWritableState,mapActions ,mapState} from 'pinia'
import {steamStore} from '../../../store/steam'
export default {
  name:'GamesDiscount',
  props:{
    customIndex:{
      type:Number,
      default:0
    }
  },
  components:{
    HomeComponentSlot
  },
  data(){
    return{
      options:{
        className:'card',
        title:'Steam折扣推荐',
        icon:'steam',
        type:'games'
      },
      list:[],
      reloadShow:false
    }
  },
  mounted(){
    this.getDiscountData()
    this.getRandomData()
  },
  computed:{
    ...mapWritableState(steamStore,['gameRegion'])
  },
  methods:{
    ...mapActions(steamStore,['getGameOffers']),
    getDiscountData(){
      requestData(`https://store.steampowered.com/api/featuredcategories/?cc=${this.gameRegion}&l=${this.gameRegion}`).then(res=>{
        const data = res.data.specials.items
        this.getGameOffers(data)
        this.getRandomData()
      }).catch(err=>{
        console.error(err)
      })
    },
    getRandomData(){
      const gameData = window.localStorage.getItem('gameData')
      const randomArr = randomData(JSON.parse(gameData),3)
      const listArr = []
      randomArr.forEach(el=>{
         listArr.push({
            id:el.id,
            image:el.header_image,
            name:el.name,
            discount_percent:el.discount_percent,
            initial_price:(el.original_price / 100).toFixed(2),
            final_price:(el.final_price / 100).toFixed(2),
         })
      })
      this.list = listArr
    },

    // 点击切换
    discountChange(){
      this.reloadShow = true
      setTimeout(()=>{
        this.getRandomData()
        this.reloadShow = false
      },800)
    }
  }
}
</script>

<style  lang="scss" scoped>
.discount-item{

  .discount-content{
     .name{
      max-width: 121px;
     }
  }
}
.change:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
</style>