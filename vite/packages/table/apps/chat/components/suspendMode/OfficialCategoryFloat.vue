<!-- 官方社群的悬浮组件 -->
<template>
  <div
    :style="columnVisible ? { width: '336px' } : { width: '240px' }"
    class="relative"
  >
    <img
      :src="textUrl"
      class="w-full h-full object-cover"
      :class="sildVisible ? 'rounded-t-xl' : ''"
    />
    <div class="community-name h-11 w-full com-line-bg">
      <div
        class="m-1.5 px-3 items-center rounded-lg drop-hover flex justify-between h-8"
      >
        <OfficialDropdown
          :newIcon="'fluent:line-horizontal-3-20-filled'"
          class="w-full"
          :title="officialInfo.name"
          :list="dropdownList"
        />
      </div>
    </div>
  </div>

  <div :style="sildVisible ? { height: '450px' } : { height: '100%' }">
    <div
      class="px-3 h-full flex flex-col my-2"
      :style="columnVisible ? { width: '336px' } : { width: '240px' }"
    >
      <template v-if="columnVisible">
        <div class="flex flex-col" style="height: 100px">
          <div
            class="font-14 summary font-400 mb-3 xt-font xt-text-2 summary-2"
          >
            {{ officialInfo.summary }}
          </div>
          <div class="w-full flex items-center justify-start">
            <div
              class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mb-2"
              :class="sildVisible ? '' : 'xt-bg'"
            >
              社群号：{{ officialInfo.no }}
            </div>
          </div>
          <div>
            <a-row :gutter="10">
              <a-col flex="55px" class="mt-1 text-right">
                <span class="px-2 rounded-full xt-active-bg xt-active-text">
                  0 级
                </span>
              </a-col>
              <a-col flex="auto" style="padding-top: 3px">
                <a-progress
                  :show-info="false"
                  strokeColor="var(--active-bg)"
                  :percent="10"
                ></a-progress>
              </a-col>
            </a-row>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col" style="height: 100px">
          <div class="flex items-center">
            <div
              class="font-14 summary font-400 mb-3 xt-font xt-text-2"
              :class="isCollapsed ? 'summary-3' : 'summary-1'"
            >
              {{ officialInfo.summary }}
            </div>
            <xt-button
              w="32"
              h="32"
              style="background: none !important"
              @click="openHideContent"
            >
              <div class="flex items-center justify-center" v-if="!isCollapsed">
                <xt-ify-icon
                  icon="fluent:caret-down-16-filled"
                  size="20"
                  class="xt-text"
                />
              </div>
              <div class="flex items-center justify-center" v-else>
                <xt-ify-icon
                  icon="fluent:caret-up-16-filled"
                  size="20"
                  class="xt-text"
                />
              </div>
            </xt-button>
          </div>
          <div class="flex items-center">
            <span
              class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3"
              :class="sildVisible ? '' : 'xt-bg'"
            >
              社群号：{{ officialInfo?.no }}
            </span>
            <span class="px-2 rounded-md xt-active-bg xt-active-text">
              0 级
            </span>
          </div>
          <a-progress
            :show-info="false"
            strokeColor="var(--active-bg)"
            v-if="isCollapsed"
            :percent="0"
          />
        </div>
      </template>

      <a-divider
        style="
          height: 2px;
          margin: 8px 0;
          border-top: 1px solid var(--divider) !important;
        "
      />

      <div class="flex-1">
        <xt-scrollbar :y="true" class="w-full" :style="calcHeight">
          <template v-for="item in officialInfo.channelList">
            <TreeFold :item="item" @update="handleUpdateCollapse">
              <template #title>
                <div class="xt-text xt-font font-14">
                  {{ item.name }}
                </div>
              </template>

              <template #panelContent>
                <template v-if="columnVisible === false">
                  <div class="flex flex-col">
                    <FloatItem
                      :list="item.children"
                      @currentClick="officialClick"
                      :menusVisible="false"
                    />
                  </div>
                </template>
                <template v-else>
                  <div class="grid grid-cols-2 gap-1">
                    <FloatItem
                      :list="item.children"
                      @currentClick="officialClick"
                      :menusVisible="false"
                    />
                  </div>
                </template>
              </template>
            </TreeFold>
          </template>
        </xt-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";

import OfficialDropdown from "../dropdown/Dropdown.vue";
import TreeFold from "../tree/TreeFold.vue";
import FloatItem from "./FloatItem.vue";

const { proxy } = getCurrentInstance();
const chatCommunity = chatCommunityStore();
const { setting, defaultOfficialList } = storeToRefs(chatCommunity);

// ref定义区域
const textUrl = ref(
  "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG"
);
const officialInfo = ref(defaultOfficialList.value[0]);
const showList = ref([
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "展开边栏",
    type: "show",
    callBack: () => {
      chatCommunity.setSuspendVisible({
        enable: false,
        no: officialInfo.value.no,
      });
    },
  },
]);
const hideList = ref([
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "收起边栏",
    callBack: () => {
      chatCommunity.setSuspendVisible({
        enable: true,
        no: officialInfo.value.no,
      });
    },
  },
  {
    newIcon: "fluent:apps-list-detail-24-regular",
    title: "切换双/单列",
    callBack: () => {
      chatCommunity.setColumnMode();
    },
  },
]);

// 开启单双列模式
const columnVisible = computed(() => {
  return setting.value.isColumnMode;
});
// 侧边栏隐藏模式
const sildVisible = computed(() => {
  return (
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null &&
    Number(setting.value.suspendVisible.no) === Number(officialInfo.value.no)
  );
});
// 下拉菜单列表
const dropdownList = computed(() => {
  if (sildVisible.value) {
    return showList.value;
  } else {
    return hideList.value;
  }
});
// 是否折叠
const isCollapsed = computed(() => {
  const visible = setting.value.collapsedVisible.enable;
  const isNo =
    Number(setting.value.collapsedVisible.no) === Number(officialInfo.value.no);
  if (visible && isNo) {
    return false;
  } else {
    return true;
  }
});
// 计算折叠面板的高度
const calcHeight = computed(() => {
  if (sildVisible.value) {
    return {
      height: "300px",
    };
  } else {
    return {
      height: "75%",
    };
  }
});

// 触发折叠
const openHideContent = () => {
  const enable = (setting.value.collapsedVisible.enable =
    !setting.value.collapsedVisible.enable);
  chatCommunity.setCollapsed({ enable: enable, no: officialInfo.value.no });
};
// 更新折叠面板
const handleUpdateCollapse = (data) => {
  const { value, id } = data;
  const list = defaultOfficialList.value[0].channelList.map((item) => {
    if (Number(item.id) === Number(id)) {
      return {
        ...item,
        key: value,
      };
    } else {
      return { ...item };
    }
  });
  defaultOfficialList.value = [
    {
      ...defaultOfficialList.value[0],
      channelList: list,
    },
  ];
};

// 点击当前左侧列表
const officialClick = (data) => {
  proxy.$bus.emit("handleOfficalClick", data);
};
</script>

<style lang="scss" scoped>
.community-name {
  position: absolute;
  bottom: 0;
}
.com-line-bg {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
.drop-hover {
  &:hover {
    background: var(--primary-bg);
  }
}
.group-item {
  width: 156px !important;
}
.active-bg {
  background: var(--active-secondary-bg);
}
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