<template>
  <Folder
    :navBar="navBar"
    :customData="teamNavData"
    @deleteNavApp="deleteNav"
    @createNav="createNav"
    :expand="{ disabled: true }"
    :auto="true"
    :secondary="true"
    ref="teamFolderRef"
  >
    <template #navEmpty>
      <TeamEmpty @close="closeNav" />
    </template>
    <template #customRightMenu>
      <xt-dropdown :buttonVisible="false" :placement="'bottomRight'">
        <template #sendIcon>
          <xt-ify-icon icon="fluent:line-horizontal-3-20-filled"></xt-ify-icon>
        </template>
        <div class="xt-bg-2 rounded-xl p-2" style="width: 180px">
          <template v-for="item in dropList">
            <div
              class="px-3 py-2 flex items-center pointer rounded-lg w-full xt-hover"
              @click="item.fn"
            >
              <xt-ify-icon
                :icon="item.icon"
                size="20"
                class="mr-3"
              ></xt-ify-icon>
              <span class="xt-font xt-text font-16">{{ item.name }}</span>
            </div>
          </template>
        </div>
      </xt-dropdown>
    </template>
  </Folder>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted, warn } from "vue";
import {
  defaultData,
  defaultFolderData,
} from "../../../apps/folder/src/components/options";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

import Folder from "../../../apps/folder/src/Folder.vue";
import TeamEmpty from "../empty/TeamEmpty.vue";
// import AppModal from "./AppModal.vue";

const emit = defineEmits(["close"]);

const communityNav = communityNavStore();
const { teamNavList, layOut, settingEnable,settingType } = storeToRefs(communityNav);
const { proxy } = getCurrentInstance();

const navBar = ref({
  isOut: true,
  resize: false,
  sizeOption: false,
  isDel: true,
  hierarchy: true,
  close: true,
  customRight: true,
});
const headerTitle = ref("网址导航");
const teamFolderRef = ref(null);
const dropList = ref([
  {
    icon: "fluent:app-folder-16-regular",
    name: "应用模式",
    fn: () => {
      window.$ui.confirm(
        "使用「应用模式」",
        "切换到「应用模式」，将为你保留当前已经添加的网站和应用。",
        {
          type: "warning",
          ok: () => {
            settingType.value = "app";
            proxy.$bus.emit("openAppVisible");
            closeNav();
          },
          noText: "取消",
        }
      );
    },
  },
  {
    icon: "fluent:settings-16-regular",
    name: "设置",
    fn: () => {
      teamFolderRef.value.openSetVisible();
    },
  },
]);

const layOutIcon = computed(() => {
  if (layOut.value === "rows") {
    return "fluent:grid-16-regular";
  } else {
    return "fluent:apps-list-detail-24-regular";
  }
});

const navList = computed(() => {
  const filterList = teamNavList.value.filter((item) => {
    return item !== null;
  });
  return filterList;
});

const teamNavData = computed(() => {
  return {
    ...defaultFolderData,
    customSize: "4x4",
    list: [...navList.value],
    layout: layOut.value,
    menuList: [
      {
        newIcon: "fluent:add-16-filled",
        title: "添加图标",
        fn: () => {
          teamFolderRef.value.editVisible = true;
        },
      },
      {
        newIcon: "fluent:cloud-checkmark-16-regular",
        title: "同步状态",
        fn: () => {},
      },
      {
        newIcon: layOutIcon.value,
        title: "排列方式",
        fn: () => {
          if (layOut.value === "rows") {
            layOut.value = "columns";
          } else {
            layOut.value = "rows";
          }
        },
      },
    ],
    header: {
      ifyIcon: "fluent:globe-16-regular",
      title: headerTitle.value,
      rightIcon: [
        {
          ifyIcon: "fluent:add-16-filled",
          tip: "添加应用",
          fn: () => {
            teamFolderRef.value.editVisible = true;
          },
        },
        {
          ifyIcon: "fluent:cloud-checkmark-16-regular",
          tip: "同步状态",
          fn: () => {},
        },
        {
          ifyIcon: layOutIcon.value,
          fn: () => {
            if (layOut.value === "rows") {
              layOut.value = "columns";
            } else {
              layOut.value = "rows";
            }
          },
          tip: "排列方式",
        },
      ],
      leftHover: false,
    },
  };
});

// 删除
const deleteNav = (data) => {
  const index = teamNavList.value.findIndex((item) => {
    return item.name === data.name;
  });
  teamNavList.value.splice(index, 1);
};
// 添加
const createNav = (data) => {
  const index = teamNavList.value.findIndex((item) => {
    return item.name === data.name;
  });
  if (index === -1) {
    teamNavList.value.push(data);
  }
};

const closeNav = () => {
  emit("close");
};

onMounted(() => {
  proxy.$bus.on("getApp", (data) => {
    createNav(data);
    proxy.$bus.emit("closeNav");
  });
});
</script>

<style lang="scss" scoped>
.xt-hover {
  &:hover {
    background: var(--active-secondary-bg) !important;
  }
}
</style>