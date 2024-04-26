<!-- 社群顶部背景图以及社群名称详情-->
<template>
  <div class="flex w-full flex-col relative">
    <!-- 背景图 -->
    <img :src="placeholderData.bgURL" class="w-full h-full object-cover" />
    <!-- :class="sildVisible ? 'rounded-t-xl' : ''" -->

    <!-- 返回按钮 -->
    <div class="absolute" v-if="!hasRole" style="top: 12px; left: 12px">
      <xt-button w="32" h="32" style="border-radius: 8px" @click="prevPage">
        <div class="flex items-center justify-center">
          <xt-ify-icon
            icon="fluent:chevron-left-16-filled"
            size="20"
            class="xt-text-2"
          />
        </div>
      </xt-button>
    </div>

    <!-- 底部名称以及下拉菜单 -->
    <template v-if="hasRole">
      <div class="h-8 community-name px-1.5 pb-1.5  w-full com-line-bg">
        <div
          class="px-3 items-center rounded-lg drop-hover flex justify-between h-8"
        >
          <CategoryDropdown
            :newIcon="'fluent:line-horizontal-3-20-filled'"
            class="w-full"
            :title="communityName"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="h-8 community-name px-3 w-full com-line-bg">
        <span class="xt-text font-14 xt-font">{{ communityName }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { toRefs, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../../store/chatCommunity";
import _ from "lodash-es";

import CategoryDropdown from "../../dropdown/Dropdown.vue";

const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);

/**解构store存储数据**/
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

/**默认图片占位,后期需要替换成动态的图片背景**/
const placeholderData = ref({
  bgURL:
    "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG",
});

/**判断有没有加入群聊通过社群中role**/
const hasRole = computed(() => {
  const currentFind = _.find(myCommunity.value, (item) => {
    return Number(item?.route?.params?.no) === Number(no.value);
  });
  console.log("测试", currentFind, currentFind.role);
  if (currentFind && currentFind.role) {
    return true;
  } else {
    return false;
  }
});

/**如果当前社群用户没有添加的意向,就点击返回按钮返回上一个页面**/
const prevPage = () => {};

/**获取社群名称**/
const communityName = computed(() => {
  const currentFind = _.find(myCommunity.value,(item)=>{
    return Number(item?.route?.params?.no) === Number(no.value);
  })
  return currentFind?.communityInfo?.name;
});
</script>

<style lang="scss" scoped>
.com-line-bg {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
.community-name {
  position: absolute;
  bottom: 0;
}
.drop-hover {
 &:hover {
   background: var(--primary-bg);
 }
}
</style>