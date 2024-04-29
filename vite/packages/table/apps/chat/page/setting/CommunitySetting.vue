<!-- 社群设置 -->
<template>
  <div class="w-full flex flex-col">
    <div class="rounded-xl xt-bg-t-2 p-4 flex flex-col" style="width: 572px">
      <!-- 顶部编辑信息 -->
      <div class="flex items-center w-full justify-between">
        <div class="flex items-center">
          <div class="flex mr-3 w-10 h-10">
            <a-avatar
              shape="square"
              :size="40"
              :src="currentInfo?.communityInfo?.icon"
            />
          </div>
          <div class="flex flex-col">
            <span class="xt-font font-16 font-400 xt-text">
              {{ currentInfo?.communityInfo?.name }}
            </span>
            <span
              class="xt-font font-14 font-400 xt-text-2 truncate"
              style="max-width: 210px"
            >
              {{ currentInfo?.communityInfo?.summary }}
            </span>
          </div>
        </div>

        <div class="flex items-center">
          <xt-button
            w="64"
            h="40"
            class="xt-bg-t-2 category-button mr-3"
            @click="editorCommunity"
          >
            编辑
          </xt-button>

          <xt-dropdown
            :newIcon="'fluent:more-horizontal-16-regular'"
            :w="40"
            :h="40"
            :placement="'bottomRight'"
            :buttonClass="'rounded-lg xt-bg-t-2'"
          >
            <template v-for="item in settingDropdownMenu">
              <div
                style="width: 184px; margin-bottom: 8px"
                class="rounded-lg flex items-center h-11 drop-item xt-text-2 xt-bg-2 px-4 py-3 pointer"
                @click="item.callBack"
              >
                <xt-ify-icon
                  :icon="item.newIcon"
                  size="20"
                  class="xt-text mr-3"
                />
                <div
                  class="font-16 xt-font flex items-center justify-center"
                  :style="
                    item.type === 'delete'
                      ? { color: 'var(--error)' }
                      : { color: 'var(--primary-text)' }
                  "
                >
                  {{ item.title }}
                </div>
              </div>
            </template>
          </xt-dropdown>
        </div>
      </div>

      <!-- 分割线 -->
      <div class="mt-4 mb-4" style="width: 100%">
        <div class="w-full mx-auto xt-bb"></div>
      </div>

      <!-- 底部社群加入方式 -->
      <div class="w-full flex justify-between items-center">
        <div class="flex flex-col" style="width: 266px">
          <span class="xt-font xt-text-2 font-16 font-400 mb-2">
            加入方式
          </span>
          <span
            class="xt-font xt-text-2 font-14 font-400"
            v-if="currentInfo?.communityInfo?.type === 'public'"
          >
            当前社群为公开，支持外部用户自由加入。
          </span>
          <!-- 提交申请审核加入，或者管理员手动邀请直接加入 -->
        </div>

        <div style="width: 160px" class="flex items-center justify-center">
          <a-select
            class="w-full custom-select"
            v-model:value="setValue"
            :bordered="false"
            style="height: 40px;border-radius: 8px;"
          >
            <a-select-option value="public">公开,自由加入</a-select-option>
            <!-- <a-select-option value="">私密,邀请加入</a-select-option> -->
          </a-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import { useRouter } from "vue-router";
import _ from "lodash-es";

// import SettingDropdown from "../../components/dropdown/Dropdown.vue";

/**解构store缓存数据**/
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

/**路由**/
const router = useRouter();

/**当前社群编号**/
const communityNo = ref(router?.currentRoute.value?.params?.no);

/**默认社群加入方式类型**/ 
const setValue = ref('public');

/**获取社群信息**/
const currentInfo = computed(() => {
  const existVisible = _.some(myCommunity.value, (item) => {
    return Number(item.cno) === Number(communityNo.value);
  });
  if (existVisible) {
    const find = _.find(myCommunity.value, (item) => {
      return Number(item.cno) === Number(communityNo.value);
    });
    return find;
  }
});

/**下拉菜单**/
const settingDropdownMenu = ref([
  {
    newIcon: "fluent:delete-16-regular",
    title: "解散社群",
    type: "delete",
    callBack: () => {
      // 解散社群todo
    },
  },
]);

/**编辑社群**/
const editorCommunity = () => {};
</script>

<style lang="scss" scoped>
:deep(.drop-item) {
  &:last-of-type {
    margin-bottom: 0 !important;
  }
}
:deep(.custom-select) {
  & .ant-select-selector {
    border-radius: 8px !important;
    display: flex;
    align-items: center;
    height: 40px !important;
    background: var(--primary-bg) !important;
  }
  & .ant-select-item {
    color: var(--secondary-text) !important;
  }
}
:deep(.ant-select-selection-placeholder) {
  color: var(--secondary-text) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
:deep(.ant-select-selection-search) {
  display: flex !important;
  align-items: center !important;
  height: 40px !important;
}
:deep(.anticon.ant-input-clear-icon) {
  color: var(--secondary-text) !important;
}
</style>
