<template>
  <div class="flex mt-2 flex-col justify-start">
    <div class="epic-detail-image rounded-lg">
      <img :src="detailOptions.image" alt="" class="rounded-lg">
    </div>
    <span class="mt-2" style="font-size: 16px;font-weight: 500;">{{ detailOptions.name }}</span>
    <span class="content-introduction h-12" style="font-size: 16px; font-weight: 400;">{{detailOptions.illustrate}}</span>
    <span class="line-through mt-1" style="color: rgba(151, 151, 151, 1);">{{detailOptions.price}}</span>
    <div class="flex justify-between items-center">
      <span style="color: rgba(255, 77, 79, 1);">免费领取</span>
      <span style="background: rgba(255, 77, 79, 1); padding: 1px 7px 3px 6px;border-radius: 4px;">剩余{{ detailType.name === 'week' ? remainderDay(detailOptions.weekDate) : remainderDay(detailOptions.nextWeekDate)  }}天</span>
    </div>
    <div class="flex justify-between mt-2">
        <span @click="epicBack" class="w-12 h-12 s-item cursor-pointer epic-back flex items-center rounded-lg justify-center">
           <Icon icon="xiangzuo" class="text-xl"></Icon>
        </span>
        <span @click="onClickOffice(detailOptions.productSlug)" class="w-2/3 epic-back text-center mr-3 pointer rounded-lg s-item" style="padding:13px 30px;color: rgba(255, 255, 255, 0.85);">领取</span>
    </div>
 </div>
</template>

<script>
import { remainderDay } from "../../../js/axios/api"
export default {
  name:'EpicDetail',
  props:{
    detailOptions:{
      type:Object,
      default:()=>{}
    },
    detailType:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      backShow:false
    }
  },
  methods:{
    remainderDay,
    epicBack(){
      this.$emit('update:backShow',this.backShow)
    },
    onClickOffice(value){
      if(value !== null){
        window.ipc.send('addTab',{url:`https://store.epicgames.com/zh-CN/p/${value}`})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.epic-detail-image{
  width: 252px;
  height: 115px;
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.content-introduction{
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre-wrap;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}
.epic-back:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
.open-epic:active{
  filter: brightness(0.8);
  background:rgba(42, 42, 42, 0.25);
}
</style>