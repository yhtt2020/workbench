<template>
  <HomeComponentSlot :customIndex="customIndex" :options="options">
     <div class="w-full h-20 cursor-pointer"  v-for="imgItem in discountList" style="margin-bottom:0.5em;margin-top: 0.65em;position: relative;">
        <img :src="imgItem.banner_image" alt="" class="rounded-lg" style="width:100%;height:100%;object-fit: cover;">
        <div class="right-top w-14 text-center bg-black bg-opacity-70" style="border-top-left-radius: 8px;border-bottom-right-radius: 8px;">-{{imgItem.proportion}}%</div>
     </div>
  </HomeComponentSlot>
</template>

<script>
import Icon from '@ant-design/icons-vue/lib/components/Icon';
import HomeComponentSlot from "../HomeComponentSlot.vue";
import { mapWritableState,mapActions ,mapState} from 'pinia'
import {cardStore} from '../../../store/card'
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
    }
  },
  computed:{
    ...mapWritableState(cardStore,['gameData'])
  },
  mounted(){
    this.getPercentage()
  },
  methods:{
    getPercentage(){
       this.gameData.filter(el=>{
          this.discountList.push({
            banner_image:el.header_image,
            proportion:el.discount_percent
          })
       })
    },
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