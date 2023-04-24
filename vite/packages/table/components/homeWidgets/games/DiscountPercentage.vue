<template>
  <HomeComponentSlot :options="options" :confirmCCData="confirmCCData" :customIndex="customIndex" :customData="customData">
    <template v-if="detailShow === false">
      <swiper  @touchstart.stop @touchmove.stop @touchend.stop  :spaceBetween="30" :loop="true" :autoplay="{ delay: 2500,disableOnInteraction: false,}" :pagination="{clickable:true}" :modules="modules" class="mySwiper" >
        <swiper-slide v-for="item in groupList">
          <div class="w-full  cursor-pointer  mt-5" v-for="imgItem in item[0]" @click="goToGameAppDetails(imgItem)"   style="height:118px;position: relative;">
            <img :src="imgItem.header_image" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
            <div class="right-top w-14 text-center bg-black bg-opacity-70" style="border-top-left-radius: 7px;border-bottom-right-radius: 7px;">-{{imgItem.discount_percent}}%</div>
          </div>
        </swiper-slide>
      </swiper>

      <div class="mt-12 flex change bg-black bg-opacity-10 rounded-lg cursor-pointer" @click="discountChange" style="padding:13px 80px;">
        <Icon icon="reload" class="animate-spin duration-100" style="font-size: 1.429em; color:rgba(255, 255, 255, 0.85);" v-if="reloadShow === true"></Icon>
        <Icon icon="reload" style="font-size: 1.429em; color: rgba(255, 255, 255, 0.85);" v-else></Icon>
        <span style="margin-left: 1em;color: rgba(255, 255, 255, 0.85);">换一换</span>
      </div>
    </template>
    <template v-if="detailShow === true">
      <a-spin v-if="isLoading === true" style="display: flex; justify-content: center; align-items:center;margin-top: 60%"></a-spin>
       <div class="flex flex-grow flex-col" style="margin-top: 14px;" v-else>
          <div class="detail-image rounded-lg" style="margin-bottom: 14px;">
             <img class="rounded-lg" :src="dpList.header_image" alt="">
          </div>
          <div class="truncate" style="font-size: 18px;font-weight: 500;">{{dpList.name}}</div>
          <span class="content-introduction" style="color: rgba(255, 255, 255, 0.6);font-size: 16px;font-weight: 400;">{{dpList.short_description}}</span>
          <div class="flex" style="margin-bottom: 8px;">
            <span class="discount-description rounded-md" style="background: rgba(255, 255, 255, 0.2);color: rgba(255, 255, 255, 0.6);font-size: 12px;font-weight: 500;"  v-for="item in dpList.genres">{{item.description}}</span>
          </div>
          <span class="line-through text-white text-opacity-60" style="font-size: 12px;">
            {{dpList.price_overview.initial_formatted}}
          </span>
          <div class="flex w-full justify-between " style="margin-bottom: 16px;">
            <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 400; padding-right: 2.41em;">
             {{dpList.price_overview.final_formatted}}
            </span>
            <div class="flex justify-end">
             <span class="rounded-md" style="background:rgba(255, 77, 79, 1); padding: 3px 10.23px;font-size: 12px;">
               -{{dpList.price_overview.discount_percent}}%
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
import {randomData,sendRequest,compareTime} from '../../../js/axios/api'
import { mapWritableState,mapActions ,mapState} from 'pinia'
import {steamStore} from '../../../store/steam'
import { cardStore } from "../../../store/card";
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination,Autoplay } from 'swiper';

export default {
  name:'GamesDiscount',
  props:{
    customIndex:{
      type:Number,
      default:0
    },
    customData:{
      type:Object,
      default: ()=>{}
    },
    confirmCCData:{
      type:Function,
      default:()=>{}
    }
  },
  components:{
    HomeComponentSlot,
    Swiper,
    SwiperSlide,
  },
  data(){
    return{
      options:{
        className:'card',
        title:'Steam折扣推荐',
        icon:'steam',
        type:'games'
      },
      percentageList:[],
      reloadShow:false,
      groupList:[],
      detailShow:false,
      dpList:{},
      id:'',
      isLoading:false
    }
  },
  mounted(){
    this.groupData()
  },
  computed:{
    ...mapWritableState(steamStore,["data","dataDetail"]),
    ...mapWritableState(cardStore,["customComponents"])
  },
  methods:{
    ...mapActions(steamStore,["setGameDetail","updateGameData"]),
    // 将数据分成五组
    groupData() {
      if(this.data.length !== 0){
        const dataIndex = this.data.find(el=>{  // 根据地区卡片的区服将数据取出
          return this.customData.id === el.cc
        })
        if(dataIndex){
          const discountList = this.data[this.data.indexOf(dataIndex)]
          this.percentageList = discountList.list
          let groups = [];
          for (let i = 0; i < 5; i++) {
            groups.push([]);
          }
          groups.forEach((arr) => (arr.length = 0));
          // 随机获取两条数据，放入五个数组中
          for (let i = 0; i < groups.length; i++) {
            const index = randomData(this.percentageList,2);
            groups[i].push(index)
          }
          this.groupList = groups
        }
      }
    },
    // 海报进入详情
    goToGameAppDetails(item){
      this.detailShow = true
      if(!this.isLoading){
        this.isLoading = true
        setTimeout(()=>{
          sendRequest(`https://store.steampowered.com/api/appdetails?appids=${item.id}&cc=${this.customData.id}&l=${this.customData.id}`,3).then(res=>{
            const resData = res.data[item.id]
            this.setGameDetail(resData)
          })
          this.$nextTick(()=>{
            this.isLoading = false
          })
        },500)
      }
      this.dpList = this.dataDetail.data
    },
    // 按钮点击切换
    discountChange(){
      this.reloadShow = true
      setTimeout(()=>{
        this.groupData()
        this.reloadShow = false
      },300)
    },
    // 返回
    discountBack(){
      this.detailShow = false
      this.groupData()
      window.localStorage.removeItem('detail')
    },
    // 打开steam官网
    openSteam(id){
      window.ipc.send('addTab',{url:`https://store.steampowered.com/app/${id}`})
    }
  },
  setup() {
    return {
      modules: [Pagination,Autoplay],
    };
  },
}
</script>

<style lang="scss" scoped>
.right-top{
  position: absolute;
  top: 0;
  left: 0;

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
  animation: spin 0.3s linear infinite !important;
}
</style>
<style>
.swiper-pagination-bullet{
  background:rgba(255, 255, 255, 0.4) !important;
}
.swiper-pagination{
  position: fixed !important;
  bottom: 4.95em !important;
}

</style>
