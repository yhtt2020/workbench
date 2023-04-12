<template>
  <HomeComponentSlot :options="options" :customIndex="customIndex">
     <div style="margin-top: 1em;">
       <div class="flex cursor-pointer" v-for="item in gameList">
         <div class="w-1/3 h-20 rounded-lg" style="margin-bottom: 12px;">
            <img :src="item.small_capsule_image" alt="" class="rounded-lg" style="width: 100%; height:100%;object-fit: cover;">
         </div>
         <div class="w-1/3  h-20 flex flex-col" style="margin-left:10px;">
            <div class="truncate max-w-xl">{{item.name}}</div>
            <div class="flex">
               <span class="game-active text-white text-opacity-60 rounded-md bg-white bg-opacity-10" v-for="activeItem in item.active">{{ activeItem }}</span>
            </div>
            <div class="price line-through text-white text-opacity-10">￥{{item.original_price}}</div>
            <div class="flex">
              <div class="text-red-600">￥{{item.final_price}}</div>
              <span style="margin-left: 1em;" class="text-xs text-white text-opacity-10 text-center">{{item.address}}</span>
            </div>
         </div>
         <div class="w-1/3  h-20   flex justify-end items-end">
            <div class="w-12 text-center bg-red-600 rounded-md text-white text-opacity-80">{{item.proportion}}</div>
         </div>
       </div>
     </div> 
  </HomeComponentSlot>
</template>

<script>
import Icon from '@ant-design/icons-vue/lib/components/Icon';
import HomeComponentSlot from "../HomeComponentSlot.vue";
import axios from 'axios';
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
      // {
      //     id:0,
      //     images:'https://img.js.design/assets/img/6434ed1e29debb58540cfce2.png',
      //     title:'小缇娜的奇幻之地',
      //     active:['动作','冒险'],
      //     price:'199',
      //     current:'99',
      //     address:'(中国区)',
      //     proportion:'-50%'
      //   },
      //   {
      //     id:1,
      //     images:'https://img.js.design/assets/img/6434ed1ef7a7b2a9ef343ea4.png',
      //     title:'无地之主',
      //     active:['动作','冒险'],
      //     price:'199',
      //     current:'29.85',
      //     address:'(中国区)',
      //     proportion:'-85%'
      //   },
      //   {
      //     id:2,
      //     images:'https://img.js.design/assets/img/6434ed1efb1abd05b3e24f9d.png',
      //     title:'FIFA 23',
      //     active:['运动'],
      //     price:'248',
      //     current:'75',
      //     address:'(中国区)',
      //     proportion:'-75%'
      //   },
      //   {
      //     id:3,
      //     images:'https://img.js.design/assets/img/642b79fa2850a4fc08feb81d.webp',
      //     title:'双人成行',
      //     active:['合作','冒险'],
      //     price:'198',
      //     current:'99',
      //     address:'(中国区)',
      //     proportion:'-51%'
      //   },
    }
  },
  mounted(){
    this.getDiscountData()
  },
  methods:{
    getDiscountData(){
      const url = 'https://store.steampowered.com/api/featuredcategories/'
      axios.get(url,{timeout:5000}).then(res=>{
        console.log(res.data.specials.items);
        const data =  res.data.specials.items
        const indexArr = []
        while(indexArr.length < 4){
           let index = Math.floor(Math.random() * data.length)
           const randomItem = data[index]
           if(!indexArr.includes(randomItem)){
             indexArr.push(randomItem)
           }
        }
        this.gameList = indexArr
      }).catch(err=>{
        
      })
    }
  }
}
</script>

<style  lang="scss" scoped>
.game-active{
  padding:1px 6px;
  margin-right: 0.5em;
  font-size: 12px;
}
.price{
  font-size: 10.84px;
}
</style>