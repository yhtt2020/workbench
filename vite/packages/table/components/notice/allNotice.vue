<template>
  <vue-custom-scrollbar  @touchstart.stop @touchmove.stop @touchend.stop :settings="settingsScroller" style="height:100%;">
    <div v-for="(item,index) in list" class="flex flex-col mb-3 p-4 rounded-lg"
    style=" background: var(--secondary-bg);position: relative;"
    >
      <div class="flex flex-col" @contextmenu="handleRightKey(item,$event)">
        <div class="flex justify-between mb-4">
          <div class="flex items-center">
            <a-avatar :size="24"  :src="item.doc.content.icon"></a-avatar>
            <span class="pl-3">{{item.doc.content.title}}</span>
          </div>
          <div class="flex items-center pointer active-button" @click="delNotice(item)">
            <Icon icon="close-circle-fill" style="font-size: 1.5em;color: var(--secondary-text);"></Icon>
          </div>

        </div>

        <div class="font-400 mb-1" style="color: var(--secondary-text);">{{ item.doc.content.body }}</div>

        <!-- <span class="font-400" style="color:var(--secondary-text);">{{ formatTime(parseInt(item.doc.content.time)*1000) }}</span> -->
        <div class="flex items-center justify-between">
          <span class="font-400" style="color:var(--secondary-text);">{{ formatTime(parseInt(item.doc.content.time) * 1000) }}</span>
          <div class="font-14 px-3.5 py-1.5 pointer rounded-lg active-button" style="color:var(--active-bg);background: var(--active-secondary-bg);" @click="noticeDetail">
            查看
          </div>
        </div>
      </div>

    </div>
  </vue-custom-scrollbar>

  <a-menu v-if="toggle"  style="width: 120px;" :style="{position: 'fixed',top:`${contextMenuPosition.y}px`,left:`${contextMenuPosition.x}px`,zIndex: '999'}" class="dropdown-menu rounded-lg flex flex-col items-center justify-center" >
    <a-menu-item style="color:var(--secondary-text);" class="active-button" v-for="(item,index) in rightMenuControls" @click="handleMenuItemClick(item,index)">{{ item.title }}</a-menu-item>
  </a-menu>


</template>

<script>
import { defineComponent,reactive,ref,toRefs } from 'vue'
import { formatTime } from '../../util'
import { noticeStore } from '../../store/notice'
import {useRouter} from 'vue-router'

export default defineComponent({
 props:['list'],


 setup(props,ctx){
   const store = noticeStore()
   const router = useRouter()

   const data = reactive({
    settingsScroller: {
      useBothWheelAxes: true,
      swipeEasing: true,
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: true
    },
    toggle:false, // 控制右键下拉菜单
    contextMenuPosition: { x: 0, y: 0 }, // 右键菜单的位置
    rightMenuControls:[{title:'打开应用',name:'Open'},{title:'删除通知',name:'remove'}],
    removeDoc:'',// 需要删除的数据
   })

   const dialog = ref()
   const content = ref()


   // 鼠标右键点击
   const handleRightKey = (item,e) =>{
    e.preventDefault();
    data.toggle = true
    data.removeDoc = item

    // 获取鼠标点击位置
    const x = e.clientX;
    const y = e.clientY;

    // 设置右键菜单的位置和可见状态
    data.contextMenuPosition = { x, y };

    // 点击其他地方时隐藏右键菜单
    document.addEventListener('click', removeContextmenu);
   }

   const removeContextmenu = () =>{  // 移除隐藏鼠标右键下拉菜单
    data.toggle = false
    document.removeEventListener('click', removeContextmenu);
   }


  const handleMenuItemClick = (item,index) =>{
    if(item.name === 'remove'){
      store.removeIMChatData(data.removeDoc)
      store.loadNoticeDB()
    }else{

    }
  }


   // 根据指定消息通知进行删除
   const delNotice = (item) =>{
    store.removeIMChatData(item)
    store.loadNoticeDB()
   }


   const noticeDetail = () =>{
      router.push({name:'chatMain'})
      ctx.emit('closeMessage')
   }

   return{
    content,dialog,
    ...toRefs(data),formatTime,delNotice,
    handleRightKey,removeContextmenu,handleMenuItemClick,
    noticeDetail,
   }
 }

})


// import { mapActions } from 'pinia'
// import { noticeStore } from '../../store/notice'
// import { formatDate } from '../../js/common/sessionNotice'

// export default {
//   props:{
//     detailItem:{  // 列表数据
//       type:Object,
//       default:()=>[]
//     },
//     detailId:{  // 左侧选中状态
//       type:Number,
//     }
//   },

//   data(){
//     return{
//       showMenu:false, // 是否显示
      // contextMenuPosition: { x: 0, y: 0 }, // 右键菜单的位置
      // rightMenuControls:[{title:'打开应用',name:'Open'},{title:'删除通知',name:'remove'}],
//       delId:'',  // 接收单个消息通知删除下标
//     }
//   },

//   methods:{
//     ...mapActions(noticeStore,['deleteNotice']),
//     formatDate,
//     removeNotification(index){ // 删除指定消息通知
//       this.deleteNotice(this.detailId,index)
//     },

//     noticeMenu(index,evt){  // 鼠标右键显示下拉菜单
//       evt.preventDefault();
//       this.delId = index


//     },

    // handleOutsideClick() {
    //   // 隐藏右键菜单
    //   this.showMenu = false;
    //   // 移除监听器
    //   document.removeEventListener('click', this.handleOutsideClick);
    // },

//     handleMenuItemClick(item){
//       if(item.name === 'remove'){  // 右键下拉菜单删除
//         this.deleteNotice(this.detailId,this.delId)
//       }else{
//         // this.$router.push({name:'gameIndex'}) 模拟消息打开应用通知机制
//       }
//     },

//     goNotice(){  // 查看消息通知跳转机制
//       // this.$router.push({name:'gameIndex'}) 模拟消息打开应用通知机制
//     },

//     isStringEmpty(item){  // 判断用户来源
//       // if(item.from !== null && item.from.avatarUrl !== ''){
//       //   return true
//       // }else{
//       //   return false
//       // }
//     }
//   }

// }
</script>

<style lang="scss" scoped>
.font-400{

 font-size: 16px;
 font-weight: 400;
}

.font-500{

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


.dialog{
  width: 120px;
  position: absolute;
  z-index: 5;
  padding: 2px 20px;
}
.font-14{

  font-size: 14px;
  font-weight: 400;
}
</style>
