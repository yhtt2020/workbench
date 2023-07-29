<template>
  <div v-for="item in detailItem" class="flex flex-col mb-3 p-4 rounded-lg" 
   style="width: 395px; background: var(--secondary-bg);" 
   @contextmenu.prevent="noticeMenu(item, $event)"
  >
    <div class="flex items-center mb-5" v-if="item.from">
      <span class="pr-2 font-400"  style="color: var(--primary-text);">收到了来自</span>
      <a-avatar :size="24"   :src="item.from.avatarUrl"></a-avatar>
      <span class="px-2 font-500"   style="color: var(--active-bg);">{{ item.from.username }}</span>
      <span class="pr-2 font-400"  style="color: var(--primary-text);">赠送的礼物</span>
    </div>
    <div v-if="item.title !== ''" class="font-400 mb-4" style="color: var(--primary-text);">{{item.title}}</div>
    <div class="font-400 mb-3" style="color: var(--secondary-text);">{{ item.content }}</div>
    <!-- <div v-if="item.time !== ''" class="font-400" style="color:var(--secondary-text);">{{ formatDate(item.time) }}</div> -->
  </div>
</template>

<script>
// import { formatDate } from '../../js/common/sessionNotice.ts'
export default {
  props:{
    detailItem:{
      type:Object,
      default:()=>[]
    },
    detailId:{
      type:Number,
      default:0
    }
  },
  data(){
    return{
      // showMenu:false
    }
  },
  methods:{
    // formatDate,
    noticeMenu(item,evt){
    
    }
  }
}
</script>

<style lang="scss" scoped>
.font-400{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.font-500{
  font-family: PingFangSC-Medium;
  font-size: 16px;
  font-weight: 500;
}

</style>