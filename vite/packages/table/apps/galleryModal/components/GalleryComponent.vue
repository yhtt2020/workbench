<template>
  <div class="w-full h-full xt-modal flex items-center justify-center rounded-r-xl px-4 pt-4 pb-0">
    <!-- 我的收藏 1 -->
    <template v-if="pageStatus === 'm'">
      <My :isModal="true"  @updateIndependentBg="updateIndependentBg"/>
    </template>

    <!-- 精选壁纸 1 -->
    <template v-else-if="pageStatus === 'w'">
      <SiftPaper :isModal="true" @updateIndependentBg="updateIndependentBg" />
    </template>

    <!-- 必应壁纸 -->
    <template v-else-if="pageStatus === 'b'">
      <Bing :isModal="true" />
    </template>

    <!-- 拾光壁纸 1 -->
    <template v-else-if="pageStatus === 'p'">
      <Picking :isModal="true"   @updateIndependentBg="updateIndependentBg"/>
    </template>

    <!-- 动态壁纸 -->
    <template v-else-if="pageStatus === 'l'">
      <Lively :isModal="true" />
    </template>

    <!-- 设置 -->
    <template v-else-if="pageStatus === 's'">
      <Setting :isModal="true" />
    </template>
  </div>
</template>

<script setup>
import { ref, toRefs ,getCurrentInstance} from "vue";
const {proxy} = getCurrentInstance()
import My from "../../../page/gallery/My.vue";
import Bing from "../../../page/gallery/Bing.vue";
import Lively from "../../../page/gallery/Lively.vue";
import Picking from "../../../page/gallery/Picking.vue";
import Setting from "../../../page/gallery/Setting.vue";
import SiftPaper from "../../../page/gallery/SiftPaper.vue";

const props = defineProps({
  // 当前页面切换选中状态
  pageStatus: {
    type: String,
    required: true,
  },
});

const updateIndependentBg=(img) =>{

     if (img.srcProtocol){
        proxy.$bus.emit('independentBg',`file://${img.src}`)
      } else {
        proxy.$bus.emit('independentBg',img.path)
      }

}

const { pageStatus }  = toRefs(props);

</script>

<style lang="scss" scoped>
</style>
