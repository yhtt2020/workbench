<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
     <div style="margin-top: 1em;">
       <div class="flex w-full cursor-pointer" style="margin-top: 0.3em;" v-for="item in list">
          <div class="w-1/3 h-20" style="margin-right:10px;">
            <img :src="item.image" alt="" class="rounded-lg" style="width: 100%; height:100%;object-fit: cover;">
          </div>
          <div class="flex w-2/3 flex-col">
            <div class="w-full truncate name" style="line-height: 20px;margin-bottom: 0.25em;" >{{item.name}}</div>
            <div class="active-type">
              <span v-for="activeItem in item.genres" class="bg-white rounded-md bg-opacity-10 active-item  ">{{activeItem.description}}</span>
            </div>
            <span class="initial-price line-through">¥{{item.initial_price}}</span>
            <div class="flex justify-between">
              <div class="flex w-2/3">
                <span class="text-red-600">¥{{item.final_price}}</span>
                <span v-if="item.address === 'CNY'" class="address">(中国区)</span>
              </div>
              <span class="bg-red-600 w-12 text-center rounded-md">-{{ item.discount_percent }} %</span>
            </div>
          </div>
       </div>
     </div> 
  </HomeComponentSlot>
</template>

<script>
import Icon from '@ant-design/icons-vue/lib/components/Icon';
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
    Icon,
    HomeComponentSlot
  },
  data(){
    return{
      options:{
        className:'card',
        title:'今日折扣',
        icon:'game',
        type:'games'
      },
      list:[]
    }
  },
  mounted(){
    this.getDiscountData()
  },
  computed:{
    ...mapWritableState(cardStore,['gameData'])
  },
  methods:{
    ...mapActions(cardStore,['getGameOffers']),
    getDiscountData(){
      requestData('https://store.steampowered.com/api/featuredcategories/?cc=cn&l=cn').then(res=>{
        const data = res.data.specials.items
        const randomArr = randomData(data,4)
        this.getGameOffers(randomArr)
        this.gameData.forEach(el=>{
          this.getAppList(el)
        })
      }).catch(err=>{
        console.error(err)
      })
    },
    getAppList(el){
      requestData(`https://store.steampowered.com/api/appdetails/?appids=${el.id}`).then(res=>{
        if(res.status === 200){
          console.log(res.data[el.id].data);
          const appObj = {
            id:el.id,
            image:el.header_image,
            name:el.name,
            discount_percent:el.discount_percent,
            genres:res.data[el.id].data.genres.splice(0,2),
            initial_price:(el.original_price / 100).toFixed(2),
            final_price:(el.final_price / 100).toFixed(2),
            address:res.data[el.id].data.price_overview.currency
          }  
          this.list.push(appObj)
        }
      }).catch(err=>{
        console.error(err);
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.active-type{
  display: flex;
  flex-wrap: wrap;
  .active-item{
    flex: 0 0 calc(33.33% - 10px);
    padding: 1px 6px;
    margin: 0 4px 5px 0;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }
}
.initial-price{
  font-size: 10px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
}

.address{
 font-size: 10px;
 font-weight: 400;
 color: rgba(255, 255, 255, 0.4);
 margin-left: 1.25em;
 margin-top: 0.25em;
}
</style>