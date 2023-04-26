<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex" >
    <template v-if="epicAppShow === false">
      <div class="flex h-11 justify-between items-center  p-1 rounded-md mt-2" style="background: rgba(255, 255, 255, 0.1);">
        <span class="flex items-center h-9 cursor-pointer justify-center change-item" :class="weekIndex === item.id ? 'epic-active':''" v-for="item in teaserTips" @click="weekPick(item.id)">
           {{ item.name }}
        </span>
      </div>
      <div v-if="weekIndex === 0" class="w-full">
         <div class="week-image rounded-lg relative cursor-pointer"  v-for="weekItem in weekEpic" @click="enterWeek(weekItem)">
            <img class="rounded-lg" :src="weekItem.keyImages[0].url" alt="" style="width:100%;height:100%;object-fit: cover;">
            <div class="remainder-day">剩余{{remainderDay(weekItem.promotions.promotionalOffers[0].promotionalOffers[0].endDate)}}天</div>
            <div class="stablish-province">立省  {{weekItem.price.totalPrice.fmtPrice.originalPrice}}</div>
         </div>
      </div>
      <div v-else class="w-full">
        <div class="week-image rounded-lg relative cursor-pointer"  v-for="weekItem in nextWeekEpic" @click="enterWeek(weekItem)">
          <img class="rounded-lg" :src="weekItem.keyImages[0].url" alt="" style="width:100%;height:100%;object-fit: cover;">
          <div class="remainder-day">剩余{{remainderDay(weekItem.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate)}}天</div>
          <div class="stablish-province">立省  {{weekItem.price.totalPrice.fmtPrice.originalPrice}}</div>
       </div>
      </div>
    </template>
    <template v-if="epicAppShow === true">
       <div class="flex mt-2 flex-col justify-start">
          <div class="epic-detail-image rounded-lg">
            <img :src="epicDetail.image" alt="" class="rounded-lg">
          </div>
          <span class="mt-3">{{ epicDetail.name }}</span>
          <span class="content-introduction mt-2">{{epicDetail.illustrate}}</span>
          <span class="line-through mt-2" style="color: rgba(151, 151, 151, 1);">{{epicDetail.price}}</span>
          <div class="flex justify-between mt-2">
            <span style="color: rgba(255, 77, 79, 1);">免费领取</span>
            <span style="background: rgba(255, 77, 79, 1); padding: 1px 7px 3px 6px;border-radius: 4px;">剩余{{ weekIndex === 0 ? remainderDay(epicDetail.weekDate) : remainderDay(epicDetail.nextWeekDate)  }}天</span>
          </div>
          <div class="flex justify-between mt-4">
              <span @click="epicBack" class="w-12 h-12 cursor-pointer epic-back flex items-center rounded-lg justify-center" style="background: rgba(42, 42, 42, 1);">
                 <Icon icon="xiangzuo" class="text-xl"></Icon>
              </span>
              <span @click="onClickOffice(epicDetail.productSlug)" class="h-12 w-48 open-epic  cursor-pointer flex items-center rounded-lg justify-center" style="background: rgba(42, 42, 42, 1);">打开 Epic</span>
          </div>
       </div>
    </template>
      
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue"
import { sendRequest,startOfNextWeek,startOfWeek } from "../../../js/axios/api";
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
<<<<<<< HEAD
        epicShow:true,
=======
        epicShow:false,
