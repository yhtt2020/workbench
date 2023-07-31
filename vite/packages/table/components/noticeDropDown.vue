<template>
 <a-dropdown trigger="click">
    <div class="w-6 h-6 p-1 flex items-center active-button pointer rounded-md justify-center" style="background: var(--secondary-bg);">
      <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
    </div>
    <template #overlay>
      <a-menu class="custom-dropdown-menu flex-col flex items-center justify-center" style="background: var(--secondary-bg);">
        <a-menu-item style="color: var(--secondary-text);" class="rounded-lg" :class="{select:dropDownIndex === index}" v-for="(item,index) in dropList" @click="selectMenuItem(item,index)">
          {{ item.title }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapActions } from 'pinia'
import { noticeStore } from '../store/notice'
export default {
  props:{
    select:{
      type:Number
    }
  },
  data(){
    return{
      dropList:[{title:'打开应用',name:'open'},{title:'全部清理',name:'clear'}],
      dropDownIndex:0,

    }
  },
  methods:{
    ...mapActions(noticeStore,['delAllNotification']),
    selectMenuItem(item,index){
      this.dropDownIndex = index
      if(item.name === 'clear'){
        this.delAllNotification(this.select)
      }else{
        // this.$router.push({name:'gameIndex'}) 模拟消息打开应用通知机制
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-dropdown-menu{
  border-radius: 10px !important;
  background-color:var(--secondary-bg) !important;
  box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
  width: 120px;
  padding:8px 0;
}

:deep(.select){
  background: var(--active-bg);
  color: var(--active-text) !important;
}
</style>