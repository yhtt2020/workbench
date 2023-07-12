<!-- 带头像框组件 -->
<template>
  <div v-if="frameUrl" style="position: relative !important;display: inline-block;zoom: 0.8" :style="{width:avatarSize+'px',height:avatarSize+'px'}">
    <transition name="fade">
      <a-avatar shape="square" :style="{'zoom':zoom}" :size="avatarSize+49" :src="frameUrl" v-if="frameUrl"
                class="w-full h-full object-cover frame-position" style="" alt=""></a-avatar>
    </transition>
    <transition name="fade">
      <a-avatar :src="avatarUrl" :style="{'zoom':zoom}" :size="avatarSize" class="avatar-position"></a-avatar>
    </transition>
  </div>
  <div v-else :style="{width:avatarSize+'px',height:avatarSize+'px'}" style="display: inline-block">
    <a-avatar :src="avatarUrl" :style="{'zoom':zoom}" :size="avatarSize" class=""></a-avatar>
  </div>
</template>

<script>
export default {
  props: {
    zoom: {
      type: Number,
      default: 1
    },
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
}
</script>

<style lang="scss" scoped>
.avatar-position {
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(calc(-50%), calc(-50%)) !important;
  z-index: 2 !important;
}

.frame-position {
  img{
    border-radius: 0;
  }
  z-index: 3 !important;
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  border-radius: 0!important;
  transform: translate(calc(-50%), calc(-50%)) !important;
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
