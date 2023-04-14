<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex">
    <div class="discount-item flex flex-col" style="margin-top: 1em;">
       <div class="flex flex-col ">
        <div class="w-full h-20 flex" v-for="item in list" style="margin-bottom: 20px;">
           <img :src="item.image" alt="" class="h-20 rounded-md" style="width:120px; object-fit: cover;">
           <div class="flex  discount-content flex-grow flex-col" style="margin-left: 10px;">
              <div class="name truncate h-20" >{{item.name}}</div>
              <div class="flex flex-row">
<!--                <span  class="bg-white bg-opacity-40 rounded-md text-white text-opacity-60" v-for="activeItme in item.genres" style="padding: 0 6px; margin-right: 4px; font-size: 12px;">-->
<!--                  {{ activeItme.description}}-->
<!--                </span>-->
              </div>
              <span class="line-through text-white text-opacity-60" style="font-size: 10px;">￥{{item.initial_price}}</span>
              <div class="flex justify-between " style="width: 100%">
                 <span style="color:rgba(255, 77, 79, 1);font-size: 14px;font-weight: 400;">￥{{item.final_price}}</span>
                 <span class="bg-red-600 rounded-md" style="padding: 2px 7px;float: right">-{{item.discount_percent}}%</span>
              </div>
           </div>
        </div>
       </div>
       <div class=" flex rounded-md cursor-pointer" @click="discountChange" style="padding:13px 80px;background: #1f1f1f">
        <Icon icon="reload" style="font-size: 1.429em;"></Icon>
        <span style="margin-left: 1em;">换一换</span>
       </div>
    </div>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import {requestData,randomData} from '../../../js/axios/api'
import { mapWritableState,mapActions ,mapState} from 'pinia'
import {cardStore} from '../../../store/card'
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
      list:[]
    }
  },
  mounted(){
    this.getDiscountData()
  },
  computed:{
    ...mapWritableState(cardStore,['gameData']),
  },
  methods:{
    ...mapActions(cardStore,['getGameOffers']),
    getDiscountData(){
      requestData('https://store.steampowered.com/api/featuredcategories/?cc=cn&l=cn').then(res=>{
        const data = res.data.specials.items
        this.gameData = []
        const randomArr = randomData(data,3)
        this.getGameOffers(randomArr)
        this.gameData.forEach(el=>{
          this.getAppList(el)
        })
      }).catch(err=>{
        console.error(err)
      })
    },
    getAppList(el){
      const appObj = {
        id:el.id,
        image:el.large_capsule_image,
        name:el.name,
        discount_percent:el.discount_percent,
        // genres:res.data[el.id].data.genres.splice(0,2),
        initial_price:(el.original_price / 100).toFixed(2),
        final_price:(el.final_price / 100).toFixed(2),
        // address:res.data[el.id].data.price_overview.currency
      }
      this.list.push(appObj)
    },
    // 点击切换
    discountChange(){
      // this.getDiscountData()
      // // console.log(1);
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
</style>
