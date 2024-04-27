<!-- 左侧栏中间段 -->
<template>
  <!-- 单列 -->
  <template v-if="!columnVisible">
    <!-- 当前字段暂时不存在,先屏蔽,后续进行开发,进行调整 -->
    <div class="flex items-center flex-col" hidden="">
      <div
        class="font-14 summary font-400 mb-3 xt-font xt-text-2"
        :class="isCollapsed ? 'summary-3' : 'summary-1'"
      >
        {{ currentInfo?.communityInfo?.summary }}
        任何关于社群运营方面的👏通知、👏活动都会在这个群内优先通知。群员社群主也可以优先参与各种活动。
      </div>
      <xt-button
        w="32"
        h="32"
        style="background: none !important"
        @click="openHideContent"
      >
        <div class="flex items-center justify-center" v-if="isCollapsed">
          <xt-ify-icon icon="fluent:caret-down-16-filled" size="20" />
        </div>
        <div class="flex items-center justify-center" v-else>
          <xt-ify-icon icon="fluent:caret-up-16-filled" size="16" />
        </div>
      </xt-button>
      <div class="flex items-center mt-2">
        <span
          class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3"
          :class="sildVisible ? '' : 'xt-bg'"
        >
          社群号：{{ currentInfo?.communityInfo?.no }}
        </span>
        <span class="px-2 rounded-md xt-active-bg xt-active-text">
          {{ currentInfo?.communityInfo?.level }} 级
        </span>
      </div>
      <a-progress
        :show-info="false"
        strokeColor="var(--active-bg)"
        v-if="isCollapsed"
        :percent="currentInfo?.communityInfo?.level"
      />
    </div>

    <div class="flex items-center mt-2">
      <span
        class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3"
        :class="sildVisible ? '' : 'xt-bg'"
      >
        社群号：{{ currentInfo?.communityInfo?.no }}
      </span>
      <span class="px-2 rounded-md xt-active-bg xt-active-text">
        {{ currentInfo?.communityInfo?.level }} 级
      </span>
    </div>

    <!-- v-if="isCollapsed" 后期进行调试 -->
    <a-progress
      :show-info="false"
      strokeColor="var(--active-bg)"
      :percent="currentInfo?.communityInfo?.level"
    />

    <!-- 添加按钮 -->
    <div class="w-full" v-if="!hasRole">
      <xt-button
        style="border-radius: 8px; width: 100% !important"
        h="32"
        type="theme"
        @click="joinNow"
      >
        <div class="flex items-center justify-center">立即加入</div>
      </xt-button>
    </div>
  </template>

  <!-- 双列 -->
  <template v-else>
    <!-- 后续补充summary字段,此处暂时先屏蔽-->
    <!-- <div class="font-14 summary mb-3 xt-font xt-text-2 summary-2">
      {{ currentInfo?.summary }}
    </div> -->

    <div class="w-full flex items-center justify-start">
      <div
        class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mb-2"
        :class="sildVisible ? '' : 'xt-bg'"
      >
        社群号：{{ currentInfo?.communityInfo?.no }}
      </div>
    </div>

    <!-- 进度条 -->
    <div>
      <a-row :gutter="10">
        <a-col flex="55px" class="mt-1 text-right">
          <span class="px-2 rounded-full xt-active-bg xt-active-text">
            {{ currentInfo?.communityInfo?.level }} 级
          </span>
        </a-col>
        <a-col flex="auto" style="padding-top: 3px">
          <a-progress
            :show-info="false"
            strokeColor="var(--active-bg)"
            :percent="currentInfo?.communityInfo?.level"
          />
        </a-col>
      </a-row>
    </div>

    <!-- 添加按钮 -->
    <div class="w-full" v-if="!hasRole">
      <xt-button
        style="border-radius: 8px; width: 100% !important"
        h="32"
        type="theme"
        @click="joinNow"
      >
        <div class="flex items-center justify-center">立即加入</div>
      </xt-button>
    </div>
  </template>
</template>

<script setup>
import { computed, toRefs } from "vue";
import { chatCommunityStore } from "../../../store/chatCommunity";
import { storeToRefs } from "pinia";
import _ from "lodash-es";
import { useNavigationStore } from "../../../../../components/desk/navigationBar/navigationStore";
import { CommunityAPI } from "../../../api/communityAPI";
import { message } from "ant-design-vue";

const comAPI = new CommunityAPI();

const props = defineProps({
  columnVisible: {
    type: Boolean,
    default: false,
  },
  no: {
    type: String,
    required: true,
  },
  sildVisible: {
    type: Boolean,
    default: false,
  },
});
const { columnVisible, no, sildVisible } = toRefs(props);

/**解构store数据缓存**/
const chatCommunity = chatCommunityStore();
const { myCommunity, setting } = storeToRefs(chatCommunity);
const useNavigation = useNavigationStore();
const { communityNavVisible } = storeToRefs(useNavigation);

/**加入社群条件**/
const hasRole = computed(() => {
  const currentFind = _.find(myCommunity.value, (item) => {
    return Number(item?.route?.params?.no) === Number(no.value);
  });
  if (currentFind && currentFind.role) {
    return true;
  } else {
    return false;
  }
});

/**当前社群信息**/
const currentInfo = computed(() => {
  const currentFind = _.find(myCommunity.value, (item) => {
    return Number(item?.route?.params?.no) === Number(no.value);
  });
  return currentFind;
});

/**是否折叠**/
// const isCollapsed = computed(() => {
//   // const visible = setting.value.collapsedVisible.enable;
//   // const isNo =
//   //   Number(setting.value.collapsedVisible.no) === Number(currentInfo.value?.communityInfo?.no);
//   // if (visible && isNo) {
//   //   return false;
//   // } else {
//   //   return true;
//   // }
// });

/**触发折叠**/
// const openHideContent = () => {
//  // const enable = (setting.value.collapsedVisible.enable =
//  // !setting.value.collapsedVisible.enable);
//  //  chatCommunity.setCollapsed({ enable: enable, no: currentInfo.value?.no });
// };

/**立即加入**/
const joinNow = () => {
  /**开启社群导航**/
  if (communityNavVisible.value) {
    joinCurrentCommunity();
  } else {
    window.$ui.confirm("是否需要开启社群导航", "", {
      ok: async () => {
        communityNavVisible.value = true;
        joinCurrentCommunity();
      },
      type: "warning",
    });
  }
};
/**触发加入社群方法**/ 
const joinCurrentCommunity = async() => {
 const option = {no:no.value};
 const res  = await comAPI.applyJoinCommunity(option);
 if(res.status === 1){
  message.success(`${res.info}`);
  chatCommunity.getMyCommunity();
  chatCommunity.getCommunityTree(no.value);
 }
};
</script>

<style lang="scss" scoped>
.summary-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: break-spaces;
  overflow: hidden;
  color: var(--primary-text);
  max-width: 312px;
}
.summary-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  color: var(--primary-text);
  max-width: 185px;
}
.summary-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  white-space: break-spaces;
  overflow: hidden;
  margin: 0 !important;
  color: var(--primary-text);
  max-width: 185px;
}
</style>