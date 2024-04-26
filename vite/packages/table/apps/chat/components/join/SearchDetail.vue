<!-- 搜索详情 -->
<template>
  <xt-scrollbar :y="true" style="height: 330px">
    <div class="grid grid-cols-2 gap-3">
      <template v-for="item in searchList">
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
            h="40"
            v-if="isJoin(item)"
            style="
              width: 100%;
              pointer-events: none;
              background: var(--secondary-transp-bg) !important;
            "
            @click="closeJoinCom"
          >
            已加入
          </xt-button>
          <xt-button h="40" v-else style="width: 100%" @click="joinNow(item)">
            立即加入
          </xt-button>
        </div>
      </template>
    </div>
  </xt-scrollbar>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import { message } from "ant-design-vue";
import { toRefs, computed } from "vue";
import { CommunityAPI } from "../../api/communityAPI";

const comAPI = new CommunityAPI();
const emit = defineEmits(['close']);

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
const { list } = toRefs(props);

const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

const searchList = computed(() => {
  const listNull = list.value.length !== 0;
  if (listNull) {
    return list.value;
  }
});

// 判断是否已经进入推荐社群
const isJoin = (data) => {
  const result = myCommunity.value.some((item) => {
    return Number(item?.communityInfo?.no) === Number(data?.no);
  });
  return result;
};
// 立即加入
const joinNow = async (item) => {
  const option = { no: item.no };
  const result = await comAPI.applyJoinCommunity(option);
  if (result.status) {
    message.success("加入成功");
    emit("close");
    chatCommunity.getMyCommunity();
  } else {
    message.error(result.info);
  }
};
</script>

<style lang="scss" scoped>
:deep(.ps__rail-y) {
  display: none !important;
}
</style>
