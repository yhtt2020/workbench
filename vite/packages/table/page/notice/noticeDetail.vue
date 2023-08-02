<template>
  <div v-for="(item,index) in detailItem" class="flex flex-col mb-3 p-4 rounded-lg" 
  style="width: 395px; background: var(--secondary-bg);position: relative;" >
    <div class="flex items-center justify-between mb-4" >
      <!-- <div class="flex items-center">
        <span class="pr-2 font-400" v-if="item.from !== null" style="color: var(--primary-text);">收到了来自</span>
        <a-avatar :size="24" v-if="item.from !== null"  :src="item.from.avatarUrl"></a-avatar>
        <span class="px-2 font-500"  v-if="item.from !== null" style="color: var(--active-bg);">{{ item.from.username }}</span>
        <span class="pr-2 font-400" v-if="item.from !== null" style="color: var(--primary-text);">赠送的礼物</span> 
      </div> -->
    </div>
    <div class="delete-button">
      <div class="pointer active-button rounded-full flex p-1 items-center justify-center" 
       style="background: var(--primary-bg);" @click="removeNotification(index)"
      >
        <Icon icon="guanbi" style="font-size: 1.25em;"></Icon> 
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { noticeStore } from '../../store/notice'
import { formatDate } from '../../js/common/sessionNotice'

export default {
  props:{
    detailItem:{  // 列表数据
      type:Object,
      default:()=>[]
    },
    detailId:{  // 左侧选中状态
      type:Number,
    }
  },
  methods:{
    ...mapActions(noticeStore,['deleteNotice']),
    formatDate,
    removeNotification(index){
      this.deleteNotice(this.detailId,index)
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


.dropdown-menu {
  background-color: var(--secondary-bg);
  border: 1px solid var(--divider);
  padding: 5px;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
}

.active-button{
  &:active{
    filter:brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}

.delete-button{
  position:absolute;
  top:15px;
  right: 15px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>