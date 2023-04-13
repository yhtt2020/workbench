<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
     <div style="margin-top: 1em;">
       <div class="flex w-full" style="margin-top: 0.3em;" v-for="item in gameList">
          <div class="w-1/3 h-20" style="margin-right:10px;">
            <img :src="item.image" alt="" class="rounded-lg" style="width: 100%; height:100%;object-fit: cover;">
          </div>
          <div class="flex w-2/3 flex-col">
            <div class="w-full truncate name" style="line-height: 20px;margin-bottom: 0.25em;" >{{item.name}}</div>
            <div class="active-type">
              <span v-for="activeItem in item.genres" class="bg-white rounded-md bg-opacity-10 active-item  ">{{activeItem.description}}</span>
            </div>
            <span class="initial-price line-through">{{item.initial_price}}</span>
            <div class="flex justify-between">
              <div class="flex w-2/3">
                <span class="text-red-600">¥{{item.final_price.replace('¥','')}}</span>
                <span v-if="item.address === 'CNY'" class="address">(中国区)</span>
              </div>
              <span class="bg-red-600 w-12 text-center rounded-md">{{parseInt((item.initial_price.replace('¥','') - item.final_price.replace('¥','')) / item.final_price.replace('¥','') * 100)}} %</span>
            </div>
          </div>
       </div>
     </div> 
  </HomeComponentSlot>
</template>

<script>
import Icon from '@ant-design/icons-vue/lib/components/Icon';
import HomeComponentSlot from "../HomeComponentSlot.vue";
import axios from 'axios';
import {getRequestWithRetry} from '../../../js/axios/api'

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
      gameList:[], 
      resArr:[]   //随机获取四个数据
    }
  },
  mounted(){
    this.getDiscountData()
  },
  methods:{
    getDiscountData(){
      const url = 'https://store.steampowered.com/api/featured'
      axios.get(url).then(res=>{
        const data = res.data.featured_win
        let indexArr = []
        while(indexArr.length < 4){
          let index = Math.floor(Math.random() * data.length)
          if(indexArr.indexOf(index) === -1){
            indexArr.push(index)
            this.resArr.push(data[index])
          }
        }
        this.resArr.forEach(el=>{
          this.getAppList(el)
        })
      }).catch(err=>{
        console.log(err);
        if(err){
          // 解决接口请求超时问题
          getRequestWithRetry('featured',4,1000).then(res=>{
            const data = res.data.featured_win
            let indexArr = []
            while(indexArr.length < 4){
             let index = Math.floor(Math.random() * data.length)
             if(indexArr.indexOf(index) === -1){
              indexArr.push(index)
              this.resArr.push(data[index])
             }
            }
            this.resArr.forEach(el=>{
              this.getAppList(el)
            })
          })
        }
      })
    },
    getAppList(el){
      const appUrl = `https://store.steampowered.com/api/appdetails/?appids=${el.id}`
      axios.get(appUrl).then(res=>{
        console.log(res.data[el.id].data);
         if(res.data[el.id].data.price_overview.currency === 'CNY'){
          const appArr = {
           id:el.id,
           image:el.header_image,
           name:el.name,
           genres:res.data[el.id].data.genres.slice(0,3),
           initial_price:res.data[el.id].data.price_overview.initial_formatted !== "" ? res.data[el.id].data.price_overview.initial_formatted : res.data[el.id].data.price_overview.final_formatted,
           final_price:res.data[el.id].data.price_overview.final_formatted,
           address:res.data[el.id].data.price_overview.currency
          }
          this.gameList.push(appArr)
          console.log(this.gameList);
         }
      }).catch(err=>{
        console.log(err);
        if (err) {
          getRequestWithRetry(`appdetails/?appids=${el.id}`,4,1000).then(res=>{
            console.log(res);
            const appArr = {
             id:el.id,
             image:el.header_image,
             name:el.name,
             genres:res.data[el.id].data.genres,
             initial_price:res.data[el.id].data.price_overview.initial_formatted.replace('￥',''),
             final_price:res.data[el.id].data.price_overview.final_formatted.replace('￥',''),
             address:res.data[el.id].data.price_overview.currency
            }
            this.gameList.push(appArr)
          })
        }
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