<!-- 带头像框组件 -->
<template>
  <div style="width: 100px;height: 100px;position: relative;">
    <transition name="fade">
      <a-avatar shape="square" :src="frameUrl" v-if="frameUrl" class="w-full h-full object-cover" style="z-index: 3;position: absolute;left: 0;top:0" alt=""></a-avatar>
    </transition>
    <transition name="fade">
     <a-avatar :src="avatarUrl" :size="avatarSize" class="avatar-position"></a-avatar>
    </transition>
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
.avatar-position{
  position: absolute !important;
  top: 50% !important;
  left:50% !important;
  transform: translate(calc( -49% ) , calc(-49% )) !important;
  z-index: 2 !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
