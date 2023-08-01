<template>
  <div v-for="(item,index) in detailItem" class="flex flex-col mb-3 p-4 rounded-lg" 
   style="width: 395px; background: var(--secondary-bg);position: relative;" 
   @mouseenter.stop="showNotificationButton(index)"
   @mouseleave.stop="hideNotificationButton"
   @contextmenu.stop="noticeMenu(item, $event)"  
  >

    <div class="flex items-center justify-between mb-4" v-if="item.from !== null">
      <div class="flex items-center">
        <span class="pr-2 font-400"  style="color: var(--primary-text);">收到了来自</span>
        <a-avatar :size="24"   :src="item.from.avatarUrl"></a-avatar>
        <span class="px-2 font-500"   style="color: var(--active-bg);">{{ item.from.username }}</span>
        <span class="pr-2 font-400"  style="color: var(--primary-text);">赠送的礼物</span> 
       </div>
    </div>

    <transition name="fade">
      <div v-if="isMouseShow  === index" class="delete-button">
        <div class="pointer active-button rounded-full flex p-1 items-center justify-center" 
         style="background: var(--primary-bg);" @click="removeNotification(item.id)"
        >
          <Icon icon="guanbi" style="font-size: 1.25em;"></Icon> 
        </div>
      </div>
    </transition>

    <div v-if="item.title !== ''" class="font-400 mb-4" style="color: var(--primary-text);">{{item.title}}</div>
    
    <div class="font-400 mb-1" style="color: var(--secondary-text);">{{ item.body }}</div>

    <div v-if="item.time !== ''" class="flex items-center justify-between" style="height: 38px;">
      <span class="font-400" style="color:var(--secondary-text);">{{ formatDate(item.time) }}</span>
      <transition name="fade">
        <div v-if="isMouseShow === index" class="flex">
          <div class="py-2 px-4 active-button rounded-lg pointer" style="background: rgba(0,0,0,0.30);color: var(--active-text);">稍后再说</div>
          <div class="py-2 px-4 active-button rounded-lg ml-3 pointer" style="background:var(--active-bg);color: var(--active-text);">立即查看</div>
        </div>
      </transition>
    </div> 

  </div>
  <a-menu style="width: 120px;" :style="{position: 'fixed',top:`${contextMenuPosition.y}px`,left:`${contextMenuPosition.x}px`,zIndex: '999'}" class="dropdown-menu rounded-lg flex flex-col items-center justify-center" v-if="showMenu">
    <a-menu-item style="color:var(--secondary-text);" v-for="(item,index) in rightMenuControls" @click="handleMenuItemClick(item)">{{ item.title }}</a-menu-item>
  </a-menu>
</template>

<script>
import { formatDate } from '../../js/common/sessionNotice'
// import { mapActions,mapWritableState } from 'pinia'
// import { noticeStore } from '../../store/notice'
export default {
  props:{
    detailItem:{
      type:Object,
      default:()=>[]
    },
    detailId:{
      type:Number,
    }
  },
  data(){
    return{
      showMenu:false, // 是否显示
      contextMenuPosition: { x: 0, y: 0 }, // 右键菜单的位置
      rightMenuControls:[{title:'打开应用',name:'Open'},{title:'删除通知',name:'remove'}],
      delId:'',  // 接收单个消息通知删除的id
      isMouseShow:null, // 控制鼠标移入移出
    }
  },
  methods:{
    formatDate,
    // ...mapActions(noticeStore,['delNotification']),
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
      if(item.name === 'remove'){  // 右键下拉菜单删除  
        // this.delNotification(this.detailId,this.delId)
      }else{
        // this.$router.push({name:'gameIndex'}) 模拟消息打开应用通知机制
      }
    },

    showNotificationButton(index){  // 鼠标移入
      this.isMouseShow = index
    },

    hideNotificationButton(){  // 鼠标移出 
      this.isMouseShow = null
    },

    removeNotification(id){  // 鼠标悬浮消息通知删除
      // this.delNotification(this.detailId,id)
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