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
import { message } from "ant-design-vue";

import Folder from "../../../apps/folder/src/Folder.vue";
import TeamEmpty from "../empty/TeamEmpty.vue";
// import AppModal from "./AppModal.vue";

const emit = defineEmits(["close"]);

const communityNav = communityNavStore();
const { layOut, settingType, appModalList } = storeToRefs(communityNav);
const { proxy } = getCurrentInstance();

const navBar = ref({
  isOut: true,
  resize: true,
  sizeOption: true,
  isDel: true,
  hierarchy: true,
  close: true,
  customRight: false,
});
const headerTitle = ref("网址导航");
const teamFolderRef = ref(null);

const layOutIcon = computed(() => {
  if (layOut.value === "rows") {
    return "fluent:grid-16-regular";
  } else {
    return "fluent:apps-list-detail-24-regular";
  }
});

const navList = computed(() => {
  return appModalList.value[1]?.list;
  // const filterList = teamNavList.value.filter((item) => {
  //   return item !== null;
  // });
  // return filterList;
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
      {
        newIcon: "fluent:app-folder-16-regular",
        title: "应用模式",
        fn: () => {
          window.$ui.confirm(
            "使用「应用模式」",
            "切换到「应用模式」，将为你保留当前已经添加的网站和应用。",
            {
              type: "warning",
              ok: () => {
                proxy.$bus.emit("openAppVisible");
                settingType.value = "app";
                closeNav();
              },
              no:()=>{
                settingType.value = "component";
              },
              noText: "取消",
            }
          );
        },
      },
      {
        newIcon: "fluent:settings-16-regular",
        title: "设置",
        fn: () => {
          teamFolderRef.value.openSetVisible();
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
  const index = appModalList.value[1]?.list?.indexOf(data);
  appModalList.value[1]?.list?.splice(index, 1);
  message.success('应用移除成功')
};
// 添加
const createNav = (data) => {
  if (
    data.value === "commun" ||
    data.value === "control" ||
    data.value === "setting"
  ) {
    message.warning("该应用不支持添加");
  } else {
    const index = appModalList.value[1]?.list?.indexOf(data);
    if (index === -1) {
      appModalList.value[1]?.list?.push({...data,favo:false,});
      message.success('应用添加成功');
    }
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