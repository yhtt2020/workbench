<!-- 游戏攻略图文 -->
<template>
  <xt-scrollbar
    class="flex-1 w-full h-full overflow-hidden"
    :x="false"
    :y="true"
  ></xt-scrollbar>
</template>
 
<script>
import { GetImgTextData } from "../../hooks/getGameGuideDetail";

export default {
  name: "GameGuideImgText",
  props: {
    game: {
      type: String,
    },
  },
  methods: {
    // 获取游戏图文攻略数据
    getGameImgTextData(){
      
    }
  },
};
</script>
 
 <style lang="scss" scoped>
</style>