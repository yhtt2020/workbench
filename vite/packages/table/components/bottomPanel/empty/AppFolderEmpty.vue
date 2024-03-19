<template>
  <div class="flex w-full h-full items-center justify-center">
    <div class="grid-container">
      <div v-for="item in list" class="grid-item xt-bg-2 rounded-xl">
        <div class="flex items-center justify-center h-full flex-col">
          <div class="flex items-center mb-3">
            <xt-ify-icon
              v-for="children in item.icon"
              :icon="children"
              class="mr-3 addFolder-icon"
              size="32"
            ></xt-ify-icon>
          </div>
          <div style="max-width: 200px; text-align: center" class="mb-4">
            <span class="font-16 xt-text xt-font">{{ item.title }}</span>
          </div>
          <xt-button
            v-if="item.btnText !== ''"
            type="theme"
            w="84"
            h="32"
            style="border-radius: 8px"
            @click="item.fn"
          >
            {{ item.btnText }}
          </xt-button>
          <xt-button
            v-if="item.disableBtnText !== ''"
            w="84"
            h="32"
            class="xt-bg-t-2"
            style="border-radius: 8px"
          >
            {{ item.disableBtnText }}
          </xt-button>
        </div>
      </div>
    </div>
  </div>

  <EditNavigation
    v-if="editVisible"
    @setQuick="editVisible = false"
    :isFolder="true"
    @addIcon="addFolderApp"
  />
</template>

<script setup>
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { communityNavStore } from "../store/communityNavStore";

import EditNavigation from "../../desk/addIcon/EditNewNavigation.vue";
import { message } from "ant-design-vue";

const communityNav = communityNavStore();
const { appFolderIndex, appModalList } = storeToRefs(communityNav);

const editVisible = ref(false);
const list = ref([
  {
    icon: ["fluent:apps-add-in-16-regular"],
    title: "从应用图标选择器」中自定义添加",
    btnText: "选择添加",
    disableBtnText: "",
    fn: () => {
      editVisible.value = true;
    },
  },
  {
    icon: [
      "fluent:desktop-16-regular",
      "fluent:tablet-16-regular",
      "fluent:app-folder-16-regular",
    ],
    title: "从你的桌面、导航栏、分组中选择添加",
    btnText: "",
    disableBtnText: "暂不支持",
  },
  {
    icon: ["fluent:hard-drive-16-regular"],
    title: "添加软件类型图标（需要启用软件库）",
    btnText: "",
    disableBtnText: "暂不支持",
  },
  {
    icon: ["fluent:globe-16-regular"],
    title: "从外部拖动URL地址到窗口中直接添加",
    btnText: "",
    disableBtnText: "",
  },
]);

const addFolderApp = (data) => {
  if (data.value === "commun" || data.value === "control") {
    message.warning("该应用不支持添加");
  } else {
    const type = appModalList.value[appFolderIndex.value]?.type;
    if (type === undefined) {
      const id = appModalList.value[appFolderIndex.value]?.id;
      const option = {
        n_id: id,
        ...data,
      };
      if (!appModalList.value[1].list.includes(data)) {
        appModalList.value[1].list.push(option);
      }
    } else {
      if (appModalList.value[1].list.includes(data)) {
        appModalList.value[1].list.push(data);
      }
    }
    message.success('应用添加成功');
  }
};
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
.grid-item {
  width: 280px;
  height: 200px;
}
.addFolder-icon {
  &:last-of-type {
    margin-right: 0 !important;
  }
}
</style>