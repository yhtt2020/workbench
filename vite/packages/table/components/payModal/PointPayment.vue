<template>
  <div class="px-7 mb-10 flex flex-col">
    <div class="h-24 flex justify-between mb-4 items-center rounded-xl p-4" style="color:var(--primary-text);background:var(--secondary-bg);">
      <div class="flex">
        <div style="width:64px;height:64px;" class="flex items-center justify-center">
          <img :src="needPayAvatar.url"  class="w-full h-full object-cover" alt="">
        </div>
        <div class="flex flex-col justify-center ml-4">
          <span class="avatar-font" style="color: var(--primary-text);">{{ needPayAvatar.name }}</span>
          <span class="avatar-font" style="color: var(--primary-text);">道具</span>
        </div>
      </div>
      <div class="avatar-price avatar-font">
        {{ needPayAvatar.score }}
      </div>
    </div>
    <div class="h-16 mb-4 flex items-center justify-between rounded-xl" style="color: var(--primary-text);background: var(--secondary-bg);">
      <div class="px-4 avatar-font" style="color:var(--secondary-text);">可用积分</div>
      <div class="px-4 avatar-font" style="color: var(--primary-text);">2000积分</div>
    </div>
    <a-button type="primary" v-if="isEnough" style="border-radius: 12px; margin-right: 0;height: 48px; width: 400px;color: var(--active-text);" @click="integralEnough">
      立即兑换
    </a-button>
    <a-button v-else  disabled style="border:none;border-radius: 12px; height: 48px; margin-right: 0;width: 400px;background: var(--secondary-bg);color: var(--secondary-text);"
     @click="notEnoughPoint"
    >
      积分不足
    </a-button>
  </div>
</template>

<script>
export default {
  name:'PointPayment',
  props:{
    needPayAvatar:{
      type:Object,
      default:()=>{}
    }
  },
  data(){
    return{
      isEnough:true, // 判断积分是否足够
    }
  },
  methods:{
    // 积分足够的情况下的回调事件
    integralEnough(){},
    // 积分不足的情况下回调事件
    notEnoughPoint(){},


  }

}
</script>

<style lang="scss" scoped>
.avatar-font{

  font-size: 16px;
  font-weight: 500;
}

.avatar-score{
  font-family:Oswald;
  font-size: 24px;
  color: #FF4D4F;
  font-weight: 400;
}

.avatar-size{

  font-size: 14px;
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
