<!-- 社群详情左侧栏页面 -->
<template>
  <div
    :style="columnVisible ? { width: '336px' } : { width: '240px' }"
    class="relative"
  >
    <HeaderInfo :no="no" :sideVisible="sideVisible" @currentApp="currentOpen" />
  </div>

  <div :style="sideVisible ? { height: '450px' } : {}">
    <div
      class="px-3 h-full flex flex-col justify-between my-2"
      :style="columnVisible ? { width: '336px' } : { width: '240px' }"
    >
      <!-- 中间信息 -->
      <MiddleInfo
        :columnVisible="columnVisible"
        :no="no"
        :sideVisible="sideVisible"
        class="flex-none"
      />

      <!-- 分割线 -->
      <a-divider
        style="
          height: 2px;
          margin: 8px 0;
          border-top: 1px solid var(--divider) !important;
        "
        class="flex-none"
      />

      <!-- 空状态 -->
      <template
        v-if="firstChannel.length === 0 && secondaryChannel.length === 0"
      >
        <div style="height: 60vh" class="flex items-center justify-center">
          <div class="flex flex-col">
            <CategoryEmpty  :no="no" />
          </div>
        </div>
      </template>

      <!-- 底部 -->
      <div
        class="grow"
        :class="columnVisible ? 'column-scrollbar' : 'category-scrollbar'"
      >
        <xt-scrollbar :y="true" class="h-full">
          <!-- 一级频道目录 -->
          <template v-if="firstChannel.length !== 0">
            <!-- 单列模式 -->
            <template v-if="columnVisible === false">
              <div class="flex flex-col">
                <FloatItem
                  :list="firstChannel"
                  @currentClick="handleCommunity"
                  :menusVisible="true"
                  :role="currentInfoDetail?.role"
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
                  :role="currentInfoDetail?.role"
                  :no="no"
                />
              </div>
            </template>
          </template>

          <!-- 二级频道目录 -->
          <template v-if="secondaryChannel.length !== 0">
            <template v-for="item in secondaryChannel">
              <TreeFold :item="item">
                <!-- 标题 -->
                <template #title>
                  <div class="xt-text-2 xt-font font-14">
                    {{ item.name }}
                  </div>
                </template>

                <!-- 右键下拉菜单 -->
                <template #rightDropdown>
                  <div
                    class="flex items-center justify-center"
                    v-if="currentInfoDetail?.role !== 'member'"
                  >
                    <RightDropdown
                      :newIcon="'fluent:more-horizontal-16-regular'"
                      :list="childrenList"
                      :dropItem="item"
                    />
                  </div>
                </template>

                <!-- 内容 -->
                <template #panelContent>
                  <!-- 单列 -->
                  <template v-if="columnVisible === false">
                    <div class="flex flex-col">
                      <FloatItem
                        :list="item.children"
                        @currentClick="handleCommunity"
                        :menusVisible="true"
                        :role="currentInfoDetail?.role"
                        :no="no"
                      />
                    </div>
                  </template>

                  <!-- 双列 -->
                  <template v-else>
                    <div class="grid grid-cols-2 gap-1">
                      <FloatItem
                        :list="item.children"
                        @currentClick="handleCommunity"
                        :menusVisible="true"
                        :role="currentInfoDetail?.role"
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
    :no="currentInfoDetail?.communityInfo?.no"
    :currentCategoryName="currentCategorySetting"
  />

  <!-- 子级频道添加新应用 -->
  <AddNewUnClassApp ref="newUnClassRef" :currentAppSet="currentAppSet" />
</template>

<script setup>
import {
  ref,
  toRefs,
  computed,
  getCurrentInstance,
  watchEffect,
  watch,
} from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../store/chatCommunity";
import _ from "lodash-es";

/**顶部信息详情**/
import HeaderInfo from "./detail/HeaderInfo.vue";
/**中间信息详情**/
import MiddleInfo from "./detail/MiddleInfo.vue";
/**频道目录空状态**/
import CategoryEmpty from "../../page/empty/CategoryEmpty.vue";
import FloatItem from "./FloatItem.vue";
import TreeFold from "../tree/TreeFold.vue";
import RightDropdown from "../dropdown/Dropdown.vue";
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

/**解构store数据存储**/
const chatCommunity = chatCommunityStore();
const { setting, myCommunity, communityTreeList } = storeToRefs(chatCommunity);

