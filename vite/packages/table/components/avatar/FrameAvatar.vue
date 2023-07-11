<!-- 带头像框组件 -->
<template>
  <div style="width: 100px;height: 100px;position: relative;">
    <img :src="frameUrl" v-if="frameUrl !== ''" class="w-full h-full object-cover" alt="">
    <a-avatar :src="avatarUrl" :size="avatarSize" class="frame-position"></a-avatar>
  </div>
</template>

<script>
export default {
  props: {
    frameUrl: {
      type: String
    },
    avatarSize: {
      type: Number
    },
    avatarUrl: {
      type: String
    },
  },
};
</script>

<style lang="scss" scoped>
.frame-position{
  position: absolute !important;
  top: 50% !important;
  left:50% !important;
  transform: translate(-50% , -50%) !important;
  z-index: -1 !important;
}
</style>