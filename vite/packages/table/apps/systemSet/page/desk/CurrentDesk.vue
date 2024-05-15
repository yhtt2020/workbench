<template>
  <!-- 桌面设置可以编辑 -->
  <template v-if="!communityRole">
    <template v-if="checkIsCommunity">
      <div class="rounded-lg mb-4 xt-bg-2 px-4 py-3.5 flex flex-col">
        <SyncCommunityDesk/>
        <!--  :deskInfo="community" -->
      </div>
    </template>

    <div class="p-4 mb-4 text-base xt-bg-2 rounded-xl">
      <div class="mb-4">桌面名称</div>
      <xt-input v-model="getCurrentDesk.name" class="xt-modal xt-b"></xt-input>
    </div>
    <div class="xt-bg-2 p-4 mb-4 rounded-xl">
      <div class="mb-2.5">桌面布局模式</div>
      <div
        class="rounded-xl text-sm p-3 xt-bg-t-2 mb-3"
        style="color: var(--warning)"
      >
        目前「自由布局」还处于测试完善中，「水平布局」和「垂直布局」是我们提供的过度方案，如果你在使用「自由布局」中出现了影响使用的问题，请切换到其他两种布局模式）
      </div>
      <xt-option-tab
        v-model="currentLayout"
        :list="layoutList"
        circle
        style="margin-bottom: 0; height: 40px"
        @cb="updateTab"
      />
    </div>
    <div v-if="!isFreeLayout" class="xt-bg-2 p-4 mb-4 rounded-xl">
      <xt-option-info title="滚动模式" info="选择桌面的滚动模式。" />
      <xt-option-tab
        v-model="fixedLayout"
        :list="fixedLayoutList"
        circle
        style="height: 40px"
        @cb="updateFixedLayout"
      />
      <xt-option-info
        isSwitch
        v-model:switch="currentDeskSettings.enableZoom"
        title="独立设置"
        info="开启独立设置后，将不再使用「通用设置」中的相关设置。"
      />
      <template v-if="currentDeskSettings.enableZoom">
        <hr />
        <xt-option-info title="适应模式" info="" />
        <xt-option-tab
          v-model="currentDeskSettings.fitMod"
          :list="fitList"
          circle
          style="height: 40px"
        />
        <xt-option-info
          v-if="
            currentDeskSettings.fitMod == 'center' && fixedLayout == 'vertical'
          "
          title="容器宽度"
          info="调节桌面容器宽度"
          @onIconClick="currentDeskSettings.containerWidth = 1024"
          icon="fluent:arrow-clockwise-16-regular"
        />
        <xt-option-slider
          v-if="
            currentDeskSettings.fitMod == 'center' && fixedLayout == 'vertical'
          "
          v-model:slider="currentDeskSettings.containerWidth"
          :min="800"
          :max="1600"
          style="margin: 0 !important"
        />
        <xt-option-info
          v-if="
            currentDeskSettings.fitMod == 'center' &&
            fixedLayout == 'horizontal'
          "
          title="容器高度"
          info="调节桌面容器高度"
          @onIconClick="currentDeskSettings.containerHeight = 800"
          icon="fluent:arrow-clockwise-16-regular"
        />
        <xt-option-slider
          v-if="
            currentDeskSettings.fitMod == 'center' &&
            fixedLayout == 'horizontal'
          "
          v-model:slider="currentDeskSettings.containerHeight"
          :min="480"
          :max="1600"
          style="margin: 0 !important"
        />
        <xt-option-info
          title="桌面缩放"
          info="调节桌面的缩放比例，默认为100%。"
          icon="fluent:arrow-clockwise-16-regular"
          @onIconClick="currentDeskSettings.cardZoom = 100"
        />
        <xt-option-slider
          v-model:slider="currentDeskSettings.cardZoom"
          :min="20"
          :max="500"
        />
        <hr />
        <xt-option-info
          title="组件间距"
          info="调节组件之间的间距，默认为 12px。"
          icon="fluent:arrow-clockwise-16-regular"
          @onIconClick="currentDeskSettings.cardMargin = 12"
        />
        <xt-option-slider
          v-model:slider="currentDeskSettings.cardMargin"
          :min="6"
          :max="30"
        />
        <hr />
        <xt-option-info
          title="桌面距离顶部状态栏间距"
          info="调节桌面和「顶部状态栏」的间距。"
          @onIconClick="currentDeskSettings.marginTop = 0"
          icon="fluent:arrow-clockwise-16-regular"
        />
        <xt-option-slider
          v-model:slider="currentDeskSettings.marginTop"
          :min="0"
          :max="200"
          style="margin: 0 !important"
        />
      </template>
    </div>
    <FreeLayoutState v-else />
  </template>

  <!-- 桌面编辑禁用 -->
  <template v-else>
    <div class="rounded-lg mb-4 xt-bg-2 px-4 py-3.5 flex flex-col">
      <SyncCommunityDesk  />
      {{ checkIsCommunity }}
      <!-- :deskInfo="community" -->
    </div>

    <div class="disable-edit">
      <div class="p-4 mb-4 text-base xt-bg-2 rounded-xl">
        <div class="mb-4">桌面名称</div>
        <xt-input
          v-model="getCurrentDesk.name"
          class="xt-modal xt-b"
        ></xt-input>
      </div>
      <div class="xt-bg-2 p-4 mb-4 rounded-xl">
        <div class="mb-2.5">桌面布局模式</div>
        <div
          class="rounded-xl text-sm p-3 xt-bg-t-2 mb-3"
          style="color: var(--warning)"
        >
          目前「自由布局」还处于测试完善中，「水平布局」和「垂直布局」是我们提供的过度方案，如果你在使用「自由布局」中出现了影响使用的问题，请切换到其他两种布局模式）
        </div>
        <xt-option-tab
          v-model="currentLayout"
          :list="layoutList"
          circle
          style="margin-bottom: 0; height: 40px"
          @cb="updateTab"
        />
      </div>
      <div v-if="!isFreeLayout" class="xt-bg-2 p-4 mb-4 rounded-xl">
        <xt-option-info title="滚动模式" info="选择桌面的滚动模式。" />
        <xt-option-tab
          v-model="fixedLayout"
          :list="fixedLayoutList"
          circle
          style="height: 40px"
          @cb="updateFixedLayout"
        />
        <xt-option-info
          isSwitch
          v-model:switch="currentDeskSettings.enableZoom"
          title="独立设置"
          info="开启独立设置后，将不再使用「通用设置」中的相关设置。"
        />
        <template v-if="currentDeskSettings.enableZoom">
          <hr />
          <xt-option-info title="适应模式" info="" />
          <xt-option-tab
            v-model="currentDeskSettings.fitMod"
            :list="fitList"
            circle
            style="height: 40px"
          />
          <xt-option-info
            v-if="
              currentDeskSettings.fitMod == 'center' &&
              fixedLayout == 'vertical'
            "
            title="容器宽度"
            info="调节桌面容器宽度"
            @onIconClick="currentDeskSettings.containerWidth = 1024"
            icon="fluent:arrow-clockwise-16-regular"
          />
          <xt-option-slider
            v-if="
              currentDeskSettings.fitMod == 'center' &&
              fixedLayout == 'vertical'
            "
            v-model:slider="currentDeskSettings.containerWidth"
            :min="800"
            :max="1600"
            style="margin: 0 !important"
          />
          <xt-option-info
            v-if="
              currentDeskSettings.fitMod == 'center' &&
              fixedLayout == 'horizontal'
            "
            title="容器高度"
            info="调节桌面容器高度"
            @onIconClick="currentDeskSettings.containerHeight = 800"
            icon="fluent:arrow-clockwise-16-regular"
          />
          <xt-option-slider
            v-if="
              currentDeskSettings.fitMod == 'center' &&
              fixedLayout == 'horizontal'
            "
            v-model:slider="currentDeskSettings.containerHeight"
            :min="480"
            :max="1600"
            style="margin: 0 !important"
          />
          <xt-option-info
            title="桌面缩放"
            info="调节桌面的缩放比例，默认为100%。"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="currentDeskSettings.cardZoom = 100"
          />
          <xt-option-slider
            v-model:slider="currentDeskSettings.cardZoom"
            :min="20"
            :max="500"
          />
          <hr />
          <xt-option-info
            title="组件间距"
            info="调节组件之间的间距，默认为 12px。"
            icon="fluent:arrow-clockwise-16-regular"
            @onIconClick="currentDeskSettings.cardMargin = 12"
          />
          <xt-option-slider
            v-model:slider="currentDeskSettings.cardMargin"
            :min="6"
            :max="30"
          />
          <hr />
          <xt-option-info
            title="桌面距离顶部状态栏间距"
            info="调节桌面和「顶部状态栏」的间距。"
            @onIconClick="currentDeskSettings.marginTop = 0"
            icon="fluent:arrow-clockwise-16-regular"
          />
          <xt-option-slider
            v-model:slider="currentDeskSettings.marginTop"
            :min="0"
            :max="200"
            style="margin: 0 !important"
          />
        </template>
      </div>
      <FreeLayoutState v-else />
    </div>
  </template>
