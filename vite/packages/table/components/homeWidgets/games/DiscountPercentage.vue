<template>
  <HomeComponentSlot :customIndex="customIndex" :options="options">
     <div class="w-full h-20 cursor-pointer" @click="enterDetail(imgItem)" v-for="imgItem in discountList" style="margin-bottom:1em;margin-top: 0.1em;position: relative;">
        <img :src="imgItem.large_capsule_image" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
        <!-- <div class="right-top w-14 text-center bg-black bg-opacity-70" style="border-top-left-radius: 8px;border-bottom-right-radius: 8px;">{{imgItem.discountNumber}}</div> -->
     </div>
  </HomeComponentSlot>
</template>

<script>
import Icon from '@ant-design/icons-vue/lib/components/Icon';
import HomeComponentSlot from "../HomeComponentSlot.vue";
import axios from 'axios';
export default {
  name:'DiscountPercentage',
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
      discountList:[],
      // {
        //   id:0,
        //   discountNumber:'-50%',
        //   imageUrl:'https://img.js.design/assets/img/6434ed1e29debb58540cfce2.png'
        // },
        // {
        //   id:1,
        //   discountNumber:'-85%',
        //   imageUrl:'https://img.js.design/assets/img/6434ed1ef7a7b2a9ef343ea4.png'
        // },
        // {
        //   id:2,
        //   discountNumber:'-71%',
        //   imageUrl:'https://img.js.design/assets/img/6434ed1efb1abd05b3e24f9d.png'
        // },
        // {
        //   id:3,
        //   discountNumber:'-51%',
        //   imageUrl:'https://img.js.design/assets/img/642b79fa2850a4fc08feb81d.webp'
        // }
    }
  },
  mounted(){
     this.getPercentage()
  },
  methods:{
    getPercentage(){
      const url = 'https://store.steampowered.com/api/featured'
      // 后期如果需要mac参数可以使用featured_mac
      axios.get(url,{timeout:5000}).then(res=>{
        // featured_win 是获取window平台的数据
        const data = res.data.featured_win
        const indexArr = []
        while(indexArr.length < 4){
          let index = Math.floor(Math.random() * data.length)
          const randomItem = data[index]
          if(!indexArr.includes(randomItem)){
            indexArr.push(randomItem)
          }
        }
        this.discountList = indexArr
      })
    },
    enterDetail(item){
      console.log(item);
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
</style>