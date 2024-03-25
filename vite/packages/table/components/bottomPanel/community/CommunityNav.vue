<template>
  <div
    class="communityNav xt-shadow mr-3"
    :style="communityNum ? { width: '305px' } : { width: '233px' }"
  >
    <div
      v-for="item in communityNavList.slice(0, 1)"
      class="communityNav-more pointer"
      @click="item.fn"
    >
      <a-tooltip :title="item.name">
        <Avatar :item="item" />
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

    <div
      v-for="item in communityNavList.slice(1)"
      class="communityNav-more pointer"
      @click="item.fn"
    >
      <a-tooltip :title="item.name">
        <Avatar :item="item" />
      </a-tooltip>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { computed, ref, getCurrentInstance, onMounted } from "vue";
import { nanoid } from "nanoid";
import { communityStore } from "../../../page/chat/store/communityStore";
import { useRouter } from "vue-router";
import { communityNavStore } from "../store/communityNavStore";

import Avatar from "../../desk/navigationBar/components/Avatar.vue";

const communityNav = communityStore();
const { community } = storeToRefs(communityNav);
const router = useRouter();
const comNav = communityNavStore();
const { settingType, currentCommunity } = storeToRefs(comNav);

const { proxy } = getCurrentInstance();

// 根据社群数量进行调整
const communityNum = computed(() => {
  return community.value.communityList.length !== 0;
});

const communityNavList = computed(() => {
  if (communityNum.value) {
    return [
      {
        ...currentCommunity.value.item,
        fn: (event) => {
          proxy.$bus.emit("openComSearch", event);
        },
      },
      {
        icon: currentCommunity.value.item?.role
          ? `${currentCommunity.value.item.icon}` : `${currentCommunity.value.defaultItem.icon}`,
        name: "社群主应用",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(13),
        fn: () => {
          if(currentCommunity.value.item.role){
            router.push({ name: "myCommunity", params: { ...currentCommunity.value.item } })
          }
          else{
            router.push({ name: "defaultCommunity", params: { no: 1 } });
          }
        },
      },
      {
        icon: "/logo/browser.svg",
        name: "团队导航",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(12),
        fn: (event) => {
          openNav(event);
        },
      },
      {
        icon: "/logo/teamNav.svg",
        name: "团队桌面",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(13),
        fn: () => {},
      },
    ];
  } else {
    return [
      {
        value: "task",
        name: "想天社群",
        icon: "/icons/logo128.png",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(11),
        fn: () => {
          router.push({ name: "defaultCommunity", params: { no: 1 } });
        },
      },
      {
        icon: "/logo/browser.svg",
        name: "团队导航",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(12),
        fn: (event) => {
          openNav(event);
        },
      },
      {
        icon: "/logo/teamNav.svg",
        name: "团队桌面",
        bg: "",
        isBg: false,
        mode: "app",
        type: "systemApp",
        id: nanoid(13),
        fn: () => {},
      },
    ];
  }
});

const openNav = (event) => {
  if (settingType.value === "app") {
    proxy.$bus.emit("openAppVisible");
  } else {
    proxy.$bus.emit("openTeamNav", event);
  }
};
</script>

<style lang="scss" scoped>
.communityNav {
  backdrop-filter: blur(50px);
  background: var(--primary-bg);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--divider);
  padding: 14px;
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