<!-- 社群发现页 -->
<template>
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="find-container h-full">
      <xt-scrollbar :y="true" class="w-full h-full">
        <template v-if="searchShow === false">
          <div class="flex flex-col">
            <span class="font-16 xt-text xt-font mb-4"> 官方推荐 </span>
            <CommunityFindDetail :detailList="officialList" />
          </div>
          <div class="flex flex-col">
            <span class="font-16 xt-text xt-font mb-4"> 热门社群 </span>
            <CommunityFindDetail :detailList="hotList" />
          </div>
        </template>

        <template v-else>
          <div class="flex flex-col">
            <span class="font-16 xt-text xt-font mb-4">搜索结果</span>
            <CommunityFindDetail :detailList="searchList" />
          </div>
        </template>
      </xt-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, toRefs, watch } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";

import CommunityFindDetail from "./components/CommunityFindDeatil.vue";

const props = defineProps({
  communityList: {
    type: Array,
    default: () => [],
  },
  searchKeyWord: {
    type: String,
    required:true,
  },
});
const { communityList,searchKeyWord } = toRefs(props);

const chatCommunity = chatCommunityStore();
const { hotList, officialList } = storeToRefs(chatCommunity);

// 根据父级的搜索列表判断是否为空进行页面切换
const searchShow = ref(false);
const searchList = ref([]);
// 监听社群搜索关键字和结果
watch(()=>[communityList.value,searchKeyWord.value],(val)=>{
  const word = val[1];
  const list = val[0];
  if(list.length !== 0 && word !== ''){
    searchShow.value = true;
    searchList.value = list;
  }
  else {
    searchShow.value = false;
    searchList.value = [];
  }
},{deep:true,immediate:true})


onMounted(() => {
  // 获取官方推荐
  chatCommunity.getOfficialRecommendation();
  // 获取热门推荐
  chatCommunity.getHotCommunityList();
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: 964px) {
  .find-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    width: 100% !important;
  }
}
/**屏幕响应式定宽度**/
@media screen and (min-width: 965px) {
  .find-container {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    width: 1000px;
    max-width: 1000px;
  }
}

</style>