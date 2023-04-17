
<template>
  <HomeComponentSlot :options="options"  :customIndex="customIndex">
    <template v-if="detailShow === false">
      <div class="w-full  cursor-pointer" @click="goToGameAppDetails(imgItem)"  v-for="imgItem in discountList" style="height:118px;margin-bottom:14px;margin-top: 0.65em;position: relative;">
       <img :src="imgItem.image" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
       <div class="right-top w-14 text-center bg-black bg-opacity-70" style="border-top-left-radius: 8px;border-bottom-right-radius: 8px;">-{{imgItem.discount_percent}}%</div>
       <span class="truncate" style="color: rgba(255, 255, 255, 0.85); position: absolute;bottom: 18px;left: 14px;width: 144px;">{{imgItem.name}}</span>
      </div>
      <div class=" flex change bg-black bg-opacity-10 rounded-md cursor-pointer" @click="discountChange" style="padding:13px 80px;">
        <Icon icon="reload" class="animate-spin" style="font-size: 1.429em; color:rgba(255, 255, 255, 0.85);" v-if="reloadShow === true"></Icon>
        <Icon icon="reload" style="font-size: 1.429em; color: rgba(255, 255, 255, 0.85);" v-else></Icon>
        <span style="margin-left: 1em;color: rgba(255, 255, 255, 0.85);">换一换</span>
      </div>
    </template>
    <template v-if="detailShow === true">
       <div class="flex flex-grow flex-col" style="margin-top: 14px;">
          <div class="detail-image rounded-lg" style="margin-bottom: 14px;">
             <img class="rounded-lg" :src="detailList.image" alt="">
          </div>
          <div style="margin-bottom: 6px;">{{detailList.name}}</div>
          <span class="content-introduction">{{briefIntroduction}}</span>
          <div class="flex" style="margin-bottom: 12px;">
            <span class="discount-description rounded-md bg-white bg-opacity-40"  v-for="item in genres">{{item.description}}</span>
          </div>
          <span class="line-through text-white text-opacity-60" style="font-size: 12px;margin-bottom: 6px;">
            ￥{{detailList.initial_price}}
          </span>
          <div class="flex w-full justify-between " style="margin-bottom: 16px;">
            <span style="color:rgba(255, 77, 79, 1); line-height: 21px; font-size: 16px;font-weight: 400; padding-right: 2.41em;">
             ￥{{detailList.final_price}}    
            </span>
            <div class="flex justify-end">
             <span class="bg-red-600 rounded-md" style="padding: 3px 6px 3px 7px;font-size: 12px;">
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
import {randomData, requestData} from '../../../js/axios/api'
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
      discountList:[],
      reloadShow:false,
      detailShow:false,
      detailList:'',
      genres:[],
      id:'',
      briefIntroduction:''
    }
  },
  mounted(){
     this.getPercentage()
  },
  methods:{
    getPercentage(){
      const gameData = window.localStorage.getItem('gameData')
      const randomAppList = randomData(JSON.parse(gameData),2)
      const disList = []
      randomAppList.forEach(el=>{
        disList.push({
          id:el.id,
          name:el.name,
          image:el.header_image,
          discount_percent:el.discount_percent,
          initial_price:(el.original_price / 100).toFixed(2),
          final_price:(el.final_price / 100).toFixed(2),
        })
      })
      this.discountList = disList
    },
    goToGameAppDetails(item){
      this.detailShow = true
      requestData(`https://store.steampowered.com/api/appdetails?appids=${item.id}`).then(res=>{
        if(res.data[item.id].success !== false){
          console.log(res.data[item.id].data.short_description);
          this.genres = res.data[item.id].data.genres
          this.briefIntroduction = res.data[item.id].data.short_description
        }
      })
      this.detailList = item
      this.id = item.id
      console.log(this.id);
    },
    // 按钮点击切换
    discountChange(){
      this.reloadShow = true
      setTimeout(()=>{
        this.getPercentage()
        this.reloadShow = false
      },800)
    },
    // 返回
    discountBack(){
      this.detailShow = false
    },
    // 打开steam官网
    openSteam(){
      window.ipc.send('addTab',{url:`https://store.steampowered.com/app/${this.id}/_Against_the_Storm`})
    }
  }
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
</style>