>>>>>>> wjl-delevlop-37-epic
      },
      teaserTips:[
        { id:0, name:'本周免费',},
        { id:1,name:'下周预告'}
      ],
      epicAppShow:false,
      weekIndex:0,
      epicList:[],
      epicDetail:{},
    }
  },
  mounted(){
    this.getEpicData()
  },

  computed:{
     weekEpic(){
        const weekEpicIndex = this.epicList.filter(el=>{
           if(el.promotions.promotionalOffers.length !== 0){
              const startPromotions = el.promotions.promotionalOffers[0]
              const startDate = new Date(startPromotions.promotionalOffers[0].startDate)
              const endDate = new Date(startPromotions.promotionalOffers[0].startDate)
              const ofWeek = new Date(startOfWeek())
              const nextWeek = new Date(startOfNextWeek())
              return startDate.getTime() < ofWeek.getTime() && endDate.getTime() < nextWeek.getTime()
           }
        })
        return weekEpicIndex
     },
     nextWeekEpic(){
        const nextWeekEpicIndex = this.epicList.filter(el=>{
           if(el.promotions.upcomingPromotionalOffers.length !== 0){
              const nextPromotions = el.promotions.upcomingPromotionalOffers[0]
              const nextStartDate = new Date(nextPromotions.promotionalOffers[0].startDate)
              const nextEndDate = new Date(nextPromotions.promotionalOffers[0].startDate)
              const ofWeek = new Date(startOfWeek())
              const nextWeek = new Date(startOfNextWeek())
              return nextStartDate.getTime() > ofWeek.getTime() && nextEndDate.getTime(),nextWeek.getTime()
           }
        })
        return nextWeekEpicIndex
     },
  },

  methods:{
    getEpicData(){
       sendRequest('https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN',3).then(res=>{
         const epicData = res.data.data.Catalog.searchStore.elements
         // 根据promotions判断Epic是否免费
         const epicIndex = epicData.filter(el=>{
           return el.promotions !== null 
         })
         this.epicList = epicIndex
       })
    },
    weekPick(val){
      this.weekIndex = val
    },
    enterWeek(item){
      this.epicAppShow = true
      if(item.promotions.promotionalOffers.length !== 0){
        const promotions = item.promotions.promotionalOffers[0].promotionalOffers[0]
        this.epicDetail = {
         image:item.keyImages[0].url,
         name:item.title,
         price:item.price.totalPrice.fmtPrice.originalPrice,
         illustrate:item.description,
         weekDate:promotions.endDate,
         productSlug:item.productSlug
        }
      }else if(item.promotions.upcomingPromotionalOffers.length !== 0){
        const upcomingPromotional = item.promotions.upcomingPromotionalOffers[0].promotionalOffers[0]
        this.epicDetail = {
         image:item.keyImages[0].url,
         name:item.title,
         price:item.price.totalPrice.fmtPrice.originalPrice,
         illustrate:item.description,
         nextWeekDate:upcomingPromotional.endDate,
         productSlug:item.productSlug
        }
      }  
    },
    // 计算剩余多少天
    remainderDay(date){
       // 假设要计算的日期为2023年6月1日
       let targetDate = new Date(date);
       // 获取当前日期
       let currentDate = new Date();
       // 计算剩余天数
       let remainingDays = Math.ceil((targetDate - currentDate) / (1000 * 60 * 60 * 24));
       // 输出剩余天数
       return remainingDays
    },
    epicBack(){
      this.epicAppShow = false
    },
    // 进入详情网站
    onClickOffice(value){
      if(value !== null){
        console.log(`https://store.epicgames.com/zh-CN/p/${value}`);
        window.ipc.send('addTab',{url:`https://store.epicgames.com/zh-CN/p/${value}`})
      }
    }

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
.week-image{
  width: 252px;
  height: 144px;
  &:nth-of-type(1){
    margin-bottom: 16px;
    margin-top: 14px;
  }
}
.remainder-day{
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(255, 77, 79, 1);
  padding: 3px 10px 2px 8px;
  border-top-right-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  width: 80px;
}
.stablish-province{
  position: absolute;
  top:1.99em;
  right: 0;
  padding: 3px 6px 2px 6px;
  text-align: center;
  width: 80px;
  background: rgba(0, 0, 0, 0.65);
  border-bottom-left-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
}
.epic-detail-image{
  width: 252px;
  height: 144px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.content-introduction{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}
.epic-back:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
.open-epic:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
</style>
