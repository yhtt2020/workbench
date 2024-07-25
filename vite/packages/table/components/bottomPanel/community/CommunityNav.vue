<template>
  <div
    :class="[boxClass]"
    class="flex items-center justify-between communityNav"
    :style="[boxStyle]"
  >
    <div class="flex items-center">
      <div
        v-for="item in communityNavList.slice(0, 1)"
        class="communityNav-more pointer"
        @click="item.fn"
      >
        <a-tooltip :title="item.name">
          <Avatar :item="item" :size="size" />
        </a-tooltip>
      </div>
      <a-divider
        type="vertical"
        style="
          height: 32px;
          margin: 0 14px;
          border-top: 1px solid var(--divider) !important;
        "
      />
    </div>
    <div class="flex pointer" :style="{ gap: gap + 'px' }">
      <a-tooltip
        :title="item.name"
        v-for="item in communityNavList.slice(1)"
        @click="item.fn"
      >
        <Avatar :item="item" :size="size" />
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, getCurrentInstance, toRefs, onMounted } from "vue";
import { nanoid } from "nanoid";
import { useRouter } from "vue-router";
import { chatCommunityStore } from "../../../apps/chat/store/chatCommunity";
import { communityNavStore } from "../store/communityNavStore";
import { appStore } from "../../../store";
import { getCommunityDeskList } from "../../../apps/communityDesk/hooks/deskCreateMethod";
import { communityDeskStore } from "../../../apps/communityDesk/store/communityDeskStore";
import Avatar from "../../desk/navigationBar/components/Avatar.vue";
import _ from "lodash-es";
import { cardStore } from "../../../store/card";

import {message} from "ant-design-vue";
// 路由
const router: any = useRouter();

// pinia数据
const communityNav: any = chatCommunityStore();
const { myCommunity } = storeToRefs(communityNav);
const comNav: any = communityNavStore();
const { settingType, currentCommunity } = storeToRefs(comNav);
const app: any = appStore();
const { settings, showGuide } = storeToRefs(app);
const communityDesk: any = communityDeskStore();
const { loadDesk,loadDeskAll, communityDeskInfo } = storeToRefs(communityDesk);
const card: any = cardStore();
const { desks } = storeToRefs(card);

// 获取当前实例
const { proxy } = getCurrentInstance() as any;

type PropsType = {
  boxClass: string; // 自定义类样式
  boxStyle: string; // 自定义样式
  size: number; // 图标大小
  gap: number; // 图标布局间隔
};

const props = withDefaults(defineProps<PropsType>(), {
  boxClass: "xt-bg xt-shadow mr-3 rounded-2xl p-3 ",
  boxStyle: "",
  size: 54,
  gap: 20,
});

const { boxClass, boxStyle, size, gap } = toRefs(props);

// 根据社群数量进行调整
const communityNum = computed(() => {
  return myCommunity.value.length !== 0;
});

// 团队导航图标公共数据
const createNavEntry = (options: any) => ({
  bg: "",
  isBg: false,
  mode: "app",
  type: "systemApp",
  id: nanoid(6),
  ...options,
});

// 团队导航
const communityNavList = computed(() => {
  console.log(communityNav.myCommunity,'当前的社群')
  if(!currentCommunity.value.defaultItem){
    if(communityNav.myCommunity?.length>0){
      currentCommunity.value.defaultItem=communityNav.myCommunity[0]
    }
  }
  // 团队导航重复项
  const baseItems = [
    {
      icon: "/logo/browser.svg",
      name: "团队导航",
      fn: openNav,
    },
    {
      icon: "/logo/teamNav.svg",
      name: "团队桌面",
      fn: openDesk,
    },
  ];

  if (communityNum.value) {
    return [
      createNavEntry({
        ...currentCommunity.value.item,
        fn: (event: any) => {
          proxy.$bus.emit("openComSearch", event);
        },
      }),
      createNavEntry({
        icon: currentCommunity.value?.defaultItem?.icon || '/logo/home.svg',
        name: "社群主应用",
        fn: () => {
          if ((currentCommunity.value.item as any).role) {
            router.push({
              name: "myCommunity",
              params: { ...currentCommunity.value?.item },
            });
          } else {
            /**调整路由名称**/
           // router.push({ name: "officialCommunity", params: { no: 1 } });
          }
        },
      }),
      ...baseItems.map((item) => createNavEntry(item)),
    ];
  } else {
    return [
      createNavEntry({
        value: "task",
        name: "想天社群",
        icon: "/icons/logo128.png",
        fn: () => {
          /**调整路由名称**/
          router.push({ name: "officialCommunity", params: { no: 1 } });
        },
      }),
      ...baseItems.map((item) => createNavEntry(item)),
    ];
  }
});

const openNav = async (event: any) => {
  await (communityNavStore() as any).loadCommunityNav();
  if (settingType.value === "app") {
    proxy.$bus.emit("openAppVisible");
  } else {
    proxy.$bus.emit("openTeamNav", event);
  }
};

//  进入社群桌面
const openDesk = async () => {
  if(showGuide.value) {
    message.info("定制过程中无法操作");
    return
  }
  // 获取社群信息数据
  const communityInfo: any = currentCommunity.value?.item;
  // 根据当前路由检测是否在home页面
  const isHome = router.currentRoute.value.fullPath === "/main";
  if (isHome) {
    enterOwnerDesk(communityInfo);
  } else {
    router.push({ name: "home", params: {} });
    enterOwnerDesk(communityInfo);
  }
};

// 进入社群桌面公共方法
const enterOwnerDesk = (communityInfo: any) => {
  // 管理员
  if (communityInfo?.role === "owner") {
    // 获取当前管理员社群下的所有桌面列表
    const ownerDesks = getCommunityDeskList(communityInfo);
    if (ownerDesks.length !== 0) {
      settings.value.isCommunity = false;
    } else {
      proxy.$bus.emit("openCommunityDesk");
      settings.value.isCommunity = false;
    }
  }
  // 成员
  else if (communityInfo?.role === "member") {
    const no = communityInfo?.no;
    if(!loadDesk.value[no]){
      communityDesk.downloadCommunityAllDesktop(no)
      settings.value.isCommunity = false;
    }
    else {
      settings.value.isCommunity = false;
    }
  }
};


onMounted(() => {
  proxy.$bus.on("updateSetting", () => {
    communityDesk.setCommunityInfo(currentCommunity.value?.item);
  });
});
</script>

<style lang="scss" scoped>
.communityNav {
  // 单个
  &-item {
    &:nth-of-type(3) {
      padding: 0 14px 0 0 !important;
    }
  }
  // 多个
  &-more {
    &:nth-of-type(4) {
      padding: 0 14px 0 0 !important;
    }
    &:nth-of-type(3) {
      padding: 0 14px 0 0 !important;
    }
  }
}
</style>
