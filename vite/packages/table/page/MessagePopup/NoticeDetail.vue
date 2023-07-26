<!-- 消息通知详情 -->
<template>
  <div class="flex flex-col ">
    <div class="flex items-center justify-between mb-3" v-if="noticeId.noticeIcon !== ''">
      <div class="flex items-center">
        <div class="flex items-center justify-center"  style="width: 32px;height: 32px;">
          <img :src="noticeId.noticeIcon" class="w-full h-full"  alt="">
        </div>
        <span class="pl-2 secondary-content" style="color: var(--primary-text);">系统</span>
      </div>
      <a-dropdown :placement="placement">
        <div class="pointer active-button p-1 rounded-md flex items-center justify-center" style="background: var(--secondary-bg);">
          <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              1st menu item
            </a-menu-item>
            <a-menu-item>
              2nd menu item
            </a-menu-item>
            <a-menu-item>
              3rd menu item
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <!-- 
        <div class="pointer active-button p-1 rounded-md flex items-center justify-center" style="background: var(--secondary-bg);">
          <Icon icon="gengduo1" style="font-size: 1.5em;"></Icon>
        </div>
       -->
    </div>
    <div v-for="item in noticeId.noticeList" class="p-4 flex flex-col mb-3 rounded-lg detail-item">
      <div class="flex items-center mb-5" v-if="item.from">
        <span class="pr-2 secondary-content"  style="color: var(--primary-text);">收到了来自</span>
        <a-avatar :size="24"   :src="item.from.avatarUrl"></a-avatar>
        <span class="px-2 secondary-content"   style="color: var(--primary-text);">{{ item.from.username }}</span>
        <span class="pr-2 secondary-content"  style="color: var(--primary-text);">赠送的礼物</span>
      </div>
     <div v-if="item.title !== ''" class="secondary-content mb-4" style="color: var(--primary-text);">{{ item.title }}</div>
     <div class="secondary-content mb-4" style="color:var(--secondary-text);">{{ item.content }}</div>  
     <div v-if="item.time !== ''" class="secondary-content" style="color:var(--secondary-text);">{{ formatDate(item.time) }}</div>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../../js/common/sessionNotice.ts'
export default {
  props:{
      noticeId:{
        type:String
      }
  },
  methods:{
    formatDate,
    handleCommand({ key }) {
      // 在这里处理菜单项的选择事件
      console.log('选择了', key);
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-item{
  background: var(--secondary-bg);
  width: 395px;
}

.secondary-content{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}

.active-button{
  &:active{
    filter: brightness(0.8);
    opacity: 0.8;
  }
  &:hover{
    opacity: 0.8;
  }
}
</style>