</template>

<script setup>
import { ref, toRefs, computed, defineAsyncComponent } from "vue";
import _ from "lodash-es";
import { storeToRefs } from "pinia";
const FreeLayoutState = defineAsyncComponent(() =>
  import("../../../../components/desk/freeLayout/State.vue")
);
import { useFreeLayoutStore } from "../../../../components/desk/freeLayout/store";
import { chatCommunityStore } from "../../../chat/store/chatCommunity";

import SyncCommunityDesk from "../../../communityDesk/components/SyncCommunityDesk.vue";

// 解构store数据存储
const freeLayoutStore = useFreeLayoutStore();
const { isFreeLayout, getCurrentDesk } = storeToRefs(freeLayoutStore);
const chatCommunity = chatCommunityStore();
const { myCommunity } = storeToRefs(chatCommunity);

const currentDeskSettings = computed(() => {
  return getCurrentDesk.value.settings;
});
// 桌面布局切换
const currentLayout = ref(isFreeLayout.value === true ? "free" : "fixed");
const layoutList = ref([
  {
    name: "自动排列",
    value: "fixed",
  },
  {
    name: "自由布局",
    value: "free",
  },
]);
const fitList = ref([
  {
    name: "铺满",
    value: "full",
  },
  {
    name: "居中",
    value: "center",
  },
]);
const updateTab = (data) => {
  freeLayoutStore.renewFreeLayout();
};

