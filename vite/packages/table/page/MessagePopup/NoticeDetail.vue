<!-- 消息通知详情 -->
<template>
  <!-- <div>
    {{  }}
  </div> -->
  <div class="flex flex-col">
    <div></div>
    <div v-for="item in noticeId.notice_list" class="p-4 flex flex-col mb-3 rounded-lg detail-item">
      <div class="flex items-center mb-5" v-if="item.from">
        <span class="pr-2 secondary-content"  style="color: var(--primary-text);">收到了来自</span>
        <a-avatar :size="24"   :src="item.from.avatar_url"></a-avatar>
        <span class="px-2 secondary-content"   style="color: var(--primary-text);">{{ item.from.username }}</span>
        <span class="pr-2 secondary-content"  style="color: var(--primary-text);">赠送的礼物</span>
      </div>
     <div v-if="item.title !== ''" class="secondary-content mb-4" style="color: var(--primary-text);">{{ item.title }}</div>
     <div class="secondary-content" style="color:var(--secondary-text);">{{ item.content }}</div>  

    </div>
  </div>
</template>

<script>

export default {
  props:{
      noticeId:{
        type:String
      }
  },
}
</script>

<style lang="scss" scoped>
.detail-item{
  background: var(--secondary-bg);
}

.secondary-content{
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
}
</style>