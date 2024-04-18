<!-- 加入群聊入口的推荐详情页 -->
<template>
  <xt-scrollbar :y="true" style="height: 330px" class="w-full">
    <div class="grid grid-cols-2 gap-3">
      <template v-for="item in recommendList">
        <div class="flex flex-col rounded-lg p-4 xt-bg-2">
          <div class="flex items-center mb-3">
            <a-avatar :size="40" :src="item.icon" shape="square"></a-avatar>
            <span
              class="font-16-500 pl-3 truncate"
              style="color: var(--primary-text)"
            >
              {{ item.name }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="font-12-400" style="color: var(--secondary-text)">
              {{ item.memberNum }}人
            </span>
            <span class="font-12-400" style="color: var(--secondary-text)">
              {{ item.joinOption === "freeAccess" ? "公开加入" : "审核加入" }}
            </span>
          </div>
          <a-divider
            style="
              height: 2px;
              background-color: var(--divider);
              margin: 16px 0;
            "
          />
          <xt-button
            v-if="currentJoin(item)"
            h="40"
            style="
              width: 100% !important;
              background: var(--secondary-transp-bg) !important;
              pointer-events: none;
            "
            @click="closeJoinCom"
          >
            已加入
          </xt-button>
          <xt-button
            v-else
            h="40"
            type="theme"
            style="width: 100% !important"
            @click="currentNow(item)"
          >
            立即加入
          </xt-button>
        </div>
      </template>
    </div>
  </xt-scrollbar>
</template>

<script setup>
import { storeToRefs } from "pinia";
import _ from "lodash-es";
import { chatCommunityStore } from "../../store/chatCommunity";
import { message } from "ant-design-vue";
import { toRefs, computed } from "vue";
import { CommunityAPI } from "../../api/communityAPI";

const emit = defineEmits(["close"]);

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const { list } = toRefs(props);

const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);
const comAPI = new CommunityAPI();

const recommendList = computed(() => {
  const listNull =
    list.value !== undefined && list.value !== null && list.value.length !== 0;
  if (listNull) {
    return list.value;
  }
});

// 判断是否已经进入推荐社群
const currentJoin = (data) => {
  console.log('data',data);
  const findData = _.find(myCommunity.value, function (item) {
    return Number(item?.communityInfo?.no) === Number(data?.no);
  });
  const findDataNull = findData !== undefined;
  if (findDataNull) {
    return findData.status === 1;
  }
};
// 立即加入
const currentNow = async (item) => {
  const option = { no: item.no };
  const result = await comAPI.joinRecommendCommunity(option);
  message.success(`${result.info}`);
  this.getMyCommunity();
  emit("close");
};
</script>

<style lang="scss" scoped>
:deep(.ps__rail-y) {
  display: none !important;
}
</style>