const fixedLayout = ref(
  currentDeskSettings.value.vDirection ? "vertical" : "horizontal"
);
const fixedLayoutList = ref([
  {
    name: "水平滚动",
    value: "horizontal",
  },
  {
    name: "垂直滚动",
    value: "vertical",
  },
]);

const updateFixedLayout = (data) => {
  currentDeskSettings.value.vDirection = !currentDeskSettings.value.vDirection;
};

// 检测有没有社群
const checkIsCommunity = computed(() => {
  console.log('检测有没有社群',getCurrentDesk.value);
  console.log('检测有没有社群',getCurrentDesk.value.communityNo);
  // if (getCurrentDesk.value.communityNo) {
  //   return true;
  // } else {
  //   return false;
  // }
});

// 获取社群名称
const community = computed(() => {
  console.log('获取社群名称',getCurrentDesk.value);
  console.log('获取社群名称',getCurrentDesk.value.communityNo);
  // if (getCurrentDesk.value.communityNo) {
  //   const find = _.find(myCommunity.value, (item) => {
  //     return Number(getCurrentDesk.value.communityNo) === Number(item.cno);
  //   });
  //   if (find) {
  //     return find;
  //   }
  // }
});

// 获取当前社群的权限
const communityRole = computed(() => {
  console.log('获取当前社群的权限',getCurrentDesk.value);
  console.log('获取当前社群的权限',getCurrentDesk.value.communityNo);

  // if (getCurrentDesk.value.communityNo) {
  //   const find = _.find(myCommunity.value, (item) => {
  //     return Number(getCurrentDesk.value.communityNo) === Number(item.cno);
  //   });
  //   if (find) {
  //     return find?.role === "member";
  //   } else {
  //     return false;
  //   }
  // } else {
  //   return false;
  // }
});
</script>

<style lang="scss" scoped>
.disable-edit {
  backdrop-filter: blur(12px);
  opacity: 0.35;
  pointer-events: none;
}
</style>
