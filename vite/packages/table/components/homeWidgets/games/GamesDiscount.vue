<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex">
      <template v-if="gameShow ===false">
        <div class="discount-item flex flex-col" style="margin-top: 1em;">
          <div class="flex flex-col ">
           <div class="w-full flex cursor-pointer" @click="enterDetail(item)"  v-for="item in list" style="height:65px; margin-bottom: 12px;">
             <img :src="item.header_image" alt="" class=" rounded-md" style="width:140px;height:65px; object-fit: cover;"> 
             <div class="flex  discount-content flex-col" style="margin-left: 10px; width: 104px;">
              <div class="name truncate" style="width: 100%; margin-bottom: 10px;">{{item.name}}</div>
              <span class="line-through text-white text-opacity-60" style="font-size: 10px;">
                {{currencyFormat(item.original_price,item.currency)}}
              </span>
              <div class="flex w-full justify-between ">
                <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 14px;font-weight: 500;">
                 {{ currencyFormat(item.final_price,item.currency) }}    
                </span>
                <div style="flex justify-end">
                 <span class="rounded-md" style="background: rgba(255, 77, 79, 1); padding: 3px 10.23px;font-size: 12px;">
                   -{{item.discount_percent}}%
                  </span>
                </div>
              </div>
             </div>
           </div>
          </div>
          <div class="bg-black change bg-opacity-10 flex rounded-lg cursor-pointer" @click="discountChange" style="padding:13px 80px;">
           <Icon icon="reload" class="animate-spin" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-if="reloadShow === true"></Icon>
           <Icon icon="reload" style="font-size: 1.429em;color: rgba(255, 255, 255, 0.85);" v-else></Icon>
           <span style="margin-left: 1em;color: rgba(255, 255, 255, 0.85);">换一换</span>
          </div>
        </div>
      </template>
      <template v-if="gameShow === true">
        <a-spin v-if="isLoading === true" style="display: flex; justify-content: center; align-items:center;"></a-spin>
        <div class="flex flex-grow flex-col" style="margin-top: 14px;" v-else>
          <div class="detail-image rounded-lg" style="margin-bottom: 14px;">
             <img class="rounded-lg" :src="detailList.header_image" alt="">
          </div>
          <div style="margin-bottom: 6px; font-size: 18px;font-weight: 500;">{{detailList.name}}</div>
          <span class="content-introduction text-white text-opacity-60">{{detailList.short_description}}</span>
          <div class="flex" style="margin-bottom: 10px;">
            <span class="discount-description rounded-md bg-white bg-opacity-20 "  v-for="item in detailList.genres">{{item.description}}</span>
          </div>
          <span class="line-through text-white text-opacity-60" style="font-size: 12px;">
            {{detailList.price_overview.initial_formatted}}
          </span>
          <div class="flex w-full justify-between " style="margin-bottom: 16px;">
            <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 500; padding-right: 2.41em;">
             {{detailList.price_overview.final_formatted}}    
            </span>
            <div class="flex justify-end">
              <span class="rounded-md" style="background:rgba(255, 77, 79, 1); padding: 3px 10.23px;font-size: 12px;">
               -{{detailList.price_overview.discount_percent}}%
              </span>
            </div>
          </div>
          <div class="flex items-center justify-around"> 
            <div @click="discountBack()" class="bg-black change cursor-pointer bg-opacity-10 rounded-lg w-12 h-12 flex items-center justify-center">
              <Icon icon="xiangzuo" style="font-size: 1.715em;color: rgba(255, 255, 255, 0.85);"></Icon>
            </div>
            <div class="bg-black change flex items-center justify-center  rounded-lg  h-12 cursor-pointer bg-opacity-10" @click="openSteam(detailList.steam_appid)" style="width:196px;color: rgba(255, 255, 255, 0.85);">打开steam</div>
          </div>
        </div>
      </template>
  </HomeComponentSlot>
</template>

<script>
import HomeComponentSlot from "../HomeComponentSlot.vue";
import {randomData,sendRequest,currencyFormat} from '../../../js/axios/api'
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
      isLoading:false
    }
  },
  computed:{
     ...mapWritableState(steamStore,["gameData","gameRegion"])
  },
  mounted(){
    this.loadGameData()
    this.getRandomData()
  },
  methods:{
    ...mapActions(steamStore,["loadGameData","fetchDetail"]),
    currencyFormat,
    getRandomData(){
      const randomArr = randomData(this.gameData,4)
      this.list = randomArr
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
      this.fetchDetail(item.id,this.gameRegion.id)
      if(!this.isLoading){
        this.isLoading = true
        setTimeout(()=>{
          const getDetail = window.localStorage.getItem('detailData')
          this.detailList = JSON.parse(getDetail)
          this.$nextTick(()=>{
            this.isLoading = false
          })
        },500)
      }
    },
     discountBack(){
      this.gameShow = false
      window.localStorage.removeItem('detailData')
     },
     openSteam(id){
      window.ipc.send('addTab',{url:`https://store.steampowered.com/app/${id}`})
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
.animate-spin{
  animation: spin 0.8s linear infinite !important;
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>