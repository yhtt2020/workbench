<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex">
      <template v-if="gameShow ===false">
        <div class="discount-item flex flex-col" style="margin-top: 1em;">
          <div class="flex flex-col ">
           <div class="w-full flex cursor-pointer" @click="enterDetail(item.id)"  v-for="item in list" style="height:65px; margin-bottom: 12px;">
             <img :src="item.image" alt="" class=" rounded-md" style="width:140px;height:65px; object-fit: cover;"> 
             <div class="flex  discount-content flex-col" style="margin-left: 10px;">
                 <div class="name truncate" >{{item.name}}</div>
                 <span class="line-through text-white text-opacity-60" style="font-size: 10px;">
                   ￥{{item.initial_price}}
                 </span>
                 <div class="flex w-full justify-between ">
                    <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 13px;font-weight: 400; padding-right: 1.2em;">
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
      </template>
      <template v-if="gameShow === true">
        <div class="flex flex-grow flex-col" style="margin-top: 14px;">
          <div class="detail-image rounded-lg" style="margin-bottom: 14px;">
             <img class="rounded-lg" :src="detailList.img" alt="">
          </div>
          <div style="margin-bottom: 6px;">{{detailList.name}}</div>
          <span class="content-introduction">{{detailList.short_description}}</span>
          <div class="flex" style="margin-bottom: 12px;">
            <span class="discount-description rounded-md bg-white bg-opacity-40"  v-for="item in detailList.genres">{{item.description}}</span>
          </div>
          <span class="line-through text-white text-opacity-60" style="font-size: 12px;margin-bottom: 6px;">
            {{detailList.initial_price}}
          </span>
          <div class="flex w-full justify-between " style="margin-bottom: 16px;">
            <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 400; padding-right: 2.41em;">
             {{detailList.final_price}}    
            </span>
            <div class="flex justify-end">
             <span class="rounded-md" style="color:rgba(255, 77, 79, 1); padding: 3px 6px 3px 7px;font-size: 12px;">
               -{{detailList.discount_percent}}%
              </span>
            </div>
          </div>
          <div class="flex items-center justify-around"> 
            <div @click="discountBack()" class="bg-black change cursor-pointer bg-opacity-10 rounded-lg w-12 h-12 flex items-center justify-center">
              <Icon icon="xiangzuo" style="font-size: 1.715em;color: rgba(255, 255, 255, 0.85);"></Icon>
            </div>
            <div class="bg-black change flex items-center justify-center  rounded-lg  h-12 cursor-pointer bg-opacity-10" @click="openSteam" style="width:196px;color: rgba(255, 255, 255, 0.85);">打开steam</div>
          </div>
       </div>
      </template>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import {sendRequest,randomData} from '../../../js/axios/api'
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
      reloadShow:false,
      gameShow:false,
      detailList:{},
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
      sendRequest(`https://store.steampowered.com/api/featuredcategories/?cc=${this.gameRegion}&l=${this.gameRegion}`).then(res=>{
        const data = res.data.specials.items
        this.getGameOffers(data)
        this.getRandomData()
      }).catch(err=>{
        console.error(err)
      })
    },
    getRandomData(){
      const gameData = window.localStorage.getItem('gameData')
      const randomArr = randomData(JSON.parse(gameData),4)
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
    },
    // 点击进入详情
    enterDetail(item){
      this.gameShow = true
      sendRequest(`https://store.steampowered.com/api/appdetails?appids=${item}`).then(res=>{
        if(res.data[item].success === true){
          this.detailList = {
            id:res.data[item].data.steam_appid,
            img:res.data[item].data.header_image,
            name:res.data[item].data.name,
            genres:res.data[item].data.genres,
            final_price:res.data[item].data.price_overview.final_formatted,
            initial_price:res.data[item].data.price_overview.initial_formatted,
            discount_percent:res.data[item].data.price_overview.discount_percent,
            short_description:res.data[item].data.short_description
          }
        }
      })
    },
    discountBack(){
      this.gameShow = false
    },
    openSteam(){
      window.ipc.send('addTab',{url:`https://store.steampowered.com/app/${this.id}`})
    }
  }
}
</script>

<style  lang="scss" scoped>
.discount-item{

  .discount-content{
     .name{
      max-width: 104px;
     }
  }
}
.change:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}

.detail-image{
  width: 100%;
  height: 118px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.discount-description{
  line-height: 20px;
  margin-right:4px;
  padding:1px 6px;
  color:rgba(255, 255, 255, 0.6);
}
.change:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
.content-introduction{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  margin-bottom: 5px;
}
</style>