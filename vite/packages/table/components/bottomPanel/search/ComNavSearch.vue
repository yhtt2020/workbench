<!-- 社群导航搜索页 -->
<template>
  <div class="com-nav-bg flex flex-col">
    <!-- 搜索 -->
    <a-input
      v-model:value="search"
      placeholder="搜索"
      class="w-full xt-bg-t-2"
      @change="getSearchResult"
      style="border-radius: 8px !important; height: 40px"
    >
      <template #suffix>
        <div v-if="search === ''" class="pointer" @click="getSearchResult">
          <xt-ify-icon icon="fluent:search-16-regular" size="20"></xt-ify-icon>
        </div>
        <div v-else @click="search = ''" class="pointer">
          <xt-ify-icon icon="fluent:dismiss-16-regular" size="16"></xt-ify-icon>
        </div>
      </template>
    </a-input>
    <div style="height: 8px"></div>
    <!-- 已加入的社群列表 -->
    <xt-scrollbar
      class="flex-1 w-full h-2/3 overflow-hidden"
      :x="false"
      :y="true"
    >
      <div class="flex flex-col">
        <div
          v-for="(item, index) in communityList"
          :key="item.communityInfo.no"
          class="p-2 flex justify-between items-center rounded-lg mb-2 pointer"
          @click="selectCommunity(item, index)"
          :class="currentCommunity.index === index ? 'select' : ''"
        >
          <div class="flex items-center">
            <div style="width: 40px; height: 40px" class="mr-3">
              <img
                :src="item.communityInfo.icon"
                alt=""
                class="w-full h-full object-cover"
                style="border-radius: 10px"
              />
            </div>
            <span class="xt-text xt-font font-16">
              {{ item.communityInfo.name }}
            </span>
          </div>

          <xt-ify-icon
            icon="fluent:checkmark-circle-16-filled"
            v-if="currentCommunity.index === index"
            style="color: rgba(80, 139, 254, 0.6)"
          ></xt-ify-icon>
        </div>
      </div>
    </xt-scrollbar>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  watchEffect,
  getCurrentInstance,
  onMounted,
} from "vue";
import { storeToRefs } from "pinia";
import { chatCommunityStore } from "../../../apps/chat/store/chatCommunity";
import { communityNavStore } from "../store/communityNavStore";
import { useRouter } from "vue-router";
import { appStore } from "../../../store";
import { getCommunityDeskList } from "../../../apps/communityDesk/hooks/deskCreateMethod";
import { communityDeskStore } from "../../../apps/communityDesk/store/communityDeskStore";
import { cardStore } from "../../../store/card";
import _ from "lodash-es";

// 路由
const router = useRouter();

// 获取proxy
const { proxy } = getCurrentInstance();

// 解构store存储数据
const com = chatCommunityStore();
const { myCommunity } = storeToRefs(com);
const comNav = communityNavStore();
const { currentCommunity } = storeToRefs(comNav);
const app = appStore();
const { settings } = storeToRefs(app);
const communityDesk = communityDeskStore();
const { syncDesk } = storeToRefs(communityDesk);
const { desks } = storeToRefs(cardStore());

// ref定义数据
const search = ref("");
const communityList = ref([]);
// 存储选中的社群
const selectCommunityItem = ref({});

// emit触发事件
const emit = defineEmits(["close"]);

// 获取当前已经加入的社群列表
const getCurrentCommunityList = () => {
  if (myCommunity.value.length !== 0) {
    const filterList = myCommunity.value.filter((item) => {
      if (item.communityInfo) {
        return item;
      }
    });
    communityList.value = filterList;
  } else {
    communityList.value = [];
  }
};
watchEffect(() => {
  getCurrentCommunityList();
});

// 搜索社群
const getSearchResult = () => {
  if (search.value !== "") {
    const searchList = myCommunity.value.communityList.filter((item) => {
      if (item.communityInfo) {
        return item.communityInfo.name.includes(search.value);
      }
    });
    communityList.value = searchList;
  } else {
    // 搜索框为空时，重置原来的数据列表
    getCurrentCommunityList();
  }
};

// 选择社群
const selectCommunity = async (item, index) => {
  const role = item?.role;
  // 先检测当前所在社群的角色权限是管理员还是成员,
  if (role === "owner") {
    // 管理员,检测当前社群有没有创建桌面。
    const communityDesks = getCommunityDeskList(item.communityInfo);
    if (communityDesks.length > 0){
      switchCommunity(item,index);
    }
    else {
      selectCommunityItem.value = { item, index };
      proxy.$bus.emit("openCommunityDesk");
    }
  }
  // 成员
  else if (role === "member") {
    // 加载获取云端数据
    loadSyncDesk(item?.communityInfo?.no);
    // 检测云端获取的数据有没有存在本地中
    const memberDesks = getCommunityDeskList(item.communityInfo);
    if (memberDesks.length > 0) {
      switchCommunity(item,index);
    } else {
      window.$ui.confirm("暂无可用的社群桌面", "请联系你的社群管理员创建", {
        ok: () => {},
        okText: "好的",
        noText: null,
        type: "link",
      });
    }
  }
  // 选择后进行弹窗关闭
  emit("close");
};

// 加载云端数据处理方法
const loadSyncDesk = async(no) => {
  communityDesk.setCurrentDeskNo(no);
  communityDesk.loadCommunityDeskDetail();
  communityDesk.loadCommunityDeskAll();
};

// 切换社群的方法进行提取
const switchCommunity = (item,index) => {
  if (settings.value.isCommunity) {
    settings.value.isCommunity = false;
  }
  router.push({ name: "home", params: { no: item.communityInfo.no } });
  comNav.setCurrentCommunity(item, index);
};

onMounted(() => {
  proxy.$bus.on("updateSetting", () => {
    settings.value.isCommunity = false;
    comNav.setCurrentCommunity(
      selectCommunityItem.value?.item,
      selectCommunityItem.value?.index
    );
  });
});
</script>

<style lang="scss" scoped>
.com {
  &-nav-bg {
    width: 280px;
    height: 321px;
    background: var(--primary-bg);
    border-radius: 10px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 13px 12px 12px 12px;
    backdrop-filter: blur(12px);
  }
}
.select {
  background: rgba(80, 139, 254, 0.2) !important;
}
</style>
