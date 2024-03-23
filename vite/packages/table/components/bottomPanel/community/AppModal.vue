<template>
  <xt-modal
    v-model="appModelVisible"
    custom
    boxClass="rounded-xl"
    :mask="false"
    :index="850"
  >
    <!-- 外部网页链接拖拽 -->
    <!-- <LinkDrop>
      
    </LinkDrop> -->

    <div
      style="width: 1000px; height: 720px"
      class="xt-modal flex rounded-xl relative overflow-hidden"
    >
      <LeftMenu
        :list="appModalList"
        @change="selectFolder"
        :currentIndex="appFolderIndex"
      >
        <template #leftMenuBottom>
          <div class="flex items-center h-10">
            <a-tooltip title="添加">
              <xt-dropdown
                newIcon="fluent:add-16-regular"
                :placement="'topLeft'"
                :iconSize="24"
                :w="32"
                :h="32"
              >
                <div
                  style="min-width: 200px; border: 1px solid var(--divider)"
                  class="rounded-xl flex flex-col xt-bg-2 p-2"
                >
                  <div
                    v-for="item in editList"
                    class="flex items-center rounded-xl p-3 xt-hover"
                    @click="item.fn"
                  >
                    <xt-ify-icon
                      :icon="item.icon"
                      size="20"
                      class="mr-3"
                    ></xt-ify-icon>
                    <span>{{ item.name }}</span>
                  </div>
                </div>
              </xt-dropdown>
            </a-tooltip>

            <xt-button class="mx-3" w="32" h="32" style="border-radius: 8px">
              <div class="flex items-center justify-center">
                <xt-ify-icon
                  icon="fluent:cloud-checkmark-16-regular"
                  size="20"
                ></xt-ify-icon>
              </div>
            </xt-button>
            <a-tooltip title="设置">
              <xt-button
                w="32"
                h="32"
                style="border-radius: 8px"
                @click="enterSetting"
              >
                <div class="flex items-center justify-center">
                  <xt-ify-icon
                    icon="fluent:settings-16-regular"
                    size="20"
                  ></xt-ify-icon>
                </div>
              </xt-button>
            </a-tooltip>
          </div>
        </template>
      </LeftMenu>
      <div class="w-full h-full flex flex-col">
        <Search @close="appModelVisible = false"></Search>
        <div class="grow">
          <xt-scrollbar :y="true" class="w-full p-3" style="height: 650px">
            <RightListDeatil :detailIndex="appFolderIndex" />
          </xt-scrollbar>
        </div>
      </div>
    </div>
  </xt-modal>

  <CreateFolder ref="appCreateFolder" />

  <EditNewNavigation
    v-if="editVisible"
    :isFolder="true"
    @setQuick="editVisible = false"
    @addIcon="addAppFile"
  />

  <!-- <Setting ref="appSetting"/> -->
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";
import { message } from "ant-design-vue";

import LeftMenu from "../left/LeftMenu.vue";
import CreateFolder from "./CreateFolder.vue";
import Search from "../search/ComModalSearch.vue";
import RightListDeatil from "./RightListDeatil.vue";
import EditNewNavigation from "../../desk/addIcon/EditNewNavigation.vue";
// import Setting from "../setting/CommunitySetting.vue";
// import LinkDrop from "../drop/LinkDrop.vue";

const { proxy } = getCurrentInstance();

const communityNav = communityNavStore();
const { appModalList, appFolderIndex } =
  storeToRefs(communityNav);

const appModelVisible = ref(false);
const editVisible = ref(false);
const appCreateFolder = ref(null);
const appSetting = ref(null);

// 编辑操作列表
const editList = ref([
  {
    icon: "fluent:add-16-regular",
    name: "添加应用",
    fn: () => {
      editVisible.value = true;
    },
  },
  {
    name:'从桌面、导航和分组中选择',
    icon:'fluent:app-folder-16-regular',
    fn:()=>{
      proxy.$bus.emit('openDeskAppModal');
    }
  },
  {
    icon: "fluent:folder-16-regular",
    name: "添加文件夹",
    fn: () => {
      appCreateFolder.value.openCreateFolder();
    },
  },
]);

// 添加数据
const addAppFile = (data) => {
  if (data.value === "commun" || data.value === "control") {
    message.warning("该应用不支持添加");
  } else {
    // 添加类型、 全部 、收藏
    const type = appModalList.value[appFolderIndex.value].type;
    if (type === undefined) {
      const option = {
        n_id: appModalList.value[appFolderIndex.value].id,
        ...data,
        favo: false,
      };
      appModalList.value[1].list.push(option);
      editVisible.value = false;
    } else if (type === "all") {
      const index = appModalList.value[appFolderIndex.value].list.findIndex(
        (item) => {
          return String(item.name) === String(data.name);
        }
      );
      if (index === -1) {
        appModalList.value[appFolderIndex.value].list.push({
          ...data,
          favo: false,
        });
      }
      editVisible.value = false;
    }
    message.success("应用添加成功");
  }
};
// 选择切换文件数据
const selectFolder = (data) => {
  appFolderIndex.value = data;
};
// 设置
const enterSetting = () => {
  // appSetting.value.openAppSetting();
  proxy.$bus.emit("openAppSetting");
};

onMounted(() => {
  proxy.$bus.on("openAppVisible", () => {
    appModelVisible.value = true;
  });
  proxy.$bus.on("closeModal", () => {
    appModelVisible.value = false;
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