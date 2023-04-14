<template>
   
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
        title:'Steam折扣推荐',
        icon:'steam',
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
            id:el.id,
            banner_image:el.header_image,
            proportion:el.discount_percent
          })
       })
    },
    goToGameDetails(id){
      console.log(id);
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