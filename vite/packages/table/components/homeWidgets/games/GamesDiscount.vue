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
       <div class="bg-black flex rounded-md cursor-pointer" @click="discountChange" style="padding:13px 80px;">
        <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;" v-if="reloadShow === true"></Icon>
        <Icon icon="reload" style="font-size: 1.429em;" v-else></Icon>
        <span style="margin-left: 1em;">换一换</span>
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
    ...mapWritableState(steamStore,['gameData','randomData']),
  },
  methods:{
    ...mapActions(steamStore,['getGameOffers']),
    // 页面加载获取数据
    getDiscountData(){
      requestData('https://store.steampowered.com/api/featuredcategories/?cc=cn&l=cn').then(res=>{
        const data = res.data.specials.items
        this.getGameOffers(data)
      }).catch(err=>{
        console.error(err)
      })
    },
    getRandomData(){
      const randomArr = randomData(this.gameData,3)
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
    // getAppList(el){
    //   requestData(`https://store.steampowered.com/api/appdetails/?appids=${el.id}`).then(res=>{
    //     if(res.data[el.id].success === true){
    //       console.log(res.data);
    //     }
    //     // if(res.data[el.id].success === true && res.status === 200 ){
    //     //   const appObj = {
    //     //     id:el.id,
            // image:el.header_image,
            // name:el.name,
    //     //     discount_percent:el.discount_percent,
    //     //     genres:res.data[el.id].data.genres.splice(0,2),
            // initial_price:(el.original_price / 100).toFixed(2),
            // final_price:(el.final_price / 100).toFixed(2),
            // address:res.data[el.id].data.price_overview.currency
    //     //   }  
    //     //   this.list.push(appObj)
    //     //   // if(this.list.length > 3){
    //     //   //   console.log('更新',this.list);
    //     //   //   this.list = []
    //     //   // }else{
    //     //   //   this.list.push(appObj)
    //     //   //   console.log('添加',this.list);
    //     //   // }
    //     //   // if(this.list.length > 3){
    //     //   //   this.list = []
    //     //   // }else{
    //     //   //   this.list.push(appObj)
    //     //   // }
    //     // }
    //   }).catch(err=>{
    //     console.error(err);
    //   })
    // },
    // 点击切换
    discountChange(){
      this.reloadShow = true
      setTimeout(()=>{
        this.getRandomData()
        this.reloadShow = false
      },1000)
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