/**ref组件**/
const newAppRef = ref(null);
const newCategoryRef = ref(null);
const newUnClassRef = ref(null);
/**当前的分组设置**/
const currentCategorySetting = ref(null);
/**当前的应用设置**/
const currentAppSet = ref({});
/**二级频道的下拉菜单**/
const childrenList = ref([
  {
    newIcon: "fluent:apps-add-in-20-filled",
    title: "添加新应用",
    callBack: (item, value) => {
      currentAppSet.value = value;
      newUnClassRef.value.openNewUnClassApp();
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

/**单双列模式**/
const columnVisible = computed(() => {
  return setting.value.isColumnMode;
});

/**是否开启悬浮模式**/
const sideVisible = computed(() => {
  const currentInfo = _.find(myCommunity.value, function (item) {
    if (item?.communityInfo) {
      return String(item?.communityInfo?.no) === String(no.value);
    }
  });
  return (
    setting.value.suspendVisible.enable &&
    setting.value.suspendVisible.no !== null &&
    Number(setting.value.suspendVisible.no) ===
      Number(currentInfo?.communityInfo?.no)
  );
});

/**获取当前社群信息详情**/
const currentInfoDetail = computed(() => {
  // 这里需要获取到社群权限角色信息
  const index = _.findIndex(myCommunity.value, function (item) {
    if (item?.communityInfo) {
      return String(item?.communityInfo?.no) === String(no.value);
    }
  });
  if (index > -1) return myCommunity.value[index];
  return {};
});

/**一级频道目录**/
const firstChannel = computed(() => {
  const emptyArr = communityTreeList.value?.firstChannel.length !== 0;
  if (emptyArr) return communityTreeList.value?.firstChannel;
  return [];
});

/**二级频道目录**/
const secondaryChannel = computed(() => {
  const isEmpty = communityTreeList.value?.secondaryChannel.length !== 0;
  if (isEmpty) return communityTreeList.value?.secondaryChannel;
  return [];
});

/**下拉菜单触发回调事件**/
const currentOpen = (type) => {
  switch (type) {
    case "newApp":
      newUnClassRef.value.openNewUnClassApp();
      break;
    case "newCategory":
      newCategoryRef.value.openCategoryModal();
      break;
  }
};

/** 处理频道点击事件**/
const handleCommunity = (data) => {
  proxy.$bus.emit("handleCurrentCommunity", data);
};
</script>

<style lang="scss" scoped>
@media screen and (max-height: 500px) {
  .category-scrollbar {
    height: 15vh !important;
  }
  .column-scrollbar {
    height: 4vh !important;
  }
}
@media screen and (min-height: 501px) and (max-height: 512px) {
  .category-scrollbar {
    height: 22vh !important;
  }
  .column-scrollbar {
    height: 10vh !important;
  }
}
@media screen and (min-height: 513px) and (max-height: 550px) {
  .category-scrollbar {
    height: 27vh !important;
  }
  .column-scrollbar {
    height: 15vh !important;
  }
}
@media screen and (min-height: 551px) and (max-height: 600px) {
  .category-scrollbar {
    height: 34vh !important;
  }
  .column-scrollbar {
    height: 24vh !important;
  }
}
@media screen and (min-height: 601px) and (max-height: 650px) {
  .category-scrollbar {
    height: 38vh !important;
  }
  .column-scrollbar {
    height: 30vh !important;
  }
}
@media screen and (min-height: 651px) and (max-height: 700px) {
  .category-scrollbar {
    height: 42vh !important;
  }
  .column-scrollbar {
    height: 34vh !important;
  }
}
@media screen and (min-height: 701px) and (max-height: 750px) {
  .category-scrollbar {
    height: 45vh !important;
  }
  .column-scrollbar {
    height: 38vh !important;
  }
}
@media screen and (min-height: 751px) and (max-height: 800px) {
  .category-scrollbar {
    height: 50vh !important;
  }
  .column-scrollbar {
    height: 42.5vh !important;
  }
}
@media screen and (min-height: 801px) and (max-height: 850px) {
  .category-scrollbar {
    height: 53vh !important;
  }
  .column-scrollbar {
    height: 47vh !important;
  }
}
@media screen and (min-height: 851px) and (max-height: 1000px) {
  .category-scrollbar {
    height: 59vh !important;
  }
  .column-scrollbar {
    height: 54vh !important;
  }
}
@media screen and (min-height: 1001px) {
  .category-scrollbar {
    height: 61vh !important;
  }
  .column-scrollbar {
    height: 56vh !important;
  }
}
</style>
