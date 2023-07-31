<template>
  <div v-for="item in detailItem" class="flex flex-col mb-3 p-4 rounded-lg" 
   style="width: 395px; background: var(--secondary-bg);" 
   @contextmenu.prevent="noticeMenu(item, $event)" 
  >
    <div class="flex items-center mb-5" v-if="item.content.from">
      <span class="pr-2 font-400"  style="color: var(--primary-text);">收到了来自</span>
      <a-avatar :size="24"   :src="item.content.from.avatarUrl"></a-avatar>
      <span class="px-2 font-500"   style="color: var(--active-bg);">{{ item.content.from.username }}</span>
      <span class="pr-2 font-400"  style="color: var(--primary-text);">赠送的礼物</span>
    </div>
    <div v-if="item.content.title !== ''" class="font-400 mb-4" style="color: var(--primary-text);">{{item.content.title}}</div>
    <div class="font-400 mb-3" style="color: var(--secondary-text);">{{ item.content.body }}</div>
    <div v-if="item.content.time !== ''" class="font-400" style="color:var(--secondary-text);">{{ formatDate(item.content.time) }}</div>
   
  </div>
  <a-menu style="width: 120px;" :style="{position: 'fixed',top:`${contextMenuPosition.y}px`,left:`${contextMenuPosition.x}px`,zIndex: '999'}" class="dropdown-menu rounded-lg flex flex-col items-center justify-center" v-if="showMenu">
    <a-menu-item style="color:var(--secondary-text);" v-for="(item,index) in rightMenuControls" @click="handleMenuItemClick(item)">{{ item.title }}</a-menu-item>
  </a-menu>
</template>

<script>
import { formatDate } from '../../js/common/sessionNotice'
import { mapActions,mapWritableState } from 'pinia'
import { noticeStore } from '../../store/notice'
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
      showMenu:false, // 是否显示
      contextMenuPosition: { x: 0, y: 0 }, // 右键菜单的位置
      rightMenuControls:[{title:'打开应用',name:'Open'},{title:'删除通知',name:'remove'}],
      delId:''
    }
  },
  methods:{
    formatDate,
    ...mapActions(noticeStore,['delNotification']),
    noticeMenu(item,evt){
      evt.preventDefault();
      this.delId = item.id
      // 获取鼠标点击位置
      const x = evt.clientX;
      const y = evt.clientY;

      // 设置右键菜单的位置和可见状态
      this.contextMenuPosition = { x, y };
      this.showMenu = true
      // 点击其他地方时隐藏右键菜单
      document.addEventListener('click', this.handleOutsideClick);
    },

    handleOutsideClick() {
      // 隐藏右键菜单
      this.showMenu = false;
      // 移除监听器
      document.removeEventListener('click', this.handleOutsideClick);
    },
    handleMenuItemClick(item){
      if(item.name === 'remove'){
        this.delNotification(this.detailId,this.delId)
      }else{
        // this.$router.push({name:'gameIndex'}) 模拟消息打开应用通知机制
      }
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
</style>