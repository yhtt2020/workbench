<!-- 社群详情左侧栏页面 -->
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
        <CategoryDropdown
          :newIcon="'fluent:line-horizontal-3-20-filled'"
          class="w-full"
          :title="currentInfo.communityInfo?.name"
          :list="cateList"
        />
      </div>
    </div>
  </div>

  <div :style="sildVisible ? { height: '450px' } : {}">
    <div
      class="px-3 h-full flex flex-col justify-between my-2"
      :style="columnVisible ? { width: '336px' } : { width: '240px' }"
    >
      <template v-if="columnVisible">
        <!-- 后续补充summary字段,此处暂时先屏蔽-->
        <!-- <div class="font-14 summary mb-3 xt-font xt-text-2 summary-2">
          {{ currentInfo.summary }}
        </div> -->

        <div class="w-full flex items-center justify-start">
          <div
            class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mb-2"
            :class="sildVisible ? '' : 'xt-bg'"
          >
            社群号：{{ currentInfo.communityInfo.no }}
          </div>
        </div>

        <div>
          <a-row :gutter="10">
            <a-col flex="55px" class="mt-1 text-right">
              <span class="px-2 rounded-full xt-active-bg xt-active-text">
                {{ currentInfo.communityInfo.level }} 级
              </span>
            </a-col>
            <a-col flex="auto" style="padding-top: 3px">
              <a-progress
                :show-info="false"
                strokeColor="var(--active-bg)"
                :percent="currentInfo.communityInfo.level"
              />
            </a-col>
          </a-row>
        </div>
      </template>

      <template v-else>
        <!-- 当前字段暂时不存在,先屏蔽,后续进行开发 -->
        <div class="flex items-center" hidden="">
          <div
            class="font-14 summary font-400 mb-3 xt-font xt-text-2"
            :class="isCollapsed ? 'summary-3' : 'summary-1'"
          >
            {{ currentInfo.communityInfo?.summary }}
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
              社群号：{{ currentInfo.communityInfo.no }}
            </span>
            <span class="px-2 rounded-md xt-active-bg xt-active-text">
              {{ currentInfo.communityInfo.level }} 级
            </span>
          </div>
          <a-progress
            :show-info="false"
            strokeColor="var(--active-bg)"
            v-if="isCollapsed"
            :percent="currentInfo.communityInfo.level"
          />
        </div>

        <div class="flex items-center mt-2">
          <span
            class="px-2 py-1 font-12 rounded-md font-400 xt-font xt-text-2 mr-3"
            :class="sildVisible ? '' : 'xt-bg'"
          >
            社群号：{{ currentInfo.communityInfo.no }}
          </span>
          <span class="px-2 rounded-md xt-active-bg xt-active-text">
            {{ currentInfo.communityInfo.level }} 级
          </span>
        </div>

        <a-progress
          :show-info="false"
          strokeColor="var(--active-bg)"
          v-if="isCollapsed"
          :percent="currentInfo.communityInfo.level"
        />
      </template>

      <a-divider
        style="
          height: 2px;
          margin: 8px 0;
          border-top: 1px solid var(--divider) !important;
        "
      />

      <div class="grow tree-container">
        <template
          v-if="firstChannel.length === 0 && secondaryChannel.length === 0"
        >
          <div class="h-full flex flex-col items-center justify-center">
            <CategoryEmpty :role="currentInfo.role" :no="no" />
          </div>
        </template>

        <!-- 树状列表 -->
        <xt-scrollbar :y="true" class="w-full h-full">
          <template v-if="firstChannel.length !== 0">
            <!-- 单列模式 -->
            <template v-if="columnVisible === false">
              <div class="flex flex-col">
                <FloatItem
                  :list="firstChannel"
                  @currentClick="handleCommunity"
                  :menusVisible="true"
                  :role="currentInfo.role"
                  :no="no"
                />
              </div>
            </template>
            <!-- 双列模式 -->
            <template v-else>
              <div class="grid grid-cols-2 gap-1">
                <FloatItem
                  :list="firstChannel"
                  @currentClick="handleCommunity"
                  :menusVisible="true"
                  :role="currentInfo.role"
                  :no="no"
                />
              </div>
            </template>
          </template>
          <template v-if="secondaryChannel.length !== 0">
            <template v-for="item in secondaryChannel">
              <TreeFold :item="item">
                <template #title>
                  <div class="xt-text xt-font font-14">
                    {{ item.name }}
                  </div>
                </template>

                <template #rightDropdown>
                  <div
                    class="flex items-center justify-center"
                    v-if="currentInfo.role !== 'member'"
                  >
                    <RightDropdown
                      :newIcon="'fluent:more-horizontal-16-regular'"
                      :list="childrenList"
                      :dropItem="item"
                    />
                  </div>
                </template>

                <template #panelContent>
                  <template v-if="columnVisible === false">
                    <div class="flex flex-col">
                      <FloatItem
                        :list="item.children"
                        @currentClick="handleCommunity"
                        :menusVisible="true"
                        :role="currentInfo.role"
                        :no="no"
                      />
                    </div>
                  </template>
                  <template v-else>
                    <div class="grid grid-cols-2 gap-1">
                      <FloatItem
                        :list="item.children"
                        @currentClick="handleCommunity"
                        :menusVisible="true"
                        :role="currentInfo.role"
                        :no="no"
                      />
                    </div>
                  </template>
                </template>
              </TreeFold>
            </template>
          </template>
        </xt-scrollbar>
      </div>
    </div>
  </div>

  <!-- 添加新应用 -->
  <AddNewAppPage ref="newAppRef" />
  <!-- 添加分组 -->
  <CreateCategory
    ref="newCategoryRef"
    :no="currentInfo.communityInfo.no"
    :currentCategoryName="currentCategorySetting"
  />
  <!-- 子级频道添加新应用 -->
  <AddNewUnClassApp ref="newUnClassRef" :currentAppSet="currentAppSet" />
