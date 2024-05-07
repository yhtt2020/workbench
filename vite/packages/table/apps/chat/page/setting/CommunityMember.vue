<!-- 社群成员管理页面 -->
<template>
  <div class="w-full flex flex-col">
    <div style="width: 572px" class="flex mb-3 items-center justify-between">
      <xt-option-tab
        :list="memberTab"
        v-model="currentTab"
        style="height: 40px; width: 304px; margin-bottom: 0; margin-right: 16px"
      />

      <!-- 暂时先隐藏,后续等待接口处理 -->
      <template v-if="currentTab === 'apply'">
        <div class="flex" hidden="">
          <xt-button
            w="96"
            h="40"
            :radius="8"
            class="mr-3"
            @click="handlerReject"
          >
            全部拒绝
          </xt-button>
          <xt-button
            w="96"
            h="40"
            :radius="8"
            style="background: var(--active-secondary-bg)"
            @click="handlerAllAccept"
          >
            <span class="xt-theme-text">全部同意</span>
          </xt-button>
        </div>
      </template>

      <!-- 暂时先隐藏,后续等待接口处理 -->
      <template v-else>
        <div class="flex" hidden="">
          <a-input
            v-model:value="memberKeyword"
            @change="memberSearch"
            style="
              width: 209px;
              margin-right: 12px;
              background: var(--secondary-transp-bg);
              border-radius: 8px;
            "
          >
            <template #suffix>
              <xt-ify-icon
                v-if="memberKeyword === ''"
                icon="fluent:search-16-filled"
                size="20"
              />
              <xt-ify-icon
                v-else
                icon="fluent:dismiss-circle-16-filled"
                size="20"
                @click="memberKeyword = ''"
              />
            </template>
          </a-input>
          <xt-button w="40" h="40">
            <div class="flex items-center justify-center">
              <xt-ify-icon icon="fluent:add-16-filled" size="20" />
            </div>
          </xt-button>
        </div>
      </template>
    </div>

    <div class="flex flex-1 flex-col" style="width: 572px">
      <!-- 成员申请列表 -->
      <template v-if="currentTab === 'apply'">
        <xt-scrollbar :y="true" style="height: calc(100vh - 250px)">
           <CommunityMemeberApply />
        </xt-scrollbar>
      </template>

      <!-- 成员管理详情列表 -->
      <template v-else>
        <xt-scrollbar :y="true" style="height: calc(100vh - 250px)">
          <CommunityMemberManage />
        </xt-scrollbar>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import CommunityMemberManage from "./components/CommunityMemberManage.vue";
import CommunityMemeberApply from "./components/CommunityMemeberApply.vue";

const memberTab = ref([
  {
    name: "成员管理(23)",
    value: "manage",
  },
  {
    name: "申请审核(12)",
    value: "apply",
  },
]);

const currentTab = ref("manage");

/**成员管理搜索关键字**/
const memberKeyword = ref("");
/**成员管理搜索事件**/
const memberSearch = () => {
  // todo
};
/**成员管理全部拒绝处理事件**/
const handlerAllReject = () => {};
/**成员管理全部拒绝处理事件**/
const handlerAllAccept = () => {};

</script>

<style lang="scss" scoped>
</style>
