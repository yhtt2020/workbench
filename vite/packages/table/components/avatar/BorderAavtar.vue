<!-- 带边框头像组件 -->
<template>
  <div>
    <a-avatar :src="avatarUrl" :size="avatarSize" :style="rarityBorderColor(borderSize,rarity)"></a-avatar>
  </div>
</template>

<script>
import { rarityBorderColor } from '../../js/common/avatar'
export default {
  props:{
    avatarUrl:{
      type:String
    },
    rarity:{
      type:Number
    },
    borderSize:{
      type:Number
    },
    avatarSize:{
      type:Number
    }
  },
  methods:{
    rarityBorderColor,
  }
}
</script>

<style lang="scss" scoped>

</style>