</template>

<script setup>
import { ref, toRefs, computed, onMounted, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import _ from "lodash-es";

import CategoryDropdown from "../dropdown/Dropdown.vue";
import FloatItem from "./FloatItem.vue";
import TreeFold from "../tree/TreeFold.vue";
import RightDropdown from "../dropdown/Dropdown.vue";
/**空状态**/
import CategoryEmpty from "../../page/empty/CategoryEmpty.vue";
/**新应用(有频道分类选择)**/
import AddNewAppPage from "../../page/add/AddNewAppPage.vue";
/**新应用(没有频道分类选择)**/
import AddNewUnClassApp from "../../page/add/AddNewUnclassApp.vue";
/**创建分组**/
import CreateCategory from "../../components/create/CreateCategory.vue";

const { proxy } = getCurrentInstance();
const props = defineProps({
  no: {
    type: String,
    required: true,
  },
});
const { no } = toRefs(props);
console.log("no-1", no.value);

const chatCommunity = chatCommunityStore();
const { setting, myCommunity, currentCommunity, communityTreeList } =
  storeToRefs(chatCommunity);

/**ref组件**/
const newAppRef = ref(null);
const newCategoryRef = ref(null);
const newUnClassRef = ref(null);

/**当前的分组设置**/
const currentCategorySetting = ref(null);
/**当前的应用设置**/
const currentAppSet = ref({});

// 社群封面,后续替换成动态url地址
const textUrl = ref(
  "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Yzzj-zana-AI6F-jnTG"
);
// 开启悬浮模式下拉菜单
const hideList = ref([
  {
    newIcon: "fluent:apps-add-in-20-filled",
    title: "添加新应用",
    callBack: () => {
      newAppRef.value.openNewAppFirstStep();
    },
  },
  {
    newIcon: "fluent:add-16-filled",
    title: "添加新分组",
    callBack: () => {
      newCategoryRef.value.openCategoryModal();
    },
  },
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "展开边栏",
    callBack: () => {
      chatCommunity.setSuspendVisible({
        enable: false,
        no: currentInfo.value.communityInfo.no,
      });
    },
  },
  {
    newIcon: "fluent:settings-16-regular",
    title: "社群设置",
    type: "manage",
    callBack: () => {},
  },
  // {
  //   newIcon: "fluent:people-add-16-regular",
  //   title: "邀请其他人",
  //   callBack: () => {},
  // },
  // {
  //   newIcon: "ant-design:team-outlined",
  //   title: "成员管理",
  //   type: "manage",
  //   callBack: () => {},
  // },
]);
// 关闭悬浮模式下拉菜单
const showList = ref([
  {
    newIcon: "fluent:apps-add-in-20-filled",
    title: "添加新应用",
    callBack: () => {
      newAppRef.value.openNewAppFirstStep();
    },
  },
  {
    newIcon: "fluent:add-16-filled",
    title: "添加新分组",
    callBack: () => {
      newCategoryRef.value.openCategoryModal();
    },
  },
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "收起边栏",
    callBack: () => {
      chatCommunity.setSuspendVisible({
        enable: true,
        no: currentInfo.value.communityInfo.no,
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
  // {
  //   newIcon: "fluent:people-add-16-regular",
  //   title: "邀请其他人",
  //   callBack: () => {},
  // },
  {
    newIcon: "fluent:settings-16-regular",
    title: "社群设置",
    type: "manage",
    callBack: () => {},
  },
  // {
  //   newIcon: "ant-design:team-outlined",
  //   title: "成员管理",
  //   type: "manage",
  //   callBack: () => {},
  // },
]);
// 根据权限显示下拉菜单
const adminList = ref([
  {
    newIcon: "fluent:text-indent-decrease-16-filled",
    title: "收起边栏",
    callBack: () => {},
  },
  {
    newIcon: "fluent:apps-list-detail-24-regular",
    title: "切换双/单列",
    callBack: () => {},
  },
  {
    newIcon: "fluent:arrow-exit-20-filled",
    title: "退出社群",
    callBack: () => {},
  },
]);
// 二级频道的下拉菜单
const childrenList = ref([
  {
    newIcon: "fluent:apps-add-in-20-filled",
    title: "添加新应用",
    callBack: (item, value) => {
      currentAppSet.value = value;
      newUnClassRef.value.openNewUnClassApp()
    },
  },
  {
    title: "分组设置",
    newIcon: "fluent:settings-16-regular",
    callBack: (currentItem, value) => {
      newCategoryRef.value.openCategoryModal();
      currentCategorySetting.value = value;
    },
  },
  {
    title: "删除分组",
    newIcon: "akar-icons:trash-can",
    type: "delete",
    callBack: (currentItem, value) => {
      window.$ui.confirm(
        "删除应用操作不可撤销,应用被删除后，子应用将被移动到顶层。是否确定删除？",
        "",
        {
          ok: async () => {
            const res = chatCommunity.deleteChannel(value.id, no.value);
            if (res.status === 1) {
              message.success(`${res.info}`);
            }
          },
          type: "warning",
          noText: "取消",
        }
      );
    },
  },
]);

/**计算属性**/
// 获取是否单双列模式
const columnVisible = computed(() => {
  return setting.value.isColumnMode;
});
// 获取当前社群信息
const currentInfo = computed(() => {
  // 这里需要获取到社群权限角色信息
  const index = _.findIndex(myCommunity.value, function (item) {
    if (item.communityInfo) {
      return String(item.communityInfo.no) === String(no.value);
    }
  });
  console.log('需要查找的no',no.value)
  console.log('查找结果',index)
  console.log('便利的数据',myCommunity.value)
  chatCommunity.getCommunityTree(no.value);
  return myCommunity.value[index];
});
// 是否开启悬浮模式
const sildVisible = computed(() => {
  return (
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null &&
    Number(setting.value.suspendVisible.no) ===
      Number(currentInfo.value.communityInfo.no)
  );
});
// 下拉菜单列表
const cateList = computed(() => {
  /**社群权限**/
  const role = currentInfo.value.role;
  if (role !== "member") {
    /**开启悬浮模式并且社群ID一致**/
    if (sildVisible.value) {
      return hideList.value;
    } else {
      return showList.value;
    }
  } else {
    return adminList.value;
  }
});
// 是否折叠
const isCollapsed = computed(() => {
  const visible = setting.value.collapsedVisible.enable;
  const isNo =
    Number(setting.value.collapsedVisible.no) === Number(currentInfo.value.no);
  if (visible && isNo) {
    return false;
  } else {
    return true;
  }
});
// 一级channel
const firstChannel = computed(() => {
  return communityTreeList.value.firstChannel;
});
// 二级channel
const secondaryChannel = computed(() => {
  return communityTreeList.value.secondaryChannel;
});

/**事件**/
// 触发折叠
const openHideContent = () => {
  const enable = (setting.value.collapsedVisible.enable =
    !setting.value.collapsedVisible.enable);
  chatCommunity.setCollapsed({ enable: enable, no: currentInfo.value.no });
};

// 处理频道点击事件
const handleCommunity = (data) => {
  proxy.$bus.emit("handleCurrentCommunity", data);
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
@media screen and(max-height:500px) {
  .tree-container {
    height: 20vh !important;
  }
}
@media screen and(min-height:501px) and (max-height: 700px) {
  .tree-container {
    height: 40vh !important;
  }
}
@media screen and(min-height:701px) and (max-height: 800px) {
  .tree-container {
    height: 48vh !important;
  }
}
@media screen and(min-height:801px) and (max-height: 900px) {
  .tree-container {
    height: 50vh !important;
  }
}
@media screen and(min-height:901px) {
  .tree-container {
    height: 60vh !important;
  }
}
